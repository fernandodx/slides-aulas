import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "./firebase.config";

/**
 * Service to manage Seminar topic claims with real-time concurrency control and atomic Firestore transactions.
 *
 * Topic lifecycle:
 *  - "open"   → topic has at least one student but has NOT reached maxStudents yet (more can join)
 *  - "full"   → topic has reached maxStudents and is locked (no more registrations accepted)
 */
class SeminarService {
  /**
   * Listen to real-time seminar registrations for a specific course.
   * @param {string} courseId - e.g. "desenvolvimento-web"
   * @param {function} onUpdate - callback receiving map of claimed topics { [topicId]: registrationData }
   * @param {function} onError - error callback
   * @returns {function} unsubscribe function
   */
  subscribeToSeminar(courseId, onUpdate, onError = () => {}) {
    const db = getFirestoreDb();

    if (!db) {
      console.warn(
        "[SeminarService] Firestore not initialized. Falling back to local storage sync."
      );
      const localKey = `seminar_local_${courseId}`;
      const loadLocal = () => {
        try {
          const raw = localStorage.getItem(localKey);
          return raw ? JSON.parse(raw) : {};
        } catch {
          return {};
        }
      };

      onUpdate(loadLocal());

      const handleStorage = (event) => {
        if (event.key === localKey) {
          onUpdate(loadLocal());
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }

    try {
      const topicsColRef = collection(db, "seminars", courseId, "topics");
      return onSnapshot(
        topicsColRef,
        (snapshot) => {
          const claimedMap = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            claimedMap[docSnap.id] = {
              id: docSnap.id,
              ...data,
              claimedAt: data.claimedAt?.toDate
                ? data.claimedAt.toDate()
                : data.claimedAt,
            };
          });
          onUpdate(claimedMap);
        },
        (error) => {
          console.error("[SeminarService] Real-time listener error:", error);
          onError(error);
        }
      );
    } catch (err) {
      console.error("[SeminarService] Failed to establish snapshot listener:", err);
      onError(err);
      return () => {};
    }
  }

  /**
   * Atomically joins a topic for a student.
   *
   * Rules:
   *  - If the topic has no registration yet → create it with status "open" or "full".
   *  - If the topic is "open" (students < maxStudents) → append new student(s) and upgrade
   *    status to "full" if the limit is now reached.
   *  - If the topic is already "full" → reject with TOPIC_FULL.
   *  - Duplicate names (case-insensitive) are rejected with DUPLICATE_STUDENT.
   *
   * @param {string} courseId - Course identifier
   * @param {object} topic - Topic definition object ({ id, title, maxStudents })
   * @param {string[]} studentNames - Array of student names to add
   * @returns {Promise<{success: boolean, reason?: string, message?: string, existing?: object}>}
   */
  async claimTopic(courseId, topic, studentNames) {
    const cleanedStudents = (studentNames || [])
      .map((name) => (typeof name === "string" ? name.trim() : ""))
      .filter((name) => name.length > 0);

    const maxStudents = Number(topic.maxStudents) || 4;

    if (cleanedStudents.length === 0) {
      return {
        success: false,
        reason: "EMPTY_STUDENTS",
        message: "Por favor, informe ao menos um integrante para a equipe.",
      };
    }

    if (cleanedStudents.length > maxStudents) {
      return {
        success: false,
        reason: "MAX_EXCEEDED",
        message: `O limite máximo para este tema é de ${maxStudents} alunos.`,
      };
    }

    const db = getFirestoreDb();

    if (!db) {
      // Local fallback for offline/development environments
      const localKey = `seminar_local_${courseId}`;
      const raw = localStorage.getItem(localKey);
      const data = raw ? JSON.parse(raw) : {};

      const existing = data[topic.id];

      if (existing) {
        const existingStudents = Array.isArray(existing.students) ? existing.students : [];
        const existingMax = Number(existing.maxStudents) || maxStudents;
        const currentCount = existingStudents.length;

        // Treat as full: new "full" status, OR any record at/above capacity (covers legacy "claimed")
        const isFull =
          existing.status === "full" ||
          currentCount >= existingMax;

        if (isFull) {
          return {
            success: false,
            reason: "TOPIC_FULL",
            message: `Este tema já atingiu o limite de ${existingMax} alunos e não aceita mais inscrições.`,
            existing,
          };
        }

        // Topic is open — check if adding new students would exceed the limit
        const totalAfter = currentCount + cleanedStudents.length;

        if (totalAfter > existingMax) {
          const remaining = existingMax - currentCount;
          return {
            success: false,
            reason: "EXCEEDS_REMAINING",
            message: `O tema só tem ${remaining} vaga(s) restante(s). Reduza a quantidade de integrantes.`,
            existing,
          };
        }

        // Check for duplicate names (case-insensitive)
        const existingLower = existingStudents.map((s) => s.toLowerCase());
        const duplicate = cleanedStudents.find((s) =>
          existingLower.includes(s.toLowerCase())
        );
        if (duplicate) {
          return {
            success: false,
            reason: "DUPLICATE_STUDENT",
            message: `O aluno "${duplicate}" já está registrado neste tema.`,
            existing,
          };
        }

        const updatedStudents = [...existingStudents, ...cleanedStudents];
        data[topic.id] = {
          ...existing,
          students: updatedStudents,
          status: updatedStudents.length >= existingMax ? "full" : "open",
          updatedAt: new Date().toISOString(),
        };
      } else {
        // First registration for this topic
        data[topic.id] = {
          topicId: topic.id,
          topicTitle: topic.title,
          students: cleanedStudents,
          maxStudents,
          status: cleanedStudents.length >= maxStudents ? "full" : "open",
          claimedAt: new Date().toISOString(),
        };
      }

      localStorage.setItem(localKey, JSON.stringify(data));
      window.dispatchEvent(new StorageEvent("storage", { key: localKey }));
      return { success: true };
    }

    const topicRef = doc(db, "seminars", courseId, "topics", topic.id);

    // Sentinel class — detected via instanceof AND a string tag as belt-and-suspenders,
    // since Firestore may wrap errors in ways that break instanceof across module boundaries.
    class SeminarAppError extends Error {
      constructor(reason, message, extra = {}) {
        super(message);
        this.name = "SeminarAppError";
        this.seminarReason = reason;
        this.seminarExtra = extra;
      }
    }

    try {
      await runTransaction(db, async (transaction) => {
        const topicSnap = await transaction.get(topicRef);

        if (topicSnap.exists()) {
          const existingData = topicSnap.data();
          const existingStudents = Array.isArray(existingData.students)
            ? existingData.students
            : [];
          const currentCount = existingStudents.length;
          const existingMax = Number(existingData.maxStudents) || maxStudents;

          // Full = explicit "full" status OR already at/above capacity (covers legacy "claimed")
          const isFull =
            existingData.status === "full" || currentCount >= existingMax;

          if (isFull) {
            throw new SeminarAppError(
              "TOPIC_FULL",
              `Este tema já atingiu o limite de ${existingMax} alunos e não aceita mais inscrições.`,
              { existing: existingData }
            );
          }

          // Check capacity for the new students
          const totalAfter = currentCount + cleanedStudents.length;
          if (totalAfter > existingMax) {
            throw new SeminarAppError(
              "EXCEEDS_REMAINING",
              `O tema só tem ${existingMax - currentCount} vaga(s) restante(s). Reduza a quantidade de integrantes.`,
              { existing: existingData }
            );
          }

          // Check for duplicate names (case-insensitive)
          const existingLower = existingStudents.map((s) => s.toLowerCase());
          const duplicate = cleanedStudents.find((s) =>
            existingLower.includes(s.toLowerCase())
          );
          if (duplicate) {
            throw new SeminarAppError(
              "DUPLICATE_STUDENT",
              `O aluno "${duplicate}" já está registrado neste tema.`,
              { existing: existingData }
            );
          }

          const updatedStudents = [...existingStudents, ...cleanedStudents];
          transaction.update(topicRef, {
            students: updatedStudents,
            status: updatedStudents.length >= existingMax ? "full" : "open",
            updatedAt: serverTimestamp(),
          });
        } else {
          // First registration for this topic
          transaction.set(topicRef, {
            topicId: topic.id,
            topicTitle: topic.title,
            students: cleanedStudents,
            maxStudents,
            status: cleanedStudents.length >= maxStudents ? "full" : "open",
            claimedAt: serverTimestamp(),
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          });
        }
      });

      return { success: true };
    } catch (err) {
      console.warn("[SeminarService] Firestore transaction error:", err);

      // Unwrap: Firestore may wrap our error — check instanceof, name tag, and cause chain
      const isSeminarError = (e) =>
        e instanceof SeminarAppError || e?.name === "SeminarAppError";
      const appErr = isSeminarError(err) ? err
        : isSeminarError(err?.cause) ? err.cause
        : null;

      if (appErr) {
        return {
          success: false,
          reason: appErr.seminarReason,
          message: appErr.message,
          ...appErr.seminarExtra,
        };
      }

      return {
        success: false,
        reason: "TRANSACTION_FAILED",
        message:
          "Não foi possível concluir o registro. Pode ter ocorrido uma oscilação na rede ou conflito de envio. Tente novamente.",
      };
    }
  }
}

export const seminarService = new SeminarService();

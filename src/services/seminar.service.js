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
        if (existing.status === "full") {
          return {
            success: false,
            reason: "TOPIC_FULL",
            message: `Este tema já atingiu o limite de ${maxStudents} alunos e não aceita mais inscrições.`,
            existing,
          };
        }

        // Topic is open — check if adding new students would exceed the limit
        const currentCount = existing.students?.length || 0;
        const totalAfter = currentCount + cleanedStudents.length;

        if (totalAfter > maxStudents) {
          const remaining = maxStudents - currentCount;
          return {
            success: false,
            reason: "EXCEEDS_REMAINING",
            message: `O tema só tem ${remaining} vaga(s) restante(s). Reduza a quantidade de integrantes.`,
            existing,
          };
        }

        // Check for duplicate names (case-insensitive)
        const existingLower = (existing.students || []).map((s) => s.toLowerCase());
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

        const updatedStudents = [...existing.students, ...cleanedStudents];
        data[topic.id] = {
          ...existing,
          students: updatedStudents,
          status: updatedStudents.length >= maxStudents ? "full" : "open",
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

    try {
      await runTransaction(db, async (transaction) => {
        const topicSnap = await transaction.get(topicRef);

        if (topicSnap.exists()) {
          const existingData = topicSnap.data();

          if (existingData.status === "full") {
            const err = new Error("TOPIC_FULL");
            err.code = "TOPIC_FULL";
            err.existingData = existingData;
            throw err;
          }

          // Topic is open — check capacity
          const currentCount = existingData.students?.length || 0;
          const totalAfter = currentCount + cleanedStudents.length;

          if (totalAfter > maxStudents) {
            const err = new Error("EXCEEDS_REMAINING");
            err.code = "EXCEEDS_REMAINING";
            err.remaining = maxStudents - currentCount;
            err.existingData = existingData;
            throw err;
          }

          // Check for duplicate names
          const existingLower = (existingData.students || []).map((s) =>
            s.toLowerCase()
          );
          const duplicate = cleanedStudents.find((s) =>
            existingLower.includes(s.toLowerCase())
          );
          if (duplicate) {
            const err = new Error("DUPLICATE_STUDENT");
            err.code = "DUPLICATE_STUDENT";
            err.duplicate = duplicate;
            err.existingData = existingData;
            throw err;
          }

          const updatedStudents = [...existingData.students, ...cleanedStudents];
          transaction.update(topicRef, {
            students: updatedStudents,
            status: updatedStudents.length >= maxStudents ? "full" : "open",
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
      console.warn("[SeminarService] Claim transaction result:", err);

      if (err.code === "TOPIC_FULL") {
        return {
          success: false,
          reason: "TOPIC_FULL",
          message: `Este tema já atingiu o limite de ${maxStudents} alunos e não aceita mais inscrições.`,
          existing: err.existingData,
        };
      }

      if (err.code === "EXCEEDS_REMAINING") {
        return {
          success: false,
          reason: "EXCEEDS_REMAINING",
          message: `O tema só tem ${err.remaining} vaga(s) restante(s). Reduza a quantidade de integrantes.`,
          existing: err.existingData,
        };
      }

      if (err.code === "DUPLICATE_STUDENT") {
        return {
          success: false,
          reason: "DUPLICATE_STUDENT",
          message: `O aluno "${err.duplicate}" já está registrado neste tema.`,
          existing: err.existingData,
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

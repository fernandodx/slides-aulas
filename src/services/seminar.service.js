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
   * Atomically claims a topic for a team.
   * If another user already registered this topic (even a split second earlier),
   * this transaction fails safely and returns an error explaining the conflict.
   *
   * @param {string} courseId - Course identifier
   * @param {object} topic - Topic definition object ({ id, title, maxStudents })
   * @param {string[]} studentNames - Array of student names
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

      if (data[topic.id]) {
        return {
          success: false,
          reason: "ALREADY_CLAIMED",
          message:
            "Ops! Este tema acabou de ser escolhido por outro grupo antes de você confirmar. Por favor, escolha outro tema disponível.",
          existing: data[topic.id],
        };
      }

      data[topic.id] = {
        topicId: topic.id,
        topicTitle: topic.title,
        students: cleanedStudents,
        maxStudents,
        status: "claimed",
        claimedAt: new Date().toISOString(),
      };
      localStorage.setItem(localKey, JSON.stringify(data));
      window.dispatchEvent(new Event("storage"));
      return { success: true };
    }

    const topicRef = doc(db, "seminars", courseId, "topics", topic.id);

    try {
      await runTransaction(db, async (transaction) => {
        const topicSnap = await transaction.get(topicRef);

        if (topicSnap.exists()) {
          const existingData = topicSnap.data();
          const err = new Error("TOPIC_ALREADY_CLAIMED");
          err.code = "ALREADY_CLAIMED";
          err.existingData = existingData;
          throw err;
        }

        transaction.set(topicRef, {
          topicId: topic.id,
          topicTitle: topic.title,
          students: cleanedStudents,
          maxStudents,
          status: "claimed",
          claimedAt: serverTimestamp(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        });
      });

      return { success: true };
    } catch (err) {
      console.warn("[SeminarService] Claim transaction result:", err);

      if (err.code === "ALREADY_CLAIMED" || err.message === "TOPIC_ALREADY_CLAIMED") {
        return {
          success: false,
          reason: "ALREADY_CLAIMED",
          message:
            "Ops! Este tema acabou de ser registrado por outro grupo enquanto você digitava. Por favor, selecione outro tema disponível.",
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

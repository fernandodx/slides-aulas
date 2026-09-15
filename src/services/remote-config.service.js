import { getValue, fetchAndActivate } from "firebase/remote-config";
import { getRemoteConfigInstance, isFirebaseConfigured } from "./firebase.config";

class RemoteConfigService {
  constructor() {
    this.fallbackConfig = {
      course_desenvolvimento_de_interfaces_enabled: true,
      course_desenvolvimento_de_interfaces_config: JSON.stringify({
        enabled: true,
        bannerMessage:
          "Bem-vindo à disciplina de Desenvolvimento de Interfaces!",
        disabledLessons: [],
      }),
    };
    this.initPromise = null;
  }

  async ensureInitialized() {
    if (!this.initPromise) {
      this.initPromise = this.refresh();
    }
    return this.initPromise;
  }

  async refresh() {
    const rc = getRemoteConfigInstance();
    if (isFirebaseConfigured() && rc) {
      try {
        await fetchAndActivate(rc);
      } catch (e) {
        console.warn("[RemoteConfigService] Refresh fallback", e);
      }
    }
  }

  getFlag(key, defaultValue = true) {
    const rc = getRemoteConfigInstance();
    if (isFirebaseConfigured() && rc) {
      try {
        const val = getValue(rc, key);
        if (val && val.asBoolean !== undefined) {
          return val.asBoolean();
        }
      } catch (e) {
        console.warn(`[RemoteConfigService] Failed to read flag ${key}`, e);
      }
    }

    if (key in this.fallbackConfig) {
      return this.fallbackConfig[key];
    }

    return defaultValue;
  }

  getCourseConfig(courseId) {
    const key = `course_${courseId.replace(/-/g, "_")}_config`;
    const rc = getRemoteConfigInstance();
    if (isFirebaseConfigured() && rc) {
      try {
        const val = getValue(rc, key);
        if (val && val.asString()) {
          return JSON.parse(val.asString());
        }
      } catch (e) {
        console.warn(
          `[RemoteConfigService] Failed to parse course JSON config for ${courseId}`,
          e
        );
      }
    }

    if (key in this.fallbackConfig) {
      try {
        return JSON.parse(this.fallbackConfig[key]);
      } catch (e) {}
    }

    return { enabled: true, disabledLessons: [] };
  }

  isCourseEnabled(courseId) {
    const courseConfig = this.getCourseConfig(courseId);
    if (
      courseConfig &&
      typeof courseConfig.enabled === "boolean" &&
      !courseConfig.enabled
    ) {
      return false;
    }

    const flagKey = `course_${courseId.replace(/-/g, "_")}_enabled`;
    return this.getFlag(flagKey, true);
  }

  isLessonEnabled(courseId, lessonNumber) {
    const strLesson = String(lessonNumber).trim();
    if (strLesson.startsWith("avaliacao")) {
      return this.isAssessmentEnabled(courseId, strLesson);
    }

    const courseConfig = this.getCourseConfig(courseId);
    if (!courseConfig.enabled) return false;

    const disabledList = Array.isArray(courseConfig.disabledLessons)
      ? courseConfig.disabledLessons.map(Number)
      : [];

    if (disabledList.includes(Number(lessonNumber))) {
      return false;
    }

    return true;
  }

  isAssessmentEnabled(courseId, assessmentId) {
    const courseConfig = this.getCourseConfig(courseId);
    if (courseConfig && courseConfig.enabled === false) return false;

    // Normaliza ID: ex "avaliacao-01", 1, "1"
    const strId = String(assessmentId).trim().toLowerCase();
    const num = parseInt(strId.replace(/\D/g, ""), 10) || 1;
    const standardKey = `avaliacao-${String(num).padStart(2, "0")}`;

    // 1. Verifica flag booleana direta no Remote Config se existir (ex: course_desenvolvimento_web_avaliacao_01_enabled)
    const directKeyPad = `course_${courseId.replace(/-/g, "_")}_avaliacao_${String(num).padStart(2, "0")}_enabled`;
    const directKeyRaw = `course_${courseId.replace(/-/g, "_")}_avaliacao_${num}_enabled`;

    const rc = getRemoteConfigInstance();
    if (isFirebaseConfigured() && rc) {
      try {
        const valPad = getValue(rc, directKeyPad);
        if (valPad && valPad.getSource() !== "static") {
          return valPad.asBoolean();
        }
        const valRaw = getValue(rc, directKeyRaw);
        if (valRaw && valRaw.getSource() !== "static") {
          return valRaw.asBoolean();
        }
      } catch (e) {
        console.warn("[RemoteConfigService] Direct assessment flag check error", e);
      }
    }

    // 2. Verifica se está explicitamente na lista de desabilitados (disabledAssessments)
    if (Array.isArray(courseConfig.disabledAssessments)) {
      const isBlocked = courseConfig.disabledAssessments.some((item) => {
        return (
          String(item).toLowerCase() === strId ||
          String(item).toLowerCase() === standardKey ||
          Number(item) === num
        );
      });
      if (isBlocked) return false;
    }

    // 3. Se houver lista explícita de liberados (enabledAssessments), apenas esses são visíveis
    if (Array.isArray(courseConfig.enabledAssessments)) {
      const isAllowed = courseConfig.enabledAssessments.some((item) => {
        return (
          String(item).toLowerCase() === strId ||
          String(item).toLowerCase() === standardKey ||
          Number(item) === num
        );
      });
      return isAllowed;
    }

    // 4. Padrão: se não estiver bloqueado, fica disponível
    return true;
  }
}

export const remoteConfigService = new RemoteConfigService();

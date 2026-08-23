import { getValue, fetchAndActivate } from "firebase/remote-config";
import { remoteConfigInstance, isFirebaseConfigured } from "./firebase.config";

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
  }

  async refresh() {
    if (isFirebaseConfigured() && remoteConfigInstance) {
      try {
        await fetchAndActivate(remoteConfigInstance);
      } catch (e) {
        console.warn("[RemoteConfigService] Refresh fallback", e);
      }
    }
  }

  getFlag(key, defaultValue = true) {
    if (isFirebaseConfigured() && remoteConfigInstance) {
      try {
        const val = getValue(remoteConfigInstance, key);
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
    if (isFirebaseConfigured() && remoteConfigInstance) {
      try {
        const val = getValue(remoteConfigInstance, key);
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
    const flagKey = `course_${courseId.replace(/-/g, "_")}_enabled`;
    return this.getFlag(flagKey, true);
  }

  isLessonEnabled(courseId, lessonNumber) {
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
}

export const remoteConfigService = new RemoteConfigService();

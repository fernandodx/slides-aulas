import { ref, computed } from "vue";
import { courseRepository } from "@/services/course.repository";
import { remoteConfigService } from "@/services/remote-config.service";

export function useCourseViewModel(courseId = "desenvolvimento-de-interfaces") {
  const course = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const isCourseUnlocked = ref(true);

  const loadCourse = async () => {
    loading.value = true;
    try {
      isCourseUnlocked.value = remoteConfigService.isCourseEnabled(courseId);
      const data = courseRepository.getCourseById(courseId);
      course.value = data;
    } catch (e) {
      error.value = "Erro ao carregar dados do curso.";
    } finally {
      loading.value = false;
    }
  };

  const isLessonUnlocked = (lessonId) => {
    return remoteConfigService.isLessonEnabled(courseId, lessonId);
  };

  const getLessonById = (lessonId) => {
    if (!course.value) return null;
    for (const mod of course.value.modules) {
      const found = mod.lessons.find((l) => l.id === parseInt(lessonId, 10));
      if (found) return found;
    }
    return null;
  };

  const totalLessons = computed(() =>
    course.value ? course.value.totalLessons : 0
  );

  return {
    course,
    loading,
    error,
    isCourseUnlocked,
    totalLessons,
    loadCourse,
    isLessonUnlocked,
    getLessonById,
  };
}

// Import course info metadata
import desenvolvimentoInfo from "@/data/courses/desenvolvimento-de-interfaces/course-info.json";
import devWebInfo from "@/data/courses/desenvolvimento-web/course-info.json";

class CourseRepository {
  constructor() {
    this.coursesMap = {
      "desenvolvimento-de-interfaces": desenvolvimentoInfo,
      "desenvolvimento-web": devWebInfo,
    };

    // Cache for loaded lesson contents
    this.lessonCache = {};
  }

  getAllCourses() {
    return Object.values(this.coursesMap);
  }

  getCourseById(courseId) {
    return this.coursesMap[courseId] || null;
  }

  async getLesson(courseId, lessonId) {
    const cacheKey = `${courseId}_${lessonId}`;
    if (this.lessonCache[cacheKey]) {
      return this.lessonCache[cacheKey];
    }

    const strId = String(lessonId).trim();
    let fileName;

    if (strId.startsWith("avaliacao")) {
      const parts = strId.split("-");
      const num = parts.length > 1 ? parts[1] : strId.replace("avaliacao", "");
      fileName = `avaliacao-${String(num).padStart(2, "0")}`;
    } else {
      fileName = `aula-${String(strId).padStart(2, "0")}`;
    }

    try {
      // Dynamic import of lesson or assessment JSON files
      const lessonData = await import(
        `@/data/courses/${courseId}/${fileName}.json`
      );
      this.lessonCache[cacheKey] = lessonData.default || lessonData;
      return this.lessonCache[cacheKey];
    } catch (error) {
      console.error(
        `[CourseRepository] Failed to load slide data for course ${courseId}, file ${fileName}`,
        error
      );
      return null;
    }
  }
}

export const courseRepository = new CourseRepository();

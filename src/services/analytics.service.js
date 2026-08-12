import { logEvent } from "firebase/analytics";
import { analyticsInstance, isFirebaseConfigured } from "./firebase.config";

class AnalyticsService {
  trackPageView(pageTitle, pagePath) {
    if (isFirebaseConfigured() && analyticsInstance) {
      try {
        logEvent(analyticsInstance, "page_view", {
          page_title: pageTitle,
          page_path: pagePath,
        });
      } catch (e) {
        console.warn("[Analytics] Failed to track page view", e);
      }
    } else {
      console.log(`[Mock Analytics] PageView: ${pageTitle} (${pagePath})`);
    }
  }

  trackSlideView(courseId, lessonId, slideIndex, totalSlides) {
    if (isFirebaseConfigured() && analyticsInstance) {
      try {
        logEvent(analyticsInstance, "slide_view", {
          course_id: courseId,
          lesson_id: lessonId,
          slide_index: slideIndex,
          total_slides: totalSlides,
        });
      } catch (e) {
        console.warn("[Analytics] Failed to track slide view", e);
      }
    } else {
      console.log(
        `[Mock Analytics] SlideView: ${courseId} / Lesson ${lessonId} / Slide ${slideIndex} of ${totalSlides}`
      );
    }
  }

  trackLessonCompleted(courseId, lessonId) {
    if (isFirebaseConfigured() && analyticsInstance) {
      try {
        logEvent(analyticsInstance, "lesson_completed", {
          course_id: courseId,
          lesson_id: lessonId,
        });
      } catch (e) {
        console.warn("[Analytics] Failed to track lesson completion", e);
      }
    } else {
      console.log(
        `[Mock Analytics] Lesson Completed: ${courseId} - Lesson ${lessonId}`
      );
    }
  }
}

export const analyticsService = new AnalyticsService();

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CourseDetailView from "@/views/CourseDetailView.vue";
import LessonSlideView from "@/views/LessonSlideView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { analyticsService } from "@/services/analytics.service";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/curso/:courseId",
    name: "course-detail",
    component: CourseDetailView,
  },
  {
    path: "/curso/:courseId/aula/:lessonId/slide/:slideIndex?",
    name: "lesson-slide",
    component: LessonSlideView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  analyticsService.trackPageView(to.name || "page", to.fullPath);
});

export default router;

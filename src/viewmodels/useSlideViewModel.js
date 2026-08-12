import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { analyticsService } from "@/services/analytics.service";

export function useSlideViewModel(courseId, lessonId, initialSlides = []) {
  const router = useRouter();
  const route = useRoute();

  const slides = ref(initialSlides);
  const currentIndex = ref(0);
  const transitionName = ref("slide-forward");
  const isFullscreen = ref(false);
  const showOverviewGrid = ref(false);
  const showNotes = ref(false);

  // Initialize from route if slide index param exists
  const syncFromRoute = () => {
    const slideParam = parseInt(route.params.slideIndex, 10);
    if (
      !isNaN(slideParam) &&
      slideParam >= 1 &&
      slideParam <= slides.value.length
    ) {
      currentIndex.value = slideParam - 1;
    }
  };

  const totalSlides = computed(() => slides.value.length);
  const currentSlide = computed(() => slides.value[currentIndex.value] || null);
  const progressPercentage = computed(() => {
    if (totalSlides.value <= 1) return 100;
    return Math.round(((currentIndex.value + 1) / totalSlides.value) * 100);
  });

  const updateRoute = (index) => {
    const targetIndex = index + 1;
    if (route.params.slideIndex !== String(targetIndex)) {
      router
        .replace({
          name: "lesson-slide",
          params: {
            courseId: courseId.value || courseId,
            lessonId: lessonId.value || lessonId,
            slideIndex: targetIndex,
          },
        })
        .catch(() => {});
    }
  };

  const nextSlide = () => {
    if (currentIndex.value < totalSlides.value - 1) {
      transitionName.value = "slide-forward";
      currentIndex.value++;
      updateRoute(currentIndex.value);
      trackSlideView();
    }
  };

  const prevSlide = () => {
    if (currentIndex.value > 0) {
      transitionName.value = "slide-backward";
      currentIndex.value--;
      updateRoute(currentIndex.value);
      trackSlideView();
    }
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides.value) {
      transitionName.value =
        index > currentIndex.value ? "slide-forward" : "slide-backward";
      currentIndex.value = index;
      updateRoute(index);
      trackSlideView();
      showOverviewGrid.value = false;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          isFullscreen.value = true;
        })
        .catch((err) => console.warn("Fullscreen request rejected", err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          isFullscreen.value = false;
        });
      }
    }
  };

  const toggleOverviewGrid = () => {
    showOverviewGrid.value = !showOverviewGrid.value;
  };

  const toggleNotes = () => {
    showNotes.value = !showNotes.value;
  };

  const trackSlideView = () => {
    analyticsService.trackSlideView(
      courseId.value || courseId,
      lessonId.value || lessonId,
      currentIndex.value + 1,
      totalSlides.value
    );
  };

  // Keyboard Navigation Handler
  const handleKeyDown = (event) => {
    // Ignore keypresses if user is typing in an input/textarea
    if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;

    switch (event.key) {
      case "ArrowRight":
      case "Space":
      case "PageDown":
        event.preventDefault();
        nextSlide();
        break;
      case "ArrowLeft":
      case "PageUp":
        event.preventDefault();
        prevSlide();
        break;
      case "f":
      case "F":
        event.preventDefault();
        toggleFullscreen();
        break;
      case "m":
      case "M":
      case "g":
      case "G":
        event.preventDefault();
        toggleOverviewGrid();
        break;
      case "Escape":
        if (showOverviewGrid.value) {
          showOverviewGrid.value = false;
        }
        break;
    }
  };

  // Touch Swipe Gesture Handler
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diffX = touchEndX - touchStartX;
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
    syncFromRoute();
    trackSlideView();

    document.addEventListener("fullscreenchange", () => {
      isFullscreen.value = Boolean(document.fullscreenElement);
    });
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  watch(
    () => route.params.slideIndex,
    () => {
      syncFromRoute();
    }
  );

  return {
    slides,
    currentIndex,
    currentSlide,
    totalSlides,
    transitionName,
    progressPercentage,
    isFullscreen,
    showOverviewGrid,
    showNotes,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleFullscreen,
    toggleOverviewGrid,
    toggleNotes,
    handleTouchStart,
    handleTouchEnd,
  };
}

<template>
  <div class="lesson-slide-view">
    <!-- Top Header Bar -->
    <header class="slide-header-bar">
      <div class="slide-header-bar__left">
        <M3Button variant="text" icon="arrow_back" @click="backToCourse">
          Ementa
        </M3Button>
        <div v-if="lesson" class="slide-header-bar__titles">
          <span class="m3-label-small module-label">{{ lesson.module }}</span>
          <h1 class="m3-title-medium lesson-heading">{{ lesson.title }}</h1>
        </div>
      </div>

      <div class="slide-header-bar__right">
        <M3Chip v-if="lesson?.tag" variant="primary">{{ lesson.tag }}</M3Chip>
      </div>
    </header>

    <!-- Main Slide Presentation Stage -->
    <main class="slide-stage">
      <div v-if="loading" class="loading-container">
        <p class="m3-body-large">Carregando slide da aula...</p>
      </div>

      <SlideViewer
        v-else-if="currentSlide"
        :current-slide="currentSlide"
        :transition-name="transitionName"
        :handle-touch-start="handleTouchStart"
        :handle-touch-end="handleTouchEnd"
      />
    </main>

    <!-- Bottom Controls Bar -->
    <SlideControls
      v-if="!loading"
      :current-index="currentIndex"
      :total-slides="totalSlides"
      :progress-percentage="progressPercentage"
      :is-fullscreen="isFullscreen"
      :show-overview-grid="showOverviewGrid"
      @next="nextSlide"
      @prev="prevSlide"
      @toggle-fullscreen="toggleFullscreen"
      @toggle-grid="toggleOverviewGrid"
    />

    <!-- Slide Overview Grid Drawer -->
    <SlideOverviewGrid
      :visible="showOverviewGrid"
      :slides="slides"
      :current-index="currentIndex"
      @close="showOverviewGrid = false"
      @select-slide="goToSlide"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import M3Button from "@/components/ui/M3Button.vue";
import M3Chip from "@/components/ui/M3Chip.vue";
import SlideViewer from "@/components/slides/SlideViewer.vue";
import SlideControls from "@/components/slides/SlideControls.vue";
import SlideOverviewGrid from "@/components/slides/SlideOverviewGrid.vue";
import { courseRepository } from "@/services/course.repository";
import { useSlideViewModel } from "@/viewmodels/useSlideViewModel";

const route = useRoute();
const router = useRouter();

const courseId = computed(
  () => route.params.courseId || "desenvolvimento-de-interfaces"
);
const lessonId = computed(() => parseInt(route.params.lessonId, 10) || 1);

const lesson = ref(null);
const loading = ref(true);
const slideDataList = ref([]);

const {
  slides,
  currentIndex,
  currentSlide,
  totalSlides,
  transitionName,
  progressPercentage,
  isFullscreen,
  showOverviewGrid,
  nextSlide,
  prevSlide,
  goToSlide,
  toggleFullscreen,
  toggleOverviewGrid,
  handleTouchStart,
  handleTouchEnd,
} = useSlideViewModel(courseId, lessonId, slideDataList.value);

const fetchLessonData = async () => {
  loading.value = true;
  try {
    const data = await courseRepository.getLesson(
      courseId.value,
      lessonId.value
    );
    if (data) {
      lesson.value = data;
      slides.value = data.slides || [];
    }
  } catch (e) {
    console.error("Failed to load lesson slides", e);
  } finally {
    loading.value = false;
  }
};

const backToCourse = () => {
  router.push({ name: "course-detail", params: { courseId: courseId.value } });
};

onMounted(() => {
  fetchLessonData();
});

watch([courseId, lessonId], () => {
  fetchLessonData();
});
</script>

<style scoped>
.lesson-slide-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
  overflow: hidden;
}

.slide-header-bar {
  height: 56px;
  background-color: var(--md-sys-color-surface-container);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 10;
}

.slide-header-bar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slide-header-bar__titles {
  display: flex;
  flex-direction: column;
}

.module-label {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 11px;
}

.lesson-heading {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
}

.slide-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.loading-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

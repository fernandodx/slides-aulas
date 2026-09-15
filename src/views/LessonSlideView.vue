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
        <p class="m3-body-large">Carregando conteúdo dos slides...</p>
      </div>

      <div v-else-if="isBlocked" class="blocked-container">
        <div class="blocked-card">
          <span class="material-icons-round blocked-icon">lock</span>
          <h2 class="m3-headline-medium">Conteúdo Bloqueado</h2>
          <p class="m3-body-large">
            Este conteúdo ou avaliação não está liberado no momento pelo professor no Remote Config.
          </p>
          <M3Button variant="filled" icon="arrow_back" @click="backToCourse">
            Voltar à Ementa do Curso
          </M3Button>
        </div>
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
const lessonId = computed(() => {
  const param = route.params.lessonId;
  return param ? String(param) : "1";
});

const lesson = ref(null);
const loading = ref(true);
const isBlocked = ref(false);
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
  isBlocked.value = false;
  try {
    const { remoteConfigService } = await import("@/services/remote-config.service");
    await remoteConfigService.ensureInitialized();

    const isAssessment = String(lessonId.value).startsWith("avaliacao");
    const isUnlocked = isAssessment
      ? remoteConfigService.isAssessmentEnabled(courseId.value, lessonId.value)
      : remoteConfigService.isLessonEnabled(courseId.value, lessonId.value);

    if (!isUnlocked) {
      isBlocked.value = true;
      return;
    }

    const data = await courseRepository.getLesson(
      courseId.value,
      lessonId.value
    );
    if (data) {
      lesson.value = data;
      if (Array.isArray(data.slides)) {
        slides.value = data.slides;
      } else if (Array.isArray(data)) {
        slides.value = data;
      } else if (data.type) {
        // Objeto de slide único diretamente na raiz do arquivo JSON
        slides.value = [data];
      } else {
        slides.value = [];
      }
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

.blocked-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.blocked-card {
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-corner-extra-large);
  padding: 48px;
  max-width: 540px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: var(--md-elevation-3);
}

.blocked-icon {
  font-size: 64px;
  color: var(--md-sys-color-error);
}
</style>

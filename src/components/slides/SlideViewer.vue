<template>
  <div
    class="slide-viewer-container"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <Transition :name="transitionName" mode="out-in">
      <div
        v-if="currentSlide"
        :key="currentSlide.id"
        class="slide-card-wrapper"
      >
        <M3Card variant="surface" class="slide-card">
          <!-- Slide Component Delegation -->
          <TheorySlideContent
            v-if="
              currentSlide.type === 'intro' || currentSlide.type === 'theory'
            "
            :slide="currentSlide"
          />

          <PracticeSlideContent
            v-else-if="currentSlide.type === 'practice'"
            :slide="currentSlide"
          />

          <CodeSlideContent
            v-else-if="currentSlide.type === 'code'"
            :slide="currentSlide"
          />

          <ImageSlideContent
            v-else-if="currentSlide.type === 'image' || currentSlide.type === 'infographic'"
            :slide="currentSlide"
          />

          <AssessmentSlideContent
            v-else-if="
              currentSlide.type === 'assessment' ||
              currentSlide.type === 'evaluation' ||
              currentSlide.type === 'avaliacao'
            "
            :slide="currentSlide"
          />
        </M3Card>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import M3Card from "@/components/ui/M3Card.vue";
import TheorySlideContent from "@/components/slides/content/TheorySlideContent.vue";
import PracticeSlideContent from "@/components/slides/content/PracticeSlideContent.vue";
import CodeSlideContent from "@/components/slides/content/CodeSlideContent.vue";
import ImageSlideContent from "@/components/slides/content/ImageSlideContent.vue";
import AssessmentSlideContent from "@/components/slides/content/AssessmentSlideContent.vue";

defineProps({
  currentSlide: {
    type: Object,
    default: null,
  },
  transitionName: {
    type: String,
    default: "slide-forward",
  },
  handleTouchStart: {
    type: Function,
    default: () => {},
  },
  handleTouchEnd: {
    type: Function,
    default: () => {},
  },
});
</script>

<style scoped>
.slide-viewer-container {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.slide-card-wrapper {
  width: 100%;
  max-width: 1500px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.slide-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 60px;
  border-radius: var(--md-shape-corner-extra-large);
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15); /* Aumentado para maior contraste no projetor */
}

@media (max-width: 768px) {
  .slide-viewer-container {
    padding: 12px;
  }
  .slide-card {
    padding: 20px;
  }
}
</style>

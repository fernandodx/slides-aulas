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
  max-width: 1100px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.slide-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  border-radius: var(--md-shape-corner-extra-large);
  overflow-y: auto;
  box-shadow: var(--md-elevation-1);
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

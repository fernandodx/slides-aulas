<template>
  <footer class="slide-controls-bar">
    <div class="slide-controls-bar__progress">
      <M3ProgressBar :value="progressPercentage" />
    </div>

    <div class="slide-controls-bar__content">
      <!-- Left Info -->
      <div class="slide-controls-bar__info">
        <span class="m3-label-large slide-controls-bar__counter">
          Slide {{ currentIndex + 1 }} de {{ totalSlides }}
        </span>
        <span class="slide-controls-bar__keyboard-hint">
          (Use as setas &larr; &rarr; ou Espaço para navegar)
        </span>
      </div>

      <!-- Center Action Buttons -->
      <div class="slide-controls-bar__actions">
        <M3Button
          variant="tonal"
          icon="arrow_back"
          :disabled="currentIndex === 0"
          @click="$emit('prev')"
        >
          Anterior
        </M3Button>

        <M3Button
          variant="filled"
          icon="arrow_forward"
          :disabled="currentIndex === totalSlides - 1"
          @click="$emit('next')"
        >
          Próximo
        </M3Button>
      </div>

      <!-- Right Toolbar Tools -->
      <div class="slide-controls-bar__tools">
        <M3Button
          variant="text"
          :icon="showOverviewGrid ? 'grid_off' : 'grid_view'"
          title="Visão Geral de Miniaturas (M)"
          @click="$emit('toggle-grid')"
        />

        <M3Button
          variant="text"
          :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          title="Tela Cheia (F)"
          @click="$emit('toggle-fullscreen')"
        />
      </div>
    </div>
  </footer>
</template>

<script setup>
import M3Button from "@/components/ui/M3Button.vue";
import M3ProgressBar from "@/components/ui/M3ProgressBar.vue";

defineProps({
  currentIndex: {
    type: Number,
    required: true,
  },
  totalSlides: {
    type: Number,
    required: true,
  },
  progressPercentage: {
    type: Number,
    required: true,
  },
  isFullscreen: {
    type: Boolean,
    default: false,
  },
  showOverviewGrid: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["next", "prev", "toggle-fullscreen", "toggle-grid"]);
</script>

<style scoped>
.slide-controls-bar {
  position: relative;
  background-color: var(--md-sys-color-surface-container-high);
  border-top: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.slide-controls-bar__progress {
  width: 100%;
}

.slide-controls-bar__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  gap: 16px;
}

.slide-controls-bar__info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slide-controls-bar__counter {
  color: var(--md-sys-color-on-surface);
}

.slide-controls-bar__keyboard-hint {
  font-size: 12px;
  color: var(--md-sys-color-outline);
}

.slide-controls-bar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slide-controls-bar__tools {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 640px) {
  .slide-controls-bar__keyboard-hint {
    display: none;
  }
  .slide-controls-bar__content {
    padding: 8px 12px;
  }
}
</style>

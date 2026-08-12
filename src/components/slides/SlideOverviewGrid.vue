<template>
  <div v-if="visible" class="slide-grid-overlay" @click.self="$emit('close')">
    <div class="slide-grid-modal">
      <div class="slide-grid-header">
        <h3 class="m3-title-large">Visão Geral dos Slides da Aula</h3>
        <M3Button variant="text" icon="close" @click="$emit('close')" />
      </div>

      <div class="slide-grid-list">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          :class="[
            'slide-thumbnail-card',
            { 'slide-thumbnail-card--active': index === currentIndex },
          ]"
          @click="$emit('select-slide', index)"
        >
          <div class="slide-thumbnail-card__badge">Slide {{ index + 1 }}</div>
          <div class="slide-thumbnail-card__title">{{ slide.title }}</div>
          <div class="slide-thumbnail-card__subtitle">{{ slide.subtitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import M3Button from "@/components/ui/M3Button.vue";

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  slides: {
    type: Array,
    default: () => [],
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
});

defineEmits(["close", "select-slide"]);
</script>

<style scoped>
.slide-grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--md-sys-color-scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
}

.slide-grid-modal {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-shape-corner-extra-large);
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--md-elevation-4);
  overflow: hidden;
}

.slide-grid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.slide-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 24px;
  overflow-y: auto;
}

.slide-thumbnail-card {
  background-color: var(--md-sys-color-surface-container);
  border: 2px solid transparent;
  border-radius: var(--md-shape-corner-medium);
  padding: 16px;
  cursor: pointer;
  transition: all var(--md-motion-duration-short) ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slide-thumbnail-card:hover {
  border-color: var(--md-sys-color-primary);
  transform: translateY(-2px);
}

.slide-thumbnail-card--active {
  border-color: var(--md-sys-color-primary);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.slide-thumbnail-card__badge {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--md-sys-color-primary);
}
.slide-thumbnail-card--active .slide-thumbnail-card__badge {
  color: var(--md-sys-color-on-primary-container);
}

.slide-thumbnail-card__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
}

.slide-thumbnail-card__subtitle {
  font-size: 12px;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

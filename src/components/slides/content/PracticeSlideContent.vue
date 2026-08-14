<template>
  <div class="slide-content-practice" :class="{ 'has-image': !!slide.content?.image, 'image-left': slide.content?.image?.position === 'left' }">
    <div class="text-column">
    <div class="slide-header">
      <M3Chip variant="success" icon="build" class="projector-chip">Prática / Atividade</M3Chip>
      <h2 class="slide-title-projector">{{ slide.title }}</h2>
      <p class="slide-subtitle-projector">{{ slide.subtitle }}</p>
    </div>

    <div v-if="slide.content?.items" class="practice-steps">
      <M3Card
        v-for="(item, idx) in slide.content.items"
        :key="idx"
        variant="outlined"
        class="step-card"
      >
        <div v-if="item.icon" class="step-icon-wrapper">
          <span class="material-icons-round step-icon">{{ item.icon }}</span>
        </div>
        <div class="step-text-content">
          <div class="step-badge">{{ item.title }}</div>
          <div class="step-detail-projector">{{ item.detail }}</div>
        </div>
      </M3Card>
    </div>

    <!-- External Links -->
    <div v-if="slide.content?.links" class="practice-links">
      <h4 class="m3-title-small">Documentações & Links Úteis:</h4>
      <div class="links-flex">
        <a
          v-for="(link, idx) in slide.content.links"
          :key="idx"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="doc-link"
        >
          <span class="material-icons-round">open_in_new</span>
          {{ link.label }}
        </a>
      </div>
    </div>

    <!-- Callout Box -->
    <div
      v-if="slide.content?.callout"
      :class="['callout-box', `callout-box--${slide.content.callout.type}`]"
    >
      <span class="material-icons-round callout-icon">priority_high</span>
      <span class="callout-text">{{ slide.content.callout.text }}</span>
    </div>
    </div>
    
    <!-- Image Column -->
    <div class="image-column" v-if="slide.content?.image">
      <img :src="slide.content.image.url" :alt="slide.content.image.alt || 'Slide image'" class="slide-image" />
    </div>
  </div>
</template>

<script setup>
import M3Chip from "@/components/ui/M3Chip.vue";
import M3Card from "@/components/ui/M3Card.vue";

defineProps({
  slide: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.slide-content-practice {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.slide-content-practice.has-image {
  flex-direction: row;
  align-items: center;
  gap: 40px;
}

.slide-content-practice.has-image.image-left {
  flex-direction: row-reverse;
}

.text-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: var(--md-shape-corner-medium);
}

.slide-title {
  color: var(--md-sys-color-primary);
  margin-top: 8px;
}

.slide-subtitle {
  color: var(--md-sys-color-on-surface-variant);
}

.practice-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
}

.callout-box--important {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
}

/* --- Títulos e Textos Grandes para Projetor --- */
.slide-title-projector {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--md-sys-color-primary);
  margin-top: 8px;
}

.slide-subtitle-projector {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 8px;
}

.projector-chip {
  font-size: 18px !important;
  padding: 8px 16px !important;
}

.step-badge {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  font-weight: 700;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: var(--md-shape-corner-medium);
  white-space: nowrap;
  display: inline-block;
  margin-bottom: 4px;
}

.step-text-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.step-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  flex-shrink: 0;
}

.step-icon {
  font-size: 32px;
}

.step-detail-projector {
  font-size: 24px;
  line-height: 1.5;
  color: var(--md-sys-color-on-surface);
}

.practice-links {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.links-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-primary);
  text-decoration: none;
  border-radius: var(--md-shape-corner-small);
  font-weight: 500;
  font-size: 14px;
  transition: all var(--md-motion-duration-short) ease;
}

.doc-link:hover {
  background-color: var(--md-sys-color-primary-container);
}

.callout-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: var(--md-shape-corner-medium);
}

.callout-text {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
}

.callout-icon {
  font-size: 36px;
}
</style>

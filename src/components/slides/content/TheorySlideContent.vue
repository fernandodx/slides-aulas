<template>
  <div class="slide-content-theory" :class="{ 'has-image': !!slide.content?.image, 'image-left': slide.content?.image?.position === 'left' }">
    <div class="text-column">
      <!-- Intro Header Slide -->
    <div v-if="slide.type === 'intro'" class="slide-content-intro">
      <M3Chip v-if="slide.content.badge" variant="primary" class="projector-chip">{{
        slide.content.badge
      }}</M3Chip>
      <h2 class="slide-title-projector">{{ slide.title }}</h2>
      <p class="slide-subtitle-projector">{{ slide.subtitle }}</p>

      <p class="slide-description-projector">
        {{ slide.content.description }}
      </p>

      <div v-if="slide.content.keyPoints" class="slide-keypoints">
        <M3Card
          v-for="(point, idx) in slide.content.keyPoints"
          :key="idx"
          variant="outlined"
          class="keypoint-card"
        >
          <span class="material-icons-round keypoint-icon">check_circle</span>
          <span class="keypoint-text">{{ point }}</span>
        </M3Card>
      </div>
    </div>

    <!-- Regular Theory Slide -->
    <div v-else class="slide-content-body">
      <div class="slide-header">
        <h2 class="slide-title-projector">{{ slide.title }}</h2>
        <p class="slide-subtitle-projector">{{ slide.subtitle }}</p>
      </div>

      <div v-if="slide.content?.sections" class="slide-sections">
        <M3Card
          v-for="(sec, idx) in slide.content.sections"
          :key="idx"
          variant="surface"
          class="section-card"
        >
          <h3 class="section-heading-projector">{{ sec.heading }}</h3>
          <p class="section-text-projector">{{ sec.text }}</p>
        </M3Card>
      </div>

      <!-- Callout Box -->
      <div
        v-if="slide.content?.callout"
        :class="['callout-box', `callout-box--${slide.content.callout.type}`]"
      >
        <span class="material-icons-round callout-icon">
          {{
            slide.content.callout.type === "important" ? "warning" : "lightbulb"
          }}
        </span>
        <span class="callout-text">{{ slide.content.callout.text }}</span>
      </div>
    </div> <!-- fecha slide-content-body -->
    </div> <!-- fecha text-column -->

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
.slide-content-theory {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.slide-content-theory.has-image {
  flex-direction: row;
  align-items: center;
  gap: 40px;
}

.slide-content-theory.has-image.image-left {
  flex-direction: row-reverse;
}

.text-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
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

.slide-content-intro {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slide-title {
  color: var(--md-sys-color-primary);
  margin-top: 8px;
}

.slide-subtitle {
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 8px;
}

.slide-description {
  color: var(--md-sys-color-on-surface);
  max-width: 900px;
  line-height: 1.6;
}

.slide-keypoints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.keypoint-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.keypoint-icon {
  color: var(--md-sys-color-primary);
}

.slide-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.section-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-heading {
  color: var(--md-sys-color-primary);
}

.section-text {
  white-space: pre-line;
}

.callout-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: var(--md-shape-corner-medium);
  margin-top: 16px;
}

.callout-box--tip {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
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

.slide-description-projector {
  font-size: 26px;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface);
  max-width: 900px;
}

.projector-chip {
  font-size: 18px !important;
  padding: 8px 16px !important;
}

.keypoint-text {
  font-size: 22px;
  font-weight: 500;
}

.keypoint-icon {
  font-size: 32px;
  color: var(--md-sys-color-primary);
}

.section-heading-projector {
  font-size: 28px;
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin-bottom: 8px;
}

.section-text-projector {
  font-size: 24px;
  line-height: 1.5;
  color: var(--md-sys-color-on-surface);
  white-space: pre-line;
}

.callout-text {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
}

.callout-icon {
  font-size: 36px;
}

.callout-box {
  padding: 24px;
  border-radius: var(--md-shape-corner-large);
}
</style>

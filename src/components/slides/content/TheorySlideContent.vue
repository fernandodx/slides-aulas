<template>
  <div class="slide-content-theory">
    <!-- Intro Header Slide -->
    <div v-if="slide.type === 'intro'" class="slide-content-intro">
      <M3Chip v-if="slide.content.badge" variant="primary">{{
        slide.content.badge
      }}</M3Chip>
      <h2 class="m3-display-small slide-title">{{ slide.title }}</h2>
      <p class="m3-headline-small slide-subtitle">{{ slide.subtitle }}</p>

      <p class="m3-body-large slide-description">
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
          <span class="m3-body-medium">{{ point }}</span>
        </M3Card>
      </div>
    </div>

    <!-- Regular Theory Slide -->
    <div v-else class="slide-content-body">
      <div class="slide-header">
        <h2 class="m3-headline-large">{{ slide.title }}</h2>
        <p class="m3-title-medium slide-subtitle">{{ slide.subtitle }}</p>
      </div>

      <div v-if="slide.content?.sections" class="slide-sections">
        <M3Card
          v-for="(sec, idx) in slide.content.sections"
          :key="idx"
          variant="surface"
          class="section-card"
        >
          <h3 class="m3-title-large section-heading">{{ sec.heading }}</h3>
          <p class="m3-body-medium section-text">{{ sec.text }}</p>
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
        <span class="m3-body-medium">{{ slide.content.callout.text }}</span>
      </div>
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
</style>

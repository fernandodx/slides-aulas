<template>
  <div class="slide-content-practice">
    <div class="slide-header">
      <M3Chip variant="success" icon="build">Prática / Atividade</M3Chip>
      <h2 class="m3-headline-large slide-title">{{ slide.title }}</h2>
      <p class="m3-title-medium slide-subtitle">{{ slide.subtitle }}</p>
    </div>

    <div v-if="slide.content?.items" class="practice-steps">
      <M3Card
        v-for="(item, idx) in slide.content.items"
        :key="idx"
        variant="outlined"
        class="step-card"
      >
        <div class="step-badge">{{ item.title }}</div>
        <div class="step-detail m3-body-large">{{ item.detail }}</div>
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
      <span class="m3-body-medium">{{ slide.content.callout.text }}</span>
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

.step-badge {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  font-weight: 700;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: var(--md-shape-corner-medium);
  white-space: nowrap;
}

.step-detail {
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

.callout-box--important {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
}
</style>

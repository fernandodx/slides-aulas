<template>
  <div class="slide-content-code">
    <div class="slide-header">
      <M3Chip variant="primary" icon="code">{{
        slide.content.language || "Code"
      }}</M3Chip>
      <h2 class="m3-headline-large slide-title">{{ slide.title }}</h2>
      <p class="m3-title-medium slide-subtitle">{{ slide.subtitle }}</p>
    </div>

    <!-- Code Box Header & Pre -->
    <div class="code-box">
      <div class="code-box__header">
        <span class="code-box__lang">{{
          slide.content.language?.toUpperCase() || "CODE"
        }}</span>
        <button class="code-box__copy-btn" @click="copyCode">
          <span class="material-icons-round">{{
            copied ? "check" : "content_copy"
          }}</span>
          {{ copied ? "Copiado!" : "Copiar" }}
        </button>
      </div>

      <pre class="code-box__pre"><code>{{ slide.content.code }}</code></pre>
    </div>

    <div v-if="slide.content.explanation" class="code-explanation">
      <M3Card variant="surface" class="explanation-card">
        <span class="material-icons-round explanation-icon">info</span>
        <span class="m3-body-medium">{{ slide.content.explanation }}</span>
      </M3Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import M3Chip from "@/components/ui/M3Chip.vue";
import M3Card from "@/components/ui/M3Card.vue";

const props = defineProps({
  slide: {
    type: Object,
    required: true,
  },
});

const copied = ref(false);

const copyCode = () => {
  if (props.slide.content?.code) {
    navigator.clipboard.writeText(props.slide.content.code).then(() => {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    });
  }
};
</script>

<style scoped>
.slide-content-code {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.slide-title {
  color: var(--md-sys-color-primary);
  margin-top: 8px;
}

.slide-subtitle {
  color: var(--md-sys-color-on-surface-variant);
}

.code-box {
  background-color: #1e1e1e;
  color: #d4d4d4;
  border-radius: var(--md-shape-corner-medium);
  overflow: hidden;
  box-shadow: var(--md-elevation-2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-box__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2d2d2d;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.code-box__lang {
  font-family: var(--md-sys-typescale-mono-family);
  font-size: 12px;
  font-weight: 700;
  color: #9cdcfe;
}

.code-box__copy-btn {
  background: none;
  border: none;
  color: #cccccc;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.code-box__copy-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.code-box__pre {
  padding: 16px 20px;
  overflow-x: auto;
  font-family: var(--md-sys-typescale-mono-family);
  font-size: 14px;
  line-height: 1.6;
}

.explanation-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.explanation-icon {
  color: var(--md-sys-color-primary);
}
</style>

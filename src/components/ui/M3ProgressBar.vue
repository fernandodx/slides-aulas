<template>
  <div class="m3-progress">
    <div
      class="m3-progress__bar"
      :style="{ width: `${clampedProgress}%` }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});

const clampedProgress = computed(() => {
  return Math.min(100, Math.max(0, props.value));
});
</script>

<style scoped>
.m3-progress {
  width: 100%;
  height: 6px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: var(--md-shape-corner-full);
  overflow: hidden;
}

.m3-progress__bar {
  height: 100%;
  background-color: var(--md-sys-color-primary);
  border-radius: var(--md-shape-corner-full);
  transition: width var(--md-motion-duration-medium)
    var(--md-motion-easing-standard);
}
</style>

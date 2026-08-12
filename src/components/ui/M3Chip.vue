<template>
  <span :class="['m3-chip', `m3-chip--${variant}`]" :style="customStyle">
    <span v-if="icon" class="material-icons-round m3-chip__icon">{{
      icon
    }}</span>
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "assist", // assist, primary, success, warning, danger
  },
  icon: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
});

const customStyle = computed(() => {
  if (props.color) {
    return {
      backgroundColor: `rgba(${props.color}, 0.12)`,
      color: props.color,
      borderColor: `rgba(${props.color}, 0.3)`,
    };
  }
  return {};
});
</script>

<style scoped>
.m3-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--md-shape-corner-small);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1px;
  border: 1px solid var(--md-sys-color-outline-variant);
  user-select: none;
}

.m3-chip__icon {
  font-size: 16px;
}

.m3-chip--assist {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
}

.m3-chip--primary {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-color: transparent;
}

.m3-chip--success {
  background-color: #e6f4ea;
  color: #137333;
  border-color: #ceead6;
}

.m3-chip--warning {
  background-color: #fef7e0;
  color: #b06000;
  border-color: #fce8e6;
}

.m3-chip--danger {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  border-color: transparent;
}
</style>

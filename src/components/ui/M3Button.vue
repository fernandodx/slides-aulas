<template>
  <button
    :class="[
      'm3-button',
      `m3-button--${variant}`,
      { 'm3-button--icon-only': !hasDefaultSlot, 'm3-button--full': fullWidth },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="icon" class="material-icons-round m3-button__icon">{{
      icon
    }}</span>
    <span v-if="hasDefaultSlot" class="m3-button__label">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { useSlots, computed } from "vue";

defineProps({
  variant: {
    type: String,
    default: "filled", // filled, outlined, text, tonal
    validator: (v) => ["filled", "outlined", "text", "tonal"].includes(v),
  },
  icon: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);

const slots = useSlots();
const hasDefaultSlot = computed(() => Boolean(slots.default));
</script>

<style scoped>
.m3-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 24px;
  border-radius: var(--md-shape-corner-full);
  font-family: var(--md-sys-typescale-font-family);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  border: none;
  cursor: pointer;
  transition: all var(--md-motion-duration-short) ease;
  user-select: none;
  white-space: nowrap;
}

.m3-button--full {
  width: 100%;
}

.m3-button--icon-only {
  width: 40px;
  padding: 0;
  border-radius: 50%;
}

.m3-button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}

/* Filled Variant */
.m3-button--filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.m3-button--filled:hover {
  box-shadow: var(--md-elevation-1);
  filter: brightness(1.08);
}

/* Tonal Variant */
.m3-button--tonal {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
.m3-button--tonal:hover {
  filter: brightness(0.96);
}

/* Outlined Variant */
.m3-button--outlined {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
}
.m3-button--outlined:hover {
  background-color: rgba(103, 80, 164, 0.08);
}

/* Text Variant */
.m3-button--text {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  padding: 0 12px;
}
.m3-button--text:hover {
  background-color: rgba(103, 80, 164, 0.08);
}

.m3-button__icon {
  font-size: 20px;
}
</style>

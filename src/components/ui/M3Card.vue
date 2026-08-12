<template>
  <div
    :class="[
      'm3-card',
      `m3-card--${variant}`,
      { 'm3-card--clickable': isClickable }
    ]"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { useAttrs, computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "surface", // elevated, filled, outlined, surface
    validator: (v) => ["elevated", "filled", "outlined", "surface"].includes(v),
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);

const attrs = useAttrs();
const isClickable = computed(() => props.clickable || Boolean(attrs.onClick));
</script>

<style scoped>
.m3-card {
  border-radius: var(--md-shape-corner-extra-large);
  padding: 24px;
  transition: all var(--md-motion-duration-short) ease;
  position: relative;
  overflow: hidden;
}

.m3-card--clickable {
  cursor: pointer;
}

.m3-card--clickable:hover {
  transform: translateY(-2px);
}

/* Surface Variant */
.m3-card--surface {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
}
.m3-card--surface.m3-card--clickable:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

/* Elevated Variant */
.m3-card--elevated {
  background-color: var(--md-sys-color-surface-container-low);
  box-shadow: var(--md-elevation-1);
}
.m3-card--elevated.m3-card--clickable:hover {
  box-shadow: var(--md-elevation-2);
}

/* Filled Variant */
.m3-card--filled {
  background-color: var(--md-sys-color-surface-container-highest);
}

/* Outlined Variant */
.m3-card--outlined {
  background-color: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
</style>

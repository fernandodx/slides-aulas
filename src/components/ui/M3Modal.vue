<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="m3-modal-overlay"
        @click.self="closeOnOverlay && $emit('update:modelValue', false)"
      >
        <div class="m3-modal-container">
          <div class="m3-modal-header">
            <h3 class="m3-title-large">{{ title }}</h3>
            <button
              class="m3-modal-close"
              @click="$emit('update:modelValue', false)"
            >
              <span class="material-icons-round">close</span>
            </button>
          </div>
          <div class="m3-modal-body">
            <slot></slot>
          </div>
          <div v-if="$slots.actions" class="m3-modal-actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.m3-modal-overlay {
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
  padding: 16px;
}

.m3-modal-container {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-shape-corner-extra-large);
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--md-elevation-3);
  overflow: hidden;
}

.m3-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
}

.m3-modal-close {
  background: none;
  border: none;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.m3-modal-close:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.m3-modal-body {
  padding: 0 24px 24px 24px;
  overflow-y: auto;
}

.m3-modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}
</style>

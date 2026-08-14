<template>
  <div class="slide-content-image">
    <div class="image-header" v-if="slide.title">
      <h2 class="slide-title-projector">{{ slide.title }}</h2>
      <p v-if="slide.subtitle" class="slide-subtitle-projector">{{ slide.subtitle }}</p>
    </div>
    
    <div class="image-wrapper">
      <img 
        :src="slide.content?.imageUrl" 
        :alt="slide.content?.imageAlt || 'Infográfico do slide'" 
        class="full-image" 
      />
    </div>
    
    <div class="image-footer" v-if="slide.content?.description">
      <p class="slide-description-projector">{{ slide.content.description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  slide: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.slide-content-image {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.image-header {
  text-align: center;
}

.slide-title-projector {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--md-sys-color-primary);
  margin-bottom: 8px;
}

.slide-subtitle-projector {
  font-size: 28px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
}

.image-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 300px;
}

.full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--md-shape-corner-large);
  box-shadow: var(--md-elevation-2);
}

.image-footer {
  text-align: center;
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface-container);
  padding: 24px;
  border-radius: var(--md-shape-corner-medium);
  margin-top: auto;
}

.slide-description-projector {
  font-size: 26px;
  line-height: 1.5;
  font-weight: 500;
}
</style>

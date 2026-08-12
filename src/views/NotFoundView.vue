<template>
  <div class="not-found-view">
    <M3Navbar />
    <main class="not-found-content">
      <h1 class="m3-display-large">404</h1>
      <p class="m3-headline-small">Página ou Slide não encontrado.</p>
      <M3Button variant="filled" icon="home" @click="$router.push('/')"
        >Voltar ao Início</M3Button
      >
    </main>
  </div>
</template>

<script setup>
import M3Navbar from "@/components/layout/M3Navbar.vue";
import M3Button from "@/components/ui/M3Button.vue";
</script>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.not-found-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  color: var(--md-sys-color-primary);
}
</style>

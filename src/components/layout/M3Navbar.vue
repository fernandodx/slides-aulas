<template>
  <header class="m3-navbar">
    <div class="m3-navbar__brand" @click="goHome">
      <div class="m3-navbar__logo">
        <span class="material-icons-round">slideshow</span>
      </div>
      <div class="m3-navbar__titles">
        <span class="m3-title-medium brand-name">Aulas & Slides</span>
        <span class="m3-label-small brand-sub">Material You Platform</span>
      </div>
    </div>

    <div class="m3-navbar__actions">
      <!-- Firebase Credentials Button -->
      <M3Button
        variant="tonal"
        :icon="isConfigured ? 'cloud_done' : 'cloud_queue'"
        @click="showFirebaseModal = true"
      >
        {{ isConfigured ? "Firebase Ativo" : "Conectar Firebase" }}
      </M3Button>

      <!-- Theme Switcher -->
      <M3Button
        variant="text"
        :icon="isDark ? 'light_mode' : 'dark_mode'"
        @click="toggleTheme"
      />
    </div>

    <!-- Firebase Modal -->
    <FirebaseSetupModal v-model="showFirebaseModal" />
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import M3Button from "@/components/ui/M3Button.vue";
import FirebaseSetupModal from "@/components/layout/FirebaseSetupModal.vue";
import { useFirebaseConfigViewModel } from "@/viewmodels/useFirebaseConfigViewModel";

const router = useRouter();
const showFirebaseModal = ref(false);
const isDark = ref(false);

const { isConfigured } = useFirebaseConfigViewModel();

const goHome = () => {
  router.push({ name: "home" });
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
};

onMounted(() => {
  isDark.value = document.documentElement.getAttribute("data-theme") === "dark";
});
</script>

<style scoped>
.m3-navbar {
  height: 64px;
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  z-index: 100;
}

.m3-navbar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.m3-navbar__logo {
  width: 40px;
  height: 40px;
  border-radius: var(--md-shape-corner-medium);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
}

.m3-navbar__titles {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-weight: 700;
  line-height: 1.2;
}

.brand-sub {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-navbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

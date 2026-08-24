<template>
  <div class="home-view">
    <M3Navbar />

    <main class="home-container">
      <!-- Hero Banner -->
      <section class="hero-section">
        <M3Chip variant="primary" icon="school"
          >Plataforma Acadêmica de Slides</M3Chip
        >
        <h1 class="m3-display-medium hero-title">
          Repositório de Aulas & Slides Interativos
        </h1>
        <p class="m3-body-large hero-subtitle">
          Explore e navegue pelas aulas das disciplinas universitárias com
          leitor de slides moderno, código interativo e diretrizes do Material
          You.
        </p>
      </section>

      <!-- Courses Grid -->
      <section class="courses-section">
        <h2 class="m3-headline-medium section-title">Cursos Disponíveis</h2>

        <div v-if="loading" class="loading-state m3-body-large">
          Carregando cursos...
        </div>

        <div v-else-if="availableCourses.length > 0" class="courses-grid">
          <M3Card
            v-for="course in availableCourses"
            :key="course.id"
            variant="elevated"
            class="course-card"
            clickable
            @click="goToCourse(course.id)"
          >
            <div class="course-card__header">
              <M3Chip variant="assist" icon="label">{{
                course.category
              }}</M3Chip>
              <M3Chip variant="success" icon="check_circle">
                Curso Disponível
              </M3Chip>
            </div>

            <div class="course-card__body">
              <h3 class="m3-headline-small course-title">{{ course.title }}</h3>
              <p class="m3-body-medium course-sub">{{ course.subtitle }}</p>
            </div>

            <div class="course-card__stats">
              <div class="stat-item">
                <span class="material-icons-round stat-icon">menu_book</span>
                <span class="m3-label-large"
                  >{{ course.totalLessons }} Aulas</span
                >
              </div>
              <div class="stat-item">
                <span class="material-icons-round stat-icon">schedule</span>
                <span class="m3-label-large"
                  >{{ course.workloadHours }}h de carga</span
                >
              </div>
              <div class="stat-item">
                <span class="material-icons-round stat-icon">view_module</span>
                <span class="m3-label-large"
                  >{{ course.modules.length }} Módulos</span
                >
              </div>
            </div>

            <div class="course-card__footer">
              <M3Button
                variant="filled"
                icon="play_arrow"
                @click.stop="goToCourse(course.id)"
                >Ver Ementa & Aulas</M3Button
              >
            </div>
          </M3Card>
        </div>
        
        <div v-else class="empty-state">
          <M3Card variant="surface" class="empty-state-card">
            <span class="material-icons-round empty-icon">school</span>
            <h3 class="m3-headline-small">Nenhum curso disponível</h3>
            <p class="m3-body-large">No momento, não existem cursos habilitados na plataforma.</p>
          </M3Card>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import M3Navbar from "@/components/layout/M3Navbar.vue";
import M3Card from "@/components/ui/M3Card.vue";
import M3Chip from "@/components/ui/M3Chip.vue";
import M3Button from "@/components/ui/M3Button.vue";
import { courseRepository } from "@/services/course.repository";
import { remoteConfigService } from "@/services/remote-config.service";

const router = useRouter();
const availableCourses = ref([]);
const loading = ref(true);

const goToCourse = (courseId) => {
  router.push({ name: "course-detail", params: { courseId } });
};

onMounted(async () => {
  loading.value = true;
  await remoteConfigService.ensureInitialized();
  // Carrega todos os cursos registrados e checa se estão habilitados no Remote Config
  const allCourses = courseRepository.getAllCourses();
  availableCourses.value = allCourses.filter((course) => 
    remoteConfigService.isCourseEnabled(course.id)
  );
  loading.value = false;
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.hero-title {
  color: var(--md-sys-color-primary);
  font-weight: 700;
}

.hero-subtitle {
  color: var(--md-sys-color-on-surface-variant);
  max-width: 800px;
  line-height: 1.6;
}

.courses-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
}

.course-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: pointer;
  border: 1px solid var(--md-sys-color-outline-variant);
}

.course-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.course-title {
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
  margin-bottom: 8px;
}

.course-sub {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.course-card__stats {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--md-sys-color-on-surface-variant);
}

.stat-icon {
  font-size: 18px;
  color: var(--md-sys-color-primary);
}

.course-card__footer {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 40px;
  width: 100%;
  max-width: 500px;
}

.empty-icon {
  font-size: 64px;
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.5;
}
</style>

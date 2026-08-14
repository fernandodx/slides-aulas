<template>
  <div class="course-detail-view">
    <M3Navbar />

    <div v-if="loading" class="loading-state">
      <p class="m3-body-large">Carregando dados da disciplina...</p>
    </div>

    <div v-else-if="course && isCourseUnlocked" class="course-detail-container">
      <!-- Breadcrumb & Top Bar -->
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-link m3-label-large">
          <span class="material-icons-round">arrow_back</span> Cursos
        </router-link>
        <span class="breadcrumb-sep">/</span>
        <span class="m3-label-large active">{{ course.title }}</span>
      </nav>

      <!-- Course Header Hero Card -->
      <M3Card variant="surface" class="course-hero">
        <div class="course-hero__header">
          <M3Chip variant="primary" icon="school">{{ course.badge }}</M3Chip>
          <M3Chip variant="success" icon="verified">
            Curso Ativo
          </M3Chip>
        </div>

        <h1 class="m3-display-small course-hero__title">{{ course.title }}</h1>
        <p class="m3-headline-small course-hero__sub">{{ course.subtitle }}</p>

        <!-- Stats Chips -->
        <div class="course-hero__chips">
          <M3Chip variant="assist" icon="menu_book"
            >{{ course.totalLessons }} Aulas Interativas</M3Chip
          >
          <M3Chip variant="assist" icon="timer"
            >{{ course.workloadHours }} Horas de Carga Horária</M3Chip
          >
          <M3Chip variant="assist" icon="assignment"
            >3 Entregas Avaliativas</M3Chip
          >
        </div>

        <!-- Call to Action -->
        <div class="course-hero__actions">
          <M3Button
            variant="filled"
            icon="play_arrow"
            @click="startFirstLesson"
          >
            Acessar Aulas
          </M3Button>
        </div>
      </M3Card>

      <!-- Grid of Methodology & Tools -->
      <div class="info-grid">
        <!-- Assessment System -->
        <M3Card variant="outlined" class="info-card">
          <h3 class="m3-title-large info-title">
            <span class="material-icons-round info-icon">grade</span> Sistema de
            Avaliação
          </h3>
          <p class="m3-body-medium info-desc">
            {{ course.assessment.methodology }}
          </p>

          <div class="deliverables-list">
            <div
              v-for="(deliv, idx) in course.assessment.deliverables"
              :key="idx"
              class="deliverable-item"
            >
              <div class="deliverable-header">
                <span class="m3-title-small deliv-name">{{ deliv.name }}</span>
                <span class="m3-chip m3-chip--primary">{{ deliv.weight }}</span>
              </div>
              <p class="m3-body-small deliv-desc">{{ deliv.description }}</p>
            </div>
          </div>
        </M3Card>

        <!-- Stack & Tools -->
        <M3Card variant="outlined" class="info-card">
          <h3 class="m3-title-large info-title">
            <span class="material-icons-round info-icon">build</span>
            Ferramentas da Disciplina
          </h3>
          <div class="tools-grid">
            <div
              v-for="(tool, idx) in course.tools"
              :key="idx"
              class="tool-item"
            >
              <div class="tool-icon-wrapper">
                <span class="material-icons-round">{{ tool.icon }}</span>
              </div>
              <div class="tool-info">
                <div class="m3-title-small tool-name">{{ tool.name }}</div>
                <div class="m3-body-small tool-desc">{{ tool.desc }}</div>
              </div>
            </div>
          </div>
        </M3Card>
      </div>

      <!-- Modules & 20 Lessons Breakdown -->
      <section class="modules-section">
        <h2 class="m3-headline-medium section-title">
          Cronograma das 20 Aulas (7 Módulos)
        </h2>

        <div class="modules-list">
          <template v-for="mod in course.modules" :key="mod.id">
            <M3Card
              v-if="mod.lessons.some(l => isLessonUnlocked(l.id))"
              variant="surface"
              class="module-card"
            >
            <div class="module-card__header">
              <div
                class="module-number"
                :style="{ backgroundColor: mod.color }"
              >
                Módulo {{ mod.number }}
              </div>
              <div class="module-titles">
                <h3 class="m3-title-large mod-title">{{ mod.title }}</h3>
                <p class="m3-body-medium mod-desc">{{ mod.description }}</p>
              </div>
            </div>

            <!-- Lessons Grid inside Module -->
            <div class="lessons-grid">
              <template v-for="lesson in mod.lessons" :key="lesson.id">
                <div
                  v-if="isLessonUnlocked(lesson.id)"
                  class="lesson-item-card"
                  @click="openLesson(lesson.id)"
                >
                  <div class="lesson-item-card__top">
                    <span
                      class="m3-label-small lesson-tag"
                      :style="{ color: mod.color }"
                    >
                      {{ lesson.tag }}
                    </span>
                    <span class="m3-label-small lesson-duration">{{
                      lesson.duration
                    }}</span>
                  </div>

                  <h4 class="m3-title-medium lesson-title">{{ lesson.title }}</h4>
                  <p class="m3-body-small lesson-desc">
                    {{ lesson.description }}
                  </p>

                  <div class="lesson-item-card__bottom">
                    <M3Button
                      variant="text"
                      icon="slideshow"
                      @click.stop="openLesson(lesson.id)"
                    >
                      Abrir Slides
                    </M3Button>
                  </div>
                </div>
              </template>
            </div>
          </M3Card>
          </template>
        </div>
      </section>
    </div>
    
    <div v-else class="empty-state-container">
      <M3Card variant="surface" class="empty-state-card">
        <span class="material-icons-round empty-icon">lock</span>
        <h3 class="m3-headline-small">Curso Indisponível</h3>
        <p class="m3-body-large">Este curso não está disponível ou foi bloqueado na plataforma no momento.</p>
        <M3Button variant="filled" @click="$router.push('/')">Voltar aos Cursos</M3Button>
      </M3Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import M3Navbar from "@/components/layout/M3Navbar.vue";
import M3Card from "@/components/ui/M3Card.vue";
import M3Chip from "@/components/ui/M3Chip.vue";
import M3Button from "@/components/ui/M3Button.vue";
import { useCourseViewModel } from "@/viewmodels/useCourseViewModel";

const route = useRoute();
const router = useRouter();
const courseId = route.params.courseId || "desenvolvimento-de-interfaces";

const { course, loading, isCourseUnlocked, loadCourse, isLessonUnlocked } =
  useCourseViewModel(courseId);

const startFirstLesson = () => {
  openLesson(1);
};

const openLesson = (lessonId) => {
  router.push({
    name: "lesson-slide",
    params: {
      courseId,
      lessonId,
      slideIndex: 1,
    },
  });
};

onMounted(() => {
  loadCourse();
});
</script>

<style scoped>
.course-detail-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.course-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-sys-color-on-surface-variant);
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--md-sys-color-primary);
  text-decoration: none;
}

.course-hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--md-sys-color-surface-container-high);
}

.course-hero__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.course-hero__title {
  color: var(--md-sys-color-primary);
  font-weight: 700;
}

.course-hero__sub {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.course-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.course-hero__actions {
  margin-top: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-sys-color-primary);
}

.info-icon {
  color: var(--md-sys-color-primary);
}

.deliverables-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deliverable-item {
  background-color: var(--md-sys-color-surface-container);
  padding: 12px 16px;
  border-radius: var(--md-shape-corner-medium);
}

.deliverable-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.deliv-desc {
  color: var(--md-sys-color-on-surface-variant);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background-color: var(--md-sys-color-surface-container);
  border-radius: var(--md-shape-corner-medium);
}

.tool-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modules-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-card__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.module-number {
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: var(--md-shape-corner-small);
  white-space: nowrap;
}

.mod-title {
  font-weight: 700;
}

.mod-desc {
  color: var(--md-sys-color-on-surface-variant);
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.lesson-item-card {
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-corner-medium);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: all var(--md-motion-duration-short) ease;
}

.lesson-item-card:hover {
  border-color: var(--md-sys-color-primary);
  transform: translateY(-2px);
  box-shadow: var(--md-elevation-1);
}

.lesson-item-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lesson-tag {
  font-weight: 700;
  text-transform: uppercase;
}

.lesson-duration {
  color: var(--md-sys-color-outline);
}

.lesson-title {
  font-weight: 700;
}

.lesson-desc {
  color: var(--md-sys-color-on-surface-variant);
  flex: 1;
}

.lesson-item-card__bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.empty-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 40px 24px;
}

.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 48px;
  max-width: 500px;
}

.empty-icon {
  font-size: 64px;
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.5;
}
</style>

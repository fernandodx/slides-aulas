<template>
  <div
    class="slide-content-assessment"
    :class="{
      'has-image': !!slide.content?.image,
      'image-left': slide.content?.image?.position === 'left',
    }"
  >
    <div class="text-column">
      <!-- Slide Header -->
      <div class="slide-header">
        <div class="header-chips">
          <M3Chip :variant="badgeVariant" icon="assignment" class="projector-chip">
            {{ slide.content?.badge || assessmentTypeLabel }}
          </M3Chip>
          <M3Chip
            v-if="slide.content?.date || slide.content?.deadline"
            variant="surface"
            icon="event"
            class="projector-chip date-chip"
          >
            Prazo: {{ slide.content?.date || slide.content?.deadline }}
          </M3Chip>
        </div>
        <h2 class="slide-title-projector">{{ slide.title }}</h2>
        <p v-if="slide.subtitle" class="slide-subtitle-projector">
          {{ slide.subtitle }}
        </p>
      </div>

      <!-- SUBTIPO 1: SEMINÁRIO -->
      <div
        v-if="isSeminar"
        class="assessment-body seminar-layout"
      >
        <!-- Definição de Temas -->
        <div v-if="slide.content?.topics?.length" class="assessment-section">
          <h3 class="section-title">
            <span class="material-icons-round section-icon">topic</span>
            Definição de Temas
          </h3>
          <div class="topics-grid">
            <M3Card
              v-for="(topic, idx) in slide.content.topics"
              :key="idx"
              variant="outlined"
              class="topic-card"
            >
              <div class="topic-index">{{ String(idx + 1).padStart(2, '0') }}</div>
              <div class="topic-content">
                <div class="topic-title">
                  {{ typeof topic === 'string' ? topic : topic.title }}
                </div>
                <div
                  v-if="typeof topic === 'object' && topic.description"
                  class="topic-desc"
                >
                  {{ topic.description }}
                </div>
              </div>
            </M3Card>
          </div>
        </div>

        <!-- Forma de Avaliação & Forma de Entrega -->
        <div class="details-row">
          <M3Card
            v-if="slide.content?.evaluationCriteria?.length"
            variant="surface"
            class="detail-card"
          >
            <h4 class="card-title">
              <span class="material-icons-round card-icon">rule</span>
              Forma de Avaliação
            </h4>
            <ul class="criteria-list">
              <li
                v-for="(crit, idx) in slide.content.evaluationCriteria"
                :key="idx"
              >
                <span class="material-icons-round check-bullet">check_circle</span>
                <span>
                  <strong>{{ typeof crit === 'object' ? crit.label : crit }}</strong>
                  <span v-if="typeof crit === 'object' && crit.weight" class="crit-weight">
                    ({{ crit.weight }})
                  </span>
                  <span v-if="typeof crit === 'object' && crit.detail" class="crit-detail">
                    — {{ crit.detail }}
                  </span>
                </span>
              </li>
            </ul>
          </M3Card>

          <M3Card
            v-if="slide.content?.deliveryFormat"
            variant="surface"
            class="detail-card"
          >
            <h4 class="card-title">
              <span class="material-icons-round card-icon">send</span>
              Forma de Entrega
            </h4>
            <p class="delivery-text">
              {{ typeof slide.content.deliveryFormat === 'string'
                ? slide.content.deliveryFormat
                : slide.content.deliveryFormat.details || slide.content.deliveryFormat.format }}
            </p>
          </M3Card>
        </div>
      </div>

      <!-- SUBTIPO 2: PROJETO FINAL -->
      <div
        v-else-if="isFinalProject"
        class="assessment-body final-project-layout"
      >
        <div class="pillars-grid">
          <!-- Entrega via Pull Request -->
          <M3Card variant="outlined" class="pillar-card pr-card">
            <div class="pillar-header">
              <div class="pillar-icon-box pr-icon">
                <span class="material-icons-round">merge_type</span>
              </div>
              <h3 class="pillar-title">Entrega via Pull Request</h3>
            </div>
            <div class="pillar-body">
              <p class="pillar-text">
                {{ slide.content?.githubPr?.instruction || slide.content?.githubPr || 'Submissão obrigatória via Pull Request no repositório da disciplina para Code Review.' }}
              </p>
              <div v-if="slide.content?.githubPr?.targetBranch" class="code-pill">
                Branch Alvo: <code>{{ slide.content.githubPr.targetBranch }}</code>
              </div>
            </div>
          </M3Card>

          <!-- Padrões de Sala de Aula & Projeto Alvo -->
          <M3Card variant="outlined" class="pillar-card standards-card">
            <div class="pillar-header">
              <div class="pillar-icon-box standards-icon">
                <span class="material-icons-round">verified</span>
              </div>
              <h3 class="pillar-title">Padrões de Aula & Qualidade</h3>
            </div>
            <div class="pillar-body">
              <ul v-if="slide.content?.classroomStandards?.length" class="standards-list">
                <li
                  v-for="(item, idx) in slide.content.classroomStandards"
                  :key="idx"
                >
                  <span class="material-icons-round bullet-icon">done</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <p v-else class="pillar-text">
                {{ slide.content?.classroomStandards || 'Seguir arquitetura, boas práticas de Clean Code, commits padronizados e critérios do projeto alvo.' }}
              </p>
            </div>
          </M3Card>

          <!-- Deploy em Produção -->
          <M3Card variant="outlined" class="pillar-card deploy-card">
            <div class="pillar-header">
              <div class="pillar-icon-box deploy-icon">
                <span class="material-icons-round">rocket_launch</span>
              </div>
              <h3 class="pillar-title">Deploy Obrigatório</h3>
            </div>
            <div class="pillar-body">
              <p class="pillar-text">
                {{ slide.content?.deploy?.instruction || slide.content?.deploy || 'Aplicação publicada e funcional em ambiente de produção.' }}
              </p>
              <div v-if="slide.content?.deploy?.platforms?.length" class="deploy-platforms">
                <span
                  v-for="(plat, idx) in slide.content.deploy.platforms"
                  :key="idx"
                  class="platform-chip"
                >
                  <span class="material-icons-round chip-icon">cloud_done</span>
                  {{ plat }}
                </span>
              </div>
            </div>
          </M3Card>
        </div>

        <!-- Critérios de Avaliação Opcionais -->
        <M3Card
          v-if="slide.content?.evaluationCriteria?.length"
          variant="surface"
          class="project-criteria-card"
        >
          <h4 class="card-title">
            <span class="material-icons-round card-icon">grading</span>
            Critérios de Avaliação
          </h4>
          <div class="criteria-horizontal">
            <div
              v-for="(crit, idx) in slide.content.evaluationCriteria"
              :key="idx"
              class="crit-item"
            >
              <span class="material-icons-round check-bullet">star</span>
              <span>
                <strong>{{ typeof crit === 'object' ? crit.label : crit }}</strong>
                <span v-if="typeof crit === 'object' && crit.detail" class="crit-detail">
                  — {{ crit.detail }}
                </span>
              </span>
            </div>
          </div>
        </M3Card>
      </div>

      <!-- SUBTIPO 3: ENTREGA DE ATIVIDADE -->
      <div
        v-else-if="isActivity"
        class="assessment-body activity-layout"
      >
        <div class="activity-grid">
          <!-- Descrição da Atividade via README -->
          <M3Card variant="outlined" class="activity-card readme-box">
            <div class="pillar-header">
              <div class="pillar-icon-box readme-icon">
                <span class="material-icons-round">description</span>
              </div>
              <h3 class="pillar-title">Descrição no README</h3>
            </div>
            <p class="pillar-text">
              {{ slide.content?.activityReadme?.description || slide.content?.activityReadme || slide.content?.description || 'Documentar a atividade detalhadamente no README.md do projeto (objetivos, arquitetura e instruções de execução).' }}
            </p>
            <ul v-if="slide.content?.activityReadme?.requirements?.length" class="standards-list">
              <li
                v-for="(req, idx) in slide.content.activityReadme.requirements"
                :key="idx"
              >
                <span class="material-icons-round bullet-icon">subdirectory_arrow_right</span>
                <span>{{ req }}</span>
              </li>
            </ul>
          </M3Card>

          <!-- Entrega no GitHub -->
          <M3Card variant="outlined" class="activity-card github-box">
            <div class="pillar-header">
              <div class="pillar-icon-box github-icon">
                <span class="material-icons-round">code</span>
              </div>
              <h3 class="pillar-title">Entrega no GitHub</h3>
            </div>
            <p class="pillar-text">
              {{ slide.content?.githubSubmission?.instruction || (typeof slide.content?.githubSubmission === 'string' ? slide.content.githubSubmission : 'Submeter o repositório no GitHub com a estrutura solicitada.') }}
            </p>

            <!-- Pasta no repositório -->
            <div
              v-if="slide.content?.githubSubmission?.folderPath || slide.content?.githubSubmission?.repositoryPattern"
              class="submission-meta-row folder-row"
            >
              <span class="material-icons-round meta-icon">folder_open</span>
              <div class="meta-content">
                <span class="meta-label">Pasta no repositório:</span>
                <code>{{ slide.content.githubSubmission.folderPath || slide.content.githubSubmission.repositoryPattern }}</code>
              </div>
            </div>

            <!-- Arquivo de documentação (.txt / README) -->
            <div
              v-if="slide.content?.githubSubmission?.documentation"
              class="submission-meta-row doc-row"
            >
              <span class="material-icons-round meta-icon">description</span>
              <div class="meta-content">
                <span class="meta-label">Documentação:</span>
                <span class="meta-text">{{ slide.content.githubSubmission.documentation }}</span>
              </div>
            </div>

            <!-- Fotos / Prints obrigatórios -->
            <div
              v-if="slide.content?.githubSubmission?.requiredScreenshots?.length"
              class="submission-screenshots"
            >
              <div class="screenshots-title">
                <span class="material-icons-round meta-icon">photo_library</span>
                <span>Fotos / Prints obrigatórios no envio:</span>
              </div>
              <ul class="screenshots-list">
                <li
                  v-for="(shot, sIdx) in slide.content.githubSubmission.requiredScreenshots"
                  :key="sIdx"
                >
                  <span class="material-icons-round check-icon">check_circle</span>
                  <span>{{ shot }}</span>
                </li>
              </ul>
            </div>

            <!-- Bônus / Upgrade de Menção -->
            <div
              v-if="slide.content?.githubSubmission?.bonus"
              class="submission-bonus-banner"
            >
              <span class="material-icons-round bonus-icon">trending_up</span>
              <div class="bonus-content">
                <span class="bonus-tag">BÔNUS • UPGRADE DE MENÇÃO</span>
                <p class="bonus-text">{{ slide.content.githubSubmission.bonus }}</p>
              </div>
            </div>
          </M3Card>
        </div>

        <!-- Forma de Avaliar -->
        <M3Card
          v-if="slide.content?.evaluationCriteria?.length"
          variant="surface"
          class="activity-evaluation-card"
        >
          <h4 class="card-title">
            <span class="material-icons-round card-icon">rate_review</span>
            Forma de Avaliar
          </h4>
          <div class="criteria-horizontal">
            <div
              v-for="(crit, idx) in slide.content.evaluationCriteria"
              :key="idx"
              class="crit-item"
            >
              <span class="material-icons-round check-bullet">check_circle</span>
              <span>
                <strong>{{ typeof crit === 'object' ? crit.label : crit }}</strong>
                <span v-if="typeof crit === 'object' && crit.weight" class="crit-weight">
                  ({{ crit.weight }})
                </span>
                <span v-if="typeof crit === 'object' && crit.detail" class="crit-detail">
                  — {{ crit.detail }}
                </span>
              </span>
            </div>
          </div>
        </M3Card>
      </div>

      <!-- Fallback Genérico para Avaliação -->
      <div v-else class="assessment-body generic-layout">
        <M3Card
          v-if="slide.content?.description"
          variant="surface"
          class="generic-desc-card"
        >
          <p class="section-text-projector">{{ slide.content.description }}</p>
        </M3Card>
      </div>

      <!-- Callout Box Comum -->
      <div
        v-if="slide.content?.callout"
        :class="['callout-box', `callout-box--${slide.content.callout.type || 'important'}`]"
      >
        <span class="material-icons-round callout-icon">
          {{ slide.content.callout.type === 'tip' ? 'lightbulb' : (slide.content.callout.type === 'info' ? 'info' : 'warning') }}
        </span>
        <span class="callout-text">{{ slide.content.callout.text }}</span>
      </div>
    </div>

    <!-- Optional Image Column -->
    <div v-if="slide.content?.image" class="image-column">
      <img
        :src="slide.content.image.url"
        :alt="slide.content.image.alt || 'Imagem da avaliação'"
        class="slide-image"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import M3Chip from "@/components/ui/M3Chip.vue";
import M3Card from "@/components/ui/M3Card.vue";

const props = defineProps({
  slide: {
    type: Object,
    required: true,
  },
});

const subType = computed(() => {
  const t = props.slide.content?.assessmentType || props.slide.content?.subType || props.slide.assessmentType || "";
  return String(t).toLowerCase();
});

const isSeminar = computed(() => {
  return subType.value.includes("seminar") || subType.value.includes("seminario");
});

const isFinalProject = computed(() => {
  return (
    subType.value.includes("project") ||
    subType.value.includes("projeto") ||
    subType.value.includes("final")
  );
});

const isActivity = computed(() => {
  return (
    subType.value.includes("activity") ||
    subType.value.includes("atividade") ||
    subType.value.includes("entrega") ||
    (!isSeminar.value && !isFinalProject.value)
  );
});

const assessmentTypeLabel = computed(() => {
  if (isSeminar.value) return "Avaliação: Seminário";
  if (isFinalProject.value) return "Avaliação: Projeto Final";
  if (isActivity.value) return "Avaliação: Entrega de Atividade";
  return "Avaliação Oficial";
});

const badgeVariant = computed(() => {
  if (isFinalProject.value) return "error";
  if (isSeminar.value) return "secondary";
  return "primary";
});
</script>

<style scoped>
.slide-content-assessment {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.slide-content-assessment.has-image {
  flex-direction: row;
  align-items: center;
  gap: 36px;
}

.slide-content-assessment.has-image.image-left {
  flex-direction: row-reverse;
}

.text-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  min-width: 0;
}

.image-column {
  flex: 0 0 38%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image {
  max-width: 100%;
  max-height: 55vh;
  object-fit: contain;
  border-radius: var(--md-shape-corner-medium);
  box-shadow: var(--md-elevation-2);
}

.header-chips {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.date-chip {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 700;
}

.slide-title-projector {
  font-size: 46px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--md-sys-color-primary);
  margin-top: 4px;
}

.slide-subtitle-projector {
  font-size: 26px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--md-sys-color-on-surface-variant);
}

.projector-chip {
  font-size: 18px !important;
  padding: 8px 16px !important;
}

/* Assessment Body Layouts */
.assessment-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 4px;
}

/* Seminar Specific */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin-bottom: 10px;
}

.section-icon {
  font-size: 28px;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.topic-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-left: 4px solid var(--md-sys-color-secondary);
}

.topic-index {
  font-size: 22px;
  font-weight: 800;
  color: var(--md-sys-color-secondary);
}

.topic-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
}

.topic-desc {
  font-size: 16px;
  color: var(--md-sys-color-on-surface-variant);
  margin-top: 2px;
}

.details-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.detail-card {
  padding: 18px 22px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin-bottom: 10px;
}

.card-icon {
  font-size: 24px;
}

.criteria-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.criteria-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 18px;
  color: var(--md-sys-color-on-surface);
}

.check-bullet {
  font-size: 22px;
  color: var(--md-sys-color-primary);
  flex-shrink: 0;
  margin-top: 1px;
}

.crit-weight {
  color: var(--md-sys-color-tertiary);
  font-weight: 700;
  margin-left: 4px;
}

.crit-detail {
  color: var(--md-sys-color-on-surface-variant);
}

.delivery-text {
  font-size: 18px;
  line-height: 1.5;
  color: var(--md-sys-color-on-surface);
}

/* Final Project Specific */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .pillars-grid {
    grid-template-columns: 1fr;
  }
}

.pillar-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
}

.pillar-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pillar-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pillar-icon-box .material-icons-round {
  font-size: 28px;
}

.pr-icon {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.standards-icon {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.deploy-icon {
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
}

.pillar-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
}

.pillar-text {
  font-size: 17px;
  line-height: 1.5;
  color: var(--md-sys-color-on-surface-variant);
}

.code-pill {
  margin-top: 8px;
  font-size: 15px;
  color: var(--md-sys-color-on-surface);
}

.code-pill code {
  background: var(--md-sys-color-surface-container-high);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: var(--md-sys-typescale-mono-family);
  font-weight: 600;
}

.standards-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.standards-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 16px;
  color: var(--md-sys-color-on-surface);
}

.bullet-icon {
  font-size: 20px;
  color: var(--md-sys-color-primary);
  flex-shrink: 0;
}

.deploy-platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.platform-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-primary);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.chip-icon {
  font-size: 18px;
}

.project-criteria-card {
  padding: 16px 20px;
}

.criteria-horizontal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.crit-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 17px;
  color: var(--md-sys-color-on-surface);
}

/* Activity Layout */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.activity-card {
  padding: 18px 20px;
}

.readme-icon {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.github-icon {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.activity-evaluation-card {
  padding: 16px 20px;
}

.submission-meta-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--md-sys-color-surface-container-low);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--md-sys-color-outline-variant);
  margin-top: 10px;
}

.submission-meta-row .meta-icon {
  font-size: 20px;
  color: var(--md-sys-color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.submission-meta-row .meta-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.submission-meta-row .meta-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--md-sys-color-on-surface-variant);
}

.submission-meta-row code {
  background: var(--md-sys-color-surface-container-highest);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--md-sys-typescale-mono-family);
  font-size: 14px;
  font-weight: 600;
  color: var(--md-sys-color-primary);
  display: inline-block;
  word-break: break-all;
}

.submission-meta-row .meta-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.submission-screenshots {
  margin-top: 10px;
  background: var(--md-sys-color-surface-container-low);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--md-sys-color-outline-variant);
}

.screenshots-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
  margin-bottom: 6px;
}

.screenshots-title .meta-icon {
  font-size: 18px;
  color: var(--md-sys-color-secondary);
}

.screenshots-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 4px 8px;
}

.screenshots-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--md-sys-color-on-surface);
}

.screenshots-list .check-icon {
  font-size: 15px;
  color: var(--md-sys-color-primary);
  flex-shrink: 0;
}

.submission-bonus-banner {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.14), rgba(245, 158, 11, 0.06));
  border: 1px solid rgba(234, 179, 8, 0.45);
  padding: 8px 12px;
  border-radius: 8px;
}

.submission-bonus-banner .bonus-icon {
  font-size: 22px;
  color: #eab308;
  flex-shrink: 0;
}

.bonus-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bonus-tag {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #ca8a04;
}

:root[data-theme='dark'] .bonus-tag,
.dark-theme .bonus-tag {
  color: #facc15;
}

.bonus-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  margin: 0;
  line-height: 1.35;
}

/* Callout */
.callout-box {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: var(--md-shape-corner-medium);
  margin-top: 6px;
}

.callout-box--important {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
}

.callout-box--warning {
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
}

.callout-box--tip {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.callout-box--info {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-primary);
}

.callout-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.callout-text {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
}
</style>

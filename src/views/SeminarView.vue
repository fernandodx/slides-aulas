<template>
  <div class="seminar-view">
    <M3Navbar />

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p class="m3-body-large">Carregando temas do seminário em tempo real...</p>
    </div>

    <div v-else-if="seminarData" class="seminar-container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb">
        <router-link :to="`/curso/${courseId}`" class="breadcrumb-link m3-label-large">
          <span class="material-icons-round">arrow_back</span>
          {{ course ? course.title : 'Curso' }}
        </router-link>
        <span class="breadcrumb-sep">/</span>
        <span class="m3-label-large active">Seminário de Tecnologias</span>
      </nav>

      <!-- Hero Header Card -->
      <M3Card variant="surface" class="seminar-hero">
        <div class="seminar-hero__top">
          <div class="hero-badges">
            <M3Chip variant="primary" icon="groups">
              {{ seminarData.tag || 'Seminário em Equipes' }}
            </M3Chip>
            <M3Chip variant="success" icon="sensors">
              Sincronização Ativa em Tempo Real
            </M3Chip>
          </div>

          <div class="hero-actions">
            <M3Button
              variant="outlined"
              icon="slideshow"
              @click="openSlides"
            >
              Slides da Avaliação
            </M3Button>
          </div>
        </div>

        <h1 class="m3-display-small seminar-hero__title">
          {{ seminarData.title }}
        </h1>
        <p class="m3-body-large seminar-hero__sub">
          {{ seminarData.subtitle }}
        </p>

        <!-- Stats Chips -->
        <div class="seminar-hero__chips">
          <M3Chip variant="assist" icon="groups_3">
            Até {{ seminarData.settings?.maxStudentsDefault || 4 }} alunos por tema
          </M3Chip>
          <M3Chip v-if="seminarData.presentationRules?.duration" variant="assist" icon="timer">
            {{ seminarData.presentationRules.duration }}
          </M3Chip>
          <M3Chip v-if="seminarData.presentationRules?.date" variant="assist" icon="event">
            Data: {{ seminarData.presentationRules.date }}
          </M3Chip>
          <M3Chip variant="warning" icon="lock">
            Inscrição permanente (sem alteração posterior)
          </M3Chip>
        </div>

        <!-- Rules Notice Banner -->
        <div class="rules-banner">
          <span class="material-icons-round rules-icon">gavel</span>
          <div class="rules-text">
            <strong>Regra da Concorrência:</strong> O primeiro grupo a confirmar o tema garante a vaga.
            Caso outro grupo clique em confirmar antes de você, um aviso imediato será exibido para você escolher outro tema disponível.
          </div>
        </div>
      </M3Card>

      <!-- Status Bar and Filter Chips -->
      <div class="status-bar">
        <div class="status-summary">
          <span class="material-icons-round summary-icon">pie_chart</span>
          <span class="m3-title-medium summary-text">
            <strong>{{ fullCount }}</strong> de <strong>{{ totalTopicsCount }}</strong> temas completos
            <span class="available-badge">({{ availableCount }} com vagas)</span>
          </span>
        </div>

        <div class="filter-chips">
          <button
            class="filter-btn"
            :class="{ active: currentFilter === 'all' }"
            @click="currentFilter = 'all'"
          >
            Todos ({{ totalTopicsCount }})
          </button>
          <button
            class="filter-btn"
            :class="{ active: currentFilter === 'available' }"
            @click="currentFilter = 'available'"
          >
            Com Vagas ({{ availableCount }})
          </button>
          <button
            class="filter-btn"
            :class="{ active: currentFilter === 'open' }"
            @click="currentFilter = 'open'"
          >
            Em Aberto ({{ openCount }})
          </button>
          <button
            class="filter-btn"
            :class="{ active: currentFilter === 'full' }"
            @click="currentFilter = 'full'"
          >
            Completos ({{ fullCount }})
          </button>
        </div>
      </div>

      <!-- Topics Grid -->
      <section class="topics-section">
        <div class="topics-grid">
          <M3Card
            v-for="topic in filteredTopics"
            :key="topic.id"
            :variant="isTopicFull(topic.id) ? 'surface' : 'outlined'"
            class="topic-card"
            :class="{
              'topic-card--full': isTopicFull(topic.id),
              'topic-card--open': isTopicOpen(topic.id),
              'topic-card--available': !isTopicRegistered(topic.id),
            }"
          >
            <!-- Card Header -->
            <div class="topic-card__header">
              <div class="topic-identity">
                <div class="topic-icon-wrap">
                  <span class="material-icons-round topic-icon">{{ topic.icon || 'topic' }}</span>
                </div>
                <div class="topic-identity__text">
                  <div class="topic-title-row">
                    <h3 class="m3-title-large topic-title">{{ topic.title }}</h3>
                    <!-- Status Badge — compact, inline with title -->
                    <span
                      v-if="isTopicFull(topic.id)"
                      class="status-pill status-pill--full"
                    >
                      <span class="material-icons-round" style="font-size:14px">lock</span>
                      Completo
                    </span>
                    <span
                      v-else-if="isTopicOpen(topic.id)"
                      class="status-pill status-pill--open"
                    >
                      <span class="pulse-dot pulse-dot--open"></span>
                      Em Aberto
                    </span>
                    <span
                      v-else
                      class="status-pill status-pill--available"
                    >
                      <span class="pulse-dot"></span>
                      Disponível
                    </span>
                  </div>
                  <span class="m3-label-small topic-limit">
                    {{ getTopicSlotsLabel(topic) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="m3-body-medium topic-desc">
              {{ topic.description }}
            </p>

            <!-- Deliverables Checklist -->
            <div v-if="topic.deliverables?.length" class="deliverables-box">
              <div class="deliverables-title m3-label-medium">
                <span class="material-icons-round">task_alt</span>
                O que deve ser entregue e apresentado:
              </div>
              <ul class="deliverables-list">
                <li
                  v-for="(item, idx) in topic.deliverables"
                  :key="idx"
                  class="m3-body-small"
                >
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Registered Team Box + Join or Lock -->
            <div class="topic-card__bottom">
              <!-- If topic has any students: show current team -->
              <div v-if="isTopicRegistered(topic.id)" class="claimed-box" :class="{ 'claimed-box--open': isTopicOpen(topic.id) }">
                <div class="claimed-header">
                  <span class="material-icons-round">badge</span>
                  <span class="m3-label-medium">
                    {{ isTopicFull(topic.id) ? 'Equipe Completa:' : 'Inscritos até agora:' }}
                  </span>
                  <span v-if="getClaimInfo(topic.id).claimedAt" class="claimed-time m3-label-small">
                    {{ formatClaimDate(getClaimInfo(topic.id).claimedAt) }}
                  </span>
                </div>

                <div class="students-list">
                  <div
                    v-for="(student, idx) in getClaimInfo(topic.id).students"
                    :key="idx"
                    class="student-tag"
                  >
                    <span class="student-avatar">{{ getInitials(student) }}</span>
                    <span class="student-name">{{ student }}</span>
                  </div>
                </div>

                <!-- Open: invite more + join button -->
                <template v-if="isTopicOpen(topic.id)">
                  <div class="open-note">
                    <span class="material-icons-round">group_add</span>
                    Ainda há {{ getRemainingSlots(topic) }} vaga{{ getRemainingSlots(topic) !== 1 ? 's' : '' }}. Mais alunos podem entrar neste grupo.
                  </div>
                  <M3Button
                    variant="tonal"
                    icon="person_add"
                    full-width
                    @click="openClaimModal(topic)"
                  >
                    Entrar neste Grupo
                  </M3Button>
                </template>

                <!-- Full: locked -->
                <template v-else>
                  <div class="locked-note">
                    <span class="material-icons-round">lock</span>
                    Grupo completo. Não há mais vagas neste tema.
                  </div>
                </template>
              </div>

              <!-- If no one registered yet: primary CTA -->
              <div v-else class="available-action">
                <M3Button
                  variant="filled"
                  icon="group_add"
                  full-width
                  @click="openClaimModal(topic)"
                >
                  Garantir este Tema para a Equipe
                </M3Button>
              </div>
            </div>
          </M3Card>
        </div>
      </section>

      <!-- Evaluation Criteria Summary -->
      <section v-if="seminarData.evaluationCriteria?.length" class="criteria-section">
        <h2 class="m3-title-large criteria-title">
          <span class="material-icons-round">fact_check</span>
          Critérios de Avaliação da Banca
        </h2>
        <div class="criteria-grid">
          <M3Card
            v-for="(crit, idx) in seminarData.evaluationCriteria"
            :key="idx"
            variant="surface"
            class="criteria-card"
          >
            <div class="criteria-top">
              <span class="m3-title-medium crit-label">{{ crit.label }}</span>
              <span class="crit-weight-pill">{{ crit.weight }}</span>
            </div>
            <p class="m3-body-small crit-detail">{{ crit.detail }}</p>
          </M3Card>
        </div>
      </section>
    </div>

    <!-- Registration Modal -->
    <M3Modal
      v-model="showClaimModal"
      :title="isTopicOpen(selectedTopic?.id) ? `Entrar no Grupo: ${selectedTopic?.title || 'Tema'}` : `Inscrição: ${selectedTopic?.title || 'Tema'}`"
      :close-on-overlay="!submitting"
    >
      <div v-if="selectedTopic" class="modal-content">
        <!-- Live Conflict: topic became full while modal was open -->
        <div v-if="isConflictDetected" class="conflict-alert">
          <span class="material-icons-round conflict-icon">warning</span>
          <div>
            <strong>Atenção! Este tema acabou de ficar completo!</strong>
            <p class="m3-body-small">
              O grupo atingiu o limite máximo enquanto você digitava.
              Feche esta janela e escolha outro tema com vagas disponíveis.
            </p>
          </div>
        </div>

        <!-- Open group context banner -->
        <div v-if="isTopicOpen(selectedTopic.id) && !isConflictDetected" class="open-group-banner">
          <span class="material-icons-round">groups</span>
          <div>
            <strong>Grupo em aberto</strong> — já há {{ getClaimInfo(selectedTopic.id).students?.length || 0 }} aluno(s) inscrito(s).
            Restam <strong>{{ getRemainingSlots(selectedTopic) }}</strong> vaga(s).
          </div>
        </div>

        <p class="m3-body-medium modal-intro">
          Informe seu(s) nome(s) para entrar neste grupo ({{ getRemainingSlots(selectedTopic) }} vaga{{ getRemainingSlots(selectedTopic) !== 1 ? 's' : '' }} restante{{ getRemainingSlots(selectedTopic) !== 1 ? 's' : '' }}).
          <strong class="warn-text">Aviso: uma vez confirmado, não é possível alterar ou cancelar.</strong>
        </p>

        <!-- Students Inputs -->
        <div class="student-inputs-group">
          <div
            v-for="(slot, idx) in memberSlots"
            :key="idx"
            class="input-row"
          >
            <div class="input-label-row">
              <label class="m3-label-medium">
                {{ idx === 0 ? 'Aluno 1 (Representante da Equipe) *' : `Aluno ${idx + 1}` }}
              </label>
              <button
                v-if="idx > 0 && memberSlots.length > 1"
                type="button"
                class="remove-slot-btn"
                :disabled="submitting || isConflictDetected"
                @click="removeSlot(idx)"
              >
                <span class="material-icons-round">remove_circle_outline</span> Remover
              </button>
            </div>

            <div class="input-wrapper">
              <span class="material-icons-round input-icon">person</span>
              <input
                v-model="memberSlots[idx]"
                type="text"
                class="m3-input"
                :placeholder="idx === 0 ? 'Nome completo do primeiro integrante *' : `Nome completo do aluno ${idx + 1}`"
                :disabled="submitting || isConflictDetected"
                required
              />
            </div>
          </div>

          <div v-if="memberSlots.length < getRemainingSlots(selectedTopic)" class="add-slot-row">
            <button
              type="button"
              class="add-slot-btn"
              :disabled="submitting || isConflictDetected"
              @click="addSlot"
            >
              <span class="material-icons-round">add</span>
              Adicionar outro integrante ({{ memberSlots.length }} de {{ getRemainingSlots(selectedTopic) }} vaga{{ getRemainingSlots(selectedTopic) !== 1 ? 's' : '' }})
            </button>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="submissionError" class="submission-error">
          <span class="material-icons-round">error</span>
          <span>{{ submissionError }}</span>
        </div>
      </div>

      <template #actions>
        <M3Button
          variant="text"
          :disabled="submitting"
          @click="showClaimModal = false"
        >
          Cancelar
        </M3Button>
        <M3Button
          variant="filled"
          icon="check_circle"
          :disabled="submitting || isConflictDetected || !isFormValid"
          @click="submitClaim"
        >
          {{ submitting ? 'Confirmando...' : 'Confirmar e Garantir Tema' }}
        </M3Button>
      </template>
    </M3Modal>

    <!-- Success Feedback Modal -->
    <M3Modal
      v-model="showSuccessModal"
      title="🎉 Tema Garantido com Sucesso!"
    >
      <div class="success-content">
        <div class="success-icon-wrap">
          <span class="material-icons-round success-icon">verified</span>
        </div>
        <h4 class="m3-headline-small success-title">{{ selectedTopic?.title }}</h4>
        <p class="m3-body-medium success-text">
          Sua equipe foi registrada com sucesso! O tema já está bloqueado e atribuído a vocês em tempo real para toda a turma.
        </p>

        <div class="success-summary-box">
          <div class="m3-label-medium summary-heading">Integrantes Confirmados:</div>
          <ul class="success-students-list">
            <li v-for="(name, idx) in registeredSuccessStudents" :key="idx">
              <span class="material-icons-round check-icon">check</span>
              <strong>{{ name }}</strong>
            </li>
          </ul>
        </div>
      </div>
      <template #actions>
        <M3Button
          variant="filled"
          icon="done"
          @click="showSuccessModal = false"
        >
          Entendido, fechar
        </M3Button>
      </template>
    </M3Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import M3Navbar from "@/components/layout/M3Navbar.vue";
import M3Card from "@/components/ui/M3Card.vue";
import M3Chip from "@/components/ui/M3Chip.vue";
import M3Button from "@/components/ui/M3Button.vue";
import M3Modal from "@/components/ui/M3Modal.vue";
import { courseRepository } from "@/services/course.repository";
import { seminarService } from "@/services/seminar.service";

const route = useRoute();
const router = useRouter();

const courseId = route.params.courseId || "desenvolvimento-web";
const assessmentId = route.params.assessmentId || "avaliacao-02";

const loading = ref(true);
const course = ref(null);
const seminarData = ref(null);
const claimedTopicsMap = ref({});
let unsubscribeSnapshot = null;

// Modal States
const showClaimModal = ref(false);
const showSuccessModal = ref(false);
const selectedTopic = ref(null);
const memberSlots = ref([""]);
const submitting = ref(false);
const submissionError = ref("");
const registeredSuccessStudents = ref([]);

// Filter State
const currentFilter = ref("all"); // 'all' | 'available' | 'open' | 'full'

// Topic state helpers
const getClaimInfo = (topicId) => {
  return claimedTopicsMap.value[topicId] || {};
};

/** Has at least one student registered (open OR full) */
const isTopicRegistered = (topicId) => {
  const claim = claimedTopicsMap.value[topicId];
  return Boolean(claim && claim.students && claim.students.length > 0);
};

/** Registered AND below maxStudents — more students can still join */
const isTopicOpen = (topicId) => {
  const claim = claimedTopicsMap.value[topicId];
  if (!claim || !claim.students?.length) return false;
  const max = claim.maxStudents || 4;
  // Open = has students but below capacity (works for both "open" and legacy "claimed")
  return claim.students.length < max;
};

/** Registered AND at/above maxStudents — locked */
const isTopicFull = (topicId) => {
  const claim = claimedTopicsMap.value[topicId];
  if (!claim || !claim.students?.length) return false;
  const max = claim.maxStudents || 4;
  // Full = "full" status (new), OR at/above capacity (covers legacy "claimed")
  return claim.status === "full" || claim.students.length >= max;
};

const getRemainingSlots = (topic) => {
  if (!topic) return 0;
  const max = topic.maxStudents || 4;
  const current = getClaimInfo(topic.id).students?.length || 0;
  return Math.max(0, max - current);
};

const getTopicSlotsLabel = (topic) => {
  const max = topic.maxStudents || 4;
  const current = getClaimInfo(topic.id).students?.length || 0;
  if (current === 0) return `Máximo: ${max} alunos`;
  return `${current} / ${max} alunos inscritos`;
};

// Check if currently selected topic in modal became full while typing
const isConflictDetected = computed(() => {
  if (!selectedTopic.value || !showClaimModal.value) return false;
  return isTopicFull(selectedTopic.value.id);
});

// Counts
const totalTopicsCount = computed(() => {
  return seminarData.value?.topics?.length || 0;
});

/** Topics that are full (no more slots) */
const fullCount = computed(() => {
  if (!seminarData.value?.topics) return 0;
  return seminarData.value.topics.filter((t) => isTopicFull(t.id)).length;
});

/** Topics that have at least one student but are not yet full */
const openCount = computed(() => {
  if (!seminarData.value?.topics) return 0;
  return seminarData.value.topics.filter((t) => isTopicOpen(t.id)).length;
});

/** Topics that still have at least one slot (not registered at all, OR open) */
const availableCount = computed(() => {
  return Math.max(0, totalTopicsCount.value - fullCount.value);
});

// Filtered topics
const filteredTopics = computed(() => {
  const list = seminarData.value?.topics || [];
  if (currentFilter.value === "available") {
    return list.filter((t) => !isTopicFull(t.id));
  }
  if (currentFilter.value === "open") {
    return list.filter((t) => isTopicOpen(t.id));
  }
  if (currentFilter.value === "full") {
    return list.filter((t) => isTopicFull(t.id));
  }
  return list;
});

const isFormValid = computed(() => {
  const first = (memberSlots.value[0] || "").trim();
  return first.length >= 2;
});

// Open Modal to claim
const openClaimModal = (topic) => {
  selectedTopic.value = topic;
  memberSlots.value = [""];
  submissionError.value = "";
  showClaimModal.value = true;
};

const addSlot = () => {
  const remaining = getRemainingSlots(selectedTopic.value);
  if (memberSlots.value.length < remaining) {
    memberSlots.value.push("");
  }
};

const removeSlot = (index) => {
  if (memberSlots.value.length > 1) {
    memberSlots.value.splice(index, 1);
  }
};

const submitClaim = async () => {
  if (!selectedTopic.value || submitting.value) return;

  const validStudents = memberSlots.value
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  if (validStudents.length === 0) {
    submissionError.value = "Informe ao menos o nome do primeiro integrante.";
    return;
  }

  submitting.value = true;
  submissionError.value = "";

  try {
    const result = await seminarService.claimTopic(
      courseId,
      selectedTopic.value,
      validStudents
    );

    if (result.success) {
      registeredSuccessStudents.value = validStudents;
      showClaimModal.value = false;
      showSuccessModal.value = true;
    } else {
      submissionError.value = result.message || "Erro ao registrar o tema.";
    }
  } catch (err) {
    console.error("[SeminarView] Error claiming topic:", err);
    submissionError.value = "Ocorreu um erro inesperado. Tente novamente.";
  } finally {
    submitting.value = false;
  }
};

const openSlides = () => {
  router.push({
    name: "lesson-slide",
    params: {
      courseId,
      lessonId: assessmentId,
      slideIndex: 1,
    },
  });
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const formatClaimDate = (dateVal) => {
  if (!dateVal) return "";
  try {
    const d = new Date(dateVal);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

onMounted(async () => {
  loading.value = true;
  course.value = courseRepository.getCourseById(courseId);

  try {
    const lesson = await courseRepository.getLesson(courseId, assessmentId);
    seminarData.value = lesson;
  } catch (err) {
    console.error("[SeminarView] Failed to load seminar data:", err);
  } finally {
    loading.value = false;
  }

  // Subscribe to real-time topic changes
  unsubscribeSnapshot = seminarService.subscribeToSeminar(
    courseId,
    (updatedClaimMap) => {
      claimedTopicsMap.value = updatedClaimMap;
    },
    (err) => {
      console.warn("[SeminarView] Subscription warning:", err);
    }
  );
});

onUnmounted(() => {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
  }
});
</script>

<style scoped>
.seminar-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 60vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--md-sys-color-surface-container-high);
  border-top-color: var(--md-sys-color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.seminar-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px 64px 20px;
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
  text-decoration: none;
  color: var(--md-sys-color-primary);
  font-weight: 500;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
}

.breadcrumb-sep {
  opacity: 0.5;
}

/* Hero Section */
.seminar-hero {
  padding: 32px;
  border-radius: var(--md-shape-corner-extra-large);
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(
    135deg,
    var(--md-sys-color-surface-container) 0%,
    var(--md-sys-color-surface-container-high) 100%
  );
  box-shadow: var(--md-elevation-1);
}

.seminar-hero__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seminar-hero__title {
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
  line-height: 1.2;
}

.seminar-hero__sub {
  color: var(--md-sys-color-on-surface-variant);
  max-width: 900px;
  line-height: 1.5;
}

.seminar-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.rules-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(103, 80, 164, 0.08);
  border: 1px solid rgba(103, 80, 164, 0.2);
  border-radius: var(--md-shape-corner-medium);
  padding: 12px 16px;
  margin-top: 8px;
}

.rules-icon {
  color: var(--md-sys-color-primary);
  font-size: 24px;
  flex-shrink: 0;
}

.rules-text {
  font-size: 13px;
  line-height: 1.4;
  color: var(--md-sys-color-on-surface);
}

/* Status Bar & Filter */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
  background-color: var(--md-sys-color-surface-container);
  border-radius: var(--md-shape-corner-large);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.status-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-icon {
  color: var(--md-sys-color-primary);
}

.summary-text {
  color: var(--md-sys-color-on-surface);
}

.available-badge {
  color: #137333;
  font-weight: 600;
  margin-left: 6px;
}

.filter-chips {
  display: flex;
  gap: 8px;
}

.filter-btn {
  background: transparent;
  border: 1px solid var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface-variant);
  padding: 6px 14px;
  border-radius: var(--md-shape-corner-full);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: rgba(103, 80, 164, 0.08);
}

.filter-btn.active {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-color: var(--md-sys-color-primary);
}

/* Topics Grid */
.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.topic-card {
  padding: 24px;
  border-radius: var(--md-shape-corner-large);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.topic-card--available:hover {
  transform: translateY(-3px);
  box-shadow: var(--md-elevation-2);
}

.topic-card--full {
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  opacity: 0.95;
}

.topic-card--open {
  border: 1px solid #f9ab00;
  background-color: rgba(249, 171, 0, 0.03);
}

.topic-card--open:hover {
  transform: translateY(-3px);
  box-shadow: var(--md-elevation-2);
}

.topic-card__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.topic-identity {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.topic-identity__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.topic-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topic-title {
  color: var(--md-sys-color-on-surface);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.topic-limit {
  color: var(--md-sys-color-on-surface-variant);
  display: block;
  margin-top: 2px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--md-shape-corner-full);
  font-size: 12px;
  font-weight: 600;
}

.status-pill--available {
  background-color: #e6f4ea;
  color: #137333;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #137333;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(19, 115, 51, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(19, 115, 51, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(19, 115, 51, 0);
  }
}

.status-pill--full {
  background-color: #f1f3f4;
  color: #5f6368;
}

.status-pill--open {
  background-color: #fef7e0;
  color: #b06000;
  border: 1px solid #f9ab00;
}

.pulse-dot--open {
  background-color: #b06000;
  animation: pulse-open 1.8s infinite;
}

@keyframes pulse-open {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(176, 96, 0, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(176, 96, 0, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(176, 96, 0, 0);
  }
}

.topic-desc {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
  font-size: 14px;
}

.deliverables-box {
  background-color: var(--md-sys-color-surface-container);
  border-radius: var(--md-shape-corner-medium);
  padding: 12px 14px;
  border-left: 3px solid var(--md-sys-color-primary);
}

.deliverables-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  margin-bottom: 8px;
}

.deliverables-title .material-icons-round {
  font-size: 16px;
  color: var(--md-sys-color-primary);
}

.deliverables-list {
  padding-left: 18px;
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Claimed Box */
.claimed-box {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-corner-medium);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.claimed-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--md-sys-color-on-surface);
  font-weight: 600;
}

.claimed-header .material-icons-round {
  font-size: 18px;
  color: var(--md-sys-color-primary);
}

.claimed-time {
  margin-left: auto;
  color: var(--md-sys-color-on-surface-variant);
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.student-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--md-sys-color-surface-container-high);
  padding: 6px 10px;
  border-radius: var(--md-shape-corner-small);
}

.student-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.student-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.locked-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--md-sys-color-on-surface-variant);
  font-style: italic;
  margin-top: 4px;
}

.locked-note .material-icons-round {
  font-size: 14px;
}

.open-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #b06000;
  background-color: #fef7e0;
  border: 1px solid #f9ab00;
  border-radius: var(--md-shape-corner-small);
  padding: 8px 10px;
  margin-top: 4px;
  line-height: 1.4;
}

.open-note .material-icons-round {
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

.claimed-box--open {
  border-color: #f9ab00;
  background-color: rgba(249, 171, 0, 0.04);
}

.open-group-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: #fef7e0;
  border: 1px solid #f9ab00;
  border-radius: var(--md-shape-corner-medium);
  padding: 12px 14px;
  font-size: 13px;
  color: #7a4500;
  line-height: 1.5;
}

.open-group-banner .material-icons-round {
  font-size: 20px;
  flex-shrink: 0;
  color: #b06000;
  margin-top: 1px;
}

/* Criteria Section */
.criteria-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.criteria-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-sys-color-on-surface);
}

.criteria-title .material-icons-round {
  color: var(--md-sys-color-primary);
}

.criteria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.criteria-card {
  padding: 16px;
  border-radius: var(--md-shape-corner-large);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.criteria-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.crit-label {
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.crit-weight-pill {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.crit-detail {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.4;
}

/* Modal Form Styles */
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-intro {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.warn-text {
  color: var(--md-sys-color-error);
  display: block;
  margin-top: 4px;
}

.conflict-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  padding: 14px;
  border-radius: var(--md-shape-corner-medium);
  animation: shake 0.4s ease-in-out;
}

.conflict-icon {
  font-size: 28px;
  flex-shrink: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.student-inputs-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--md-sys-color-on-surface);
}

.remove-slot-btn {
  background: none;
  border: none;
  color: var(--md-sys-color-error);
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--md-sys-color-on-surface-variant);
  pointer-events: none;
  font-size: 20px;
}

.m3-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 44px;
  border-radius: var(--md-shape-corner-medium);
  border: 1px solid var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.m3-input:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.2);
}

.m3-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-slot-row {
  display: flex;
  margin-top: 4px;
}

.add-slot-btn {
  background: transparent;
  border: 1px dashed var(--md-sys-color-outline);
  border-radius: var(--md-shape-corner-medium);
  padding: 10px 16px;
  width: 100%;
  color: var(--md-sys-color-primary);
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-slot-btn:hover:not(:disabled) {
  background-color: rgba(103, 80, 164, 0.06);
  border-color: var(--md-sys-color-primary);
}

.submission-error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-sys-color-error);
  background-color: var(--md-sys-color-error-container);
  padding: 10px 14px;
  border-radius: var(--md-shape-corner-medium);
  font-size: 13px;
}

/* Success Modal */
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 12px 0;
}

.success-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e6f4ea;
  color: #137333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  font-size: 40px;
}

.success-title {
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
}

.success-text {
  color: var(--md-sys-color-on-surface-variant);
  max-width: 440px;
  line-height: 1.5;
}

.success-summary-box {
  width: 100%;
  background-color: var(--md-sys-color-surface-container);
  padding: 16px;
  border-radius: var(--md-shape-corner-medium);
  text-align: left;
}

.summary-heading {
  color: var(--md-sys-color-on-surface);
  margin-bottom: 8px;
}

.success-students-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.success-students-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--md-sys-color-on-surface);
}

.check-icon {
  color: #137333;
  font-size: 18px;
}

@media (max-width: 768px) {
  .seminar-container {
    padding: 16px 12px 48px 12px;
  }
  .topics-grid {
    grid-template-columns: 1fr;
  }
  .seminar-hero {
    padding: 20px;
  }
  .status-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

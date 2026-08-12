<template>
  <M3Modal
    :model-value="modelValue"
    title="Configuração do Firebase"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="firebase-form">
      <div v-if="saveSuccess" class="alert alert--success">
        <span class="material-icons-round">check_circle</span>
        Credenciais do Firebase salvas e inicializadas com sucesso!
      </div>

      <p class="m3-body-medium description-text">
        Insira as credenciais do seu projeto Firebase Console para habilitar
        Analytics em tempo real, Remote Config dinâmico e Firestore.
      </p>

      <div class="form-group">
        <label class="m3-label-medium">API Key (apiKey)</label>
        <input
          v-model="form.apiKey"
          type="text"
          class="m3-input"
          placeholder="AIzaSy..."
        />
      </div>

      <div class="form-group">
        <label class="m3-label-medium">Project ID (projectId)</label>
        <input
          v-model="form.projectId"
          type="text"
          class="m3-input"
          placeholder="seu-projeto-firebase"
        />
      </div>

      <div class="form-group">
        <label class="m3-label-medium">App ID (appId)</label>
        <input
          v-model="form.appId"
          type="text"
          class="m3-input"
          placeholder="1:123456789:web:abcdef..."
        />
      </div>

      <div class="form-group">
        <label class="m3-label-medium">Auth Domain (opcional)</label>
        <input
          v-model="form.authDomain"
          type="text"
          class="m3-input"
          placeholder="seu-projeto.firebaseapp.com"
        />
      </div>

      <div class="form-group">
        <label class="m3-label-medium"
          >Measurement ID (Analytics - opcional)</label
        >
        <input
          v-model="form.measurementId"
          type="text"
          class="m3-input"
          placeholder="G-XXXXXXXXXX"
        />
      </div>
    </div>

    <template #actions>
      <M3Button variant="text" @click="$emit('update:modelValue', false)"
        >Cancelar</M3Button
      >
      <M3Button variant="filled" icon="save" @click="handleSave"
        >Salvar Credenciais</M3Button
      >
    </template>
  </M3Modal>
</template>

<script setup>
import { reactive, watch } from "vue";
import M3Modal from "@/components/ui/M3Modal.vue";
import M3Button from "@/components/ui/M3Button.vue";
import { useFirebaseConfigViewModel } from "@/viewmodels/useFirebaseConfigViewModel";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);

const { config, saveSuccess, saveConfig } = useFirebaseConfigViewModel();

const form = reactive({ ...config.value });

watch(
  () => config.value,
  (newVal) => {
    Object.assign(form, newVal);
  }
);

const handleSave = () => {
  saveConfig({ ...form });
};
</script>

<style scoped>
.firebase-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.description-text {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.alert--success {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e6f4ea;
  color: #137333;
  padding: 12px 16px;
  border-radius: var(--md-shape-corner-medium);
  font-size: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m3-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: var(--md-shape-corner-small);
  border: 1px solid var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-font-family);
  font-size: 14px;
  outline: none;
  transition: border-color var(--md-motion-duration-short) ease;
}

.m3-input:focus {
  border-color: var(--md-sys-color-primary);
  border-width: 2px;
}
</style>

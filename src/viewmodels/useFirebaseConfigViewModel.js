import { ref } from "vue";
import {
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  isFirebaseConfigured,
  initFirebase,
} from "@/services/firebase.config";

export function useFirebaseConfigViewModel() {
  const config = ref(getStoredFirebaseConfig());
  const isConfigured = ref(isFirebaseConfigured());
  const saveSuccess = ref(false);

  const saveConfig = (newConfig) => {
    saveFirebaseConfig(newConfig);
    config.value = newConfig;
    isConfigured.value = isFirebaseConfigured(newConfig);
    initFirebase();
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  };

  return {
    config,
    isConfigured,
    saveSuccess,
    saveConfig,
  };
}

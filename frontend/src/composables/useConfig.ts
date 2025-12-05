import { ref } from "vue";
import {
  getPurchaseWaitTime,
  setPurchaseWaitTime,
} from "@/services/configServices";

export function useConfig() {
  const waitTime = ref<number>(0);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const saving = ref<boolean>(false);

  const fetchWaitTime = async () => {
    loading.value = true;
    error.value = null;
    try {
      waitTime.value = await getPurchaseWaitTime();
    } catch (err) {
      error.value = "Error al cargar el tiempo de espera";
      console.error("Error fetching wait time:", err);
    } finally {
      loading.value = false;
    }
  };

  const saveWaitTime = async (minutes: number) => {
    saving.value = true;
    error.value = null;
    try {
      await setPurchaseWaitTime(minutes);
      waitTime.value = minutes;
      return true;
    } catch (err) {
      error.value = "Error al guardar el tiempo de espera";
      console.error("Error saving wait time:", err);
      return false;
    } finally {
      saving.value = false;
    }
  };

  return {
    waitTime,
    loading,
    error,
    saving,
    fetchWaitTime,
    saveWaitTime,
  };
}

import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { getPurchaseWaitTime } from "@/services/commonServices";
import {
  getCurrentTimestamp,
  calculateRemainingTime,
  hasWaitTimeExpired,
} from "@/utils/session";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/lib/const";

const waitTime = ref<number>(1);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const currentTime = ref<number>(getCurrentTimestamp());
const lastPurchaseTime = ref<number | null>(
  storage.get<number | null>(STORAGE_KEYS.LAST_PURCHASE)
);

const isWaiting = computed(() => {
  return (
    lastPurchaseTime.value !== null &&
    !hasWaitTimeExpired(
      lastPurchaseTime.value,
      waitTime.value,
      currentTime.value
    )
  );
});
const remainingTime = computed(() => {
  if (lastPurchaseTime.value === null) return 0;
  return calculateRemainingTime(
    lastPurchaseTime.value,
    waitTime.value,
    currentTime.value
  );
});

watch([lastPurchaseTime, waitTime], () => {
  if (
    lastPurchaseTime.value !== null &&
    hasWaitTimeExpired(
      lastPurchaseTime.value,
      waitTime.value,
      currentTime.value
    )
  ) {
    console.log("Tiempo de espera expirado, limpiando storage");
    lastPurchaseTime.value = null;
    storage.remove(STORAGE_KEYS.LAST_PURCHASE);
  }
});

let updateInterval: number | null = null;
export function useWaitTime() {
  const fetchWaitTime = async () => {
    loading.value = true;
    error.value = null;
    try {
      const time = await getPurchaseWaitTime();
      waitTime.value = time;
      storage.set<number>(STORAGE_KEYS.WAIT_TIME, time);
    } catch (err) {
      error.value = "Error al obtener el tiempo de espera";
      waitTime.value = 1;
    } finally {
      loading.value = false;
    }
  };

  fetchWaitTime();

  onMounted(() => {
    updateInterval = setInterval(() => {
      currentTime.value = getCurrentTimestamp();
    }, 1000);
  });

  onUnmounted(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  });

  return {
    waitTime,
    loading,
    error,
    isWaiting,
    remainingTime,
    fetchWaitTime,
  };
}

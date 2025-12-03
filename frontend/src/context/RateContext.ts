import {
  provide,
  inject,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  type Ref,
} from "vue";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/lib/const";
import { getPurchaseWaitTime } from "@/services/commonServices";
import {
  getCurrentTimestamp,
  calculateRemainingTime,
  hasWaitTimeExpired,
} from "@/utils/session";

const WaitTimeContext = Symbol("WaitTimeContext");

interface WaitTimeContextType {
  waitTime: Ref<number>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  isWaiting: Ref<boolean>;
  remainingTime: Ref<number>;
  lastPurchaseTime: Ref<number | null>;
  cornCount: Ref<number>;
  registerPurchase: (productId: string) => void;
  fetchWaitTime: () => Promise<void>;
}

export function createWaitTimeProvider() {
  const waitTime = ref<number>(1);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);
  const currentTime = ref<number>(getCurrentTimestamp());
  const lastPurchaseTime = ref<number | null>(
    storage.get<number | null>(STORAGE_KEYS.LAST_PURCHASE)
  );
  const cornCount = ref<number>(
    storage.get<number>(STORAGE_KEYS.CORN_COUNT) || 0
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

  const registerPurchase = (productId: string) => {
    const currentTimeValue = getCurrentTimestamp();
    const count = storage.get<number>(STORAGE_KEYS.CORN_COUNT) || 0;
    cornCount.value = count + 1;
    lastPurchaseTime.value = currentTimeValue;
    storage.set<number>(STORAGE_KEYS.LAST_PURCHASE, currentTimeValue);
    storage.set<string>(STORAGE_KEYS.LAST_PURCHASED_PRODUCT, productId);
    storage.set<number>(STORAGE_KEYS.CORN_COUNT, count + 1);
  };

  let updateInterval: number | null = null;

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

  fetchWaitTime();

  const contextValue: WaitTimeContextType = {
    waitTime,
    loading,
    error,
    isWaiting,
    remainingTime,
    lastPurchaseTime,
    cornCount,
    registerPurchase,
    fetchWaitTime,
  };

  provide(WaitTimeContext, contextValue);

  return contextValue;
}

export function useWaitTimeContext(): WaitTimeContextType {
  const context = inject<WaitTimeContextType>(WaitTimeContext);

  if (!context) {
    throw new Error(
      "useWaitTimeContext debe usarse dentro de un WaitTimeProvider"
    );
  }

  return context;
}

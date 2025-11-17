import { useState, useEffect, useCallback, useMemo } from "react";
import { storage, STORAGE_KEYS } from "@/utils/storage";
import {
  getCurrentTimestamp,
  calculateRemainingTime,
  hasWaitTimeExpired,
} from "@/utils/session";
import {
  generateAnimalSessionId,
  generateSessionName,
} from "@/utils/userGenerator";
import { usePurchaseWaitTime } from "./usePurchaseWaitTime";
import { createPurchase } from "@/services/purchaseApiService";
import type { PaymentType } from "@/types/common.types";

interface PurchaseState {
  sessionId: string;
  sessionName: string;
  cornCount: number;
  isWaiting: boolean;
  waitingTimeLeft: number;
  lastPurchaseTime: number | null;
}

export const usePurchaseStore = () => {
  const { waitTime } = usePurchaseWaitTime();

  const [baseState, setBaseState] = useState(() => {
    const sessionId =
      storage.get<string>(STORAGE_KEYS.SESSION_ID) || generateAnimalSessionId();
    const sessionName =
      storage.get<string>(STORAGE_KEYS.SESSION_NAME) || generateSessionName();
    const cornCount = storage.get<number>(STORAGE_KEYS.CORN_COUNT) || 0;
    const lastPurchaseTime = storage.get<number>(STORAGE_KEYS.LAST_PURCHASE);

    return {
      sessionId,
      sessionName,
      cornCount,
      lastPurchaseTime,
    };
  });

  const [currentTime, setCurrentTime] = useState(getCurrentTimestamp());

  const state = useMemo((): PurchaseState => {
    if (!waitTime || !baseState.lastPurchaseTime) {
      return {
        ...baseState,
        isWaiting: false,
        waitingTimeLeft: 0,
      };
    }

    const hasExpired = hasWaitTimeExpired(baseState.lastPurchaseTime, waitTime);
    if (hasExpired) {
      setTimeout(() => {
        storage.remove(STORAGE_KEYS.LAST_PURCHASE);
        setBaseState((prev) => ({
          ...prev,
          lastPurchaseTime: null,
        }));
      }, 0);

      return {
        ...baseState,
        isWaiting: false,
        waitingTimeLeft: 0,
      };
    }

    const remainingTime = calculateRemainingTime(
      baseState.lastPurchaseTime,
      waitTime
    );
    return {
      ...baseState,
      isWaiting: true,
      waitingTimeLeft: remainingTime,
    };
  }, [waitTime, baseState, currentTime]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.SESSION_ID, state.sessionId);
    storage.set(STORAGE_KEYS.SESSION_NAME, state.sessionName);
    storage.set(STORAGE_KEYS.CORN_COUNT, state.cornCount);
  }, [state.sessionId, state.sessionName, state.cornCount]);

  useEffect(() => {
    let interval: number;

    if (state.isWaiting) {
      interval = setInterval(() => {
        setCurrentTime(getCurrentTimestamp());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isWaiting]);

  const registerPurchase = useCallback((productId?: string) => {
    const purchaseTime = getCurrentTimestamp();

    storage.set(STORAGE_KEYS.LAST_PURCHASE, purchaseTime);

    if (productId) {
      storage.set(STORAGE_KEYS.LAST_PURCHASED_PRODUCT, productId);
    }

    setBaseState((prev) => {
      const newCornCount = prev.cornCount + 1;
      storage.set(STORAGE_KEYS.CORN_COUNT, newCornCount);

      return {
        ...prev,
        cornCount: newCornCount,
        lastPurchaseTime: purchaseTime,
      };
    });
  }, []);

  const createPurchaseAction = useCallback(
    async (data: {
      productId: string;
      paymentMethod: PaymentType;
      cardDetails?: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
        holderName: string;
      };
    }) => {
      storage.set(STORAGE_KEYS.SESSION_ID, state.sessionId);

      const response = await createPurchase(data);

      registerPurchase(data.productId);

      return response;
    },
    [registerPurchase, state.sessionId]
  );

  const resetWaitTime = useCallback(() => {
    storage.remove(STORAGE_KEYS.LAST_PURCHASE);
    setBaseState((prev) => ({
      ...prev,
      lastPurchaseTime: null,
    }));
  }, []);

  const canPurchase = !state.isWaiting;

  return {
    sessionId: state.sessionId,
    sessionName: state.sessionName,
    cornCount: state.cornCount,
    isWaiting: state.isWaiting,
    waitingTimeLeft: state.waitingTimeLeft,
    canPurchase,

    registerPurchase,
    createPurchase: createPurchaseAction,
    resetWaitTime,
  };
};

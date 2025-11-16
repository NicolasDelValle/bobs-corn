import { useState, useEffect, useCallback } from "react";
import { storage, STORAGE_KEYS } from "@/utils/storage";
import {
  generateSessionId,
  getCurrentTimestamp,
  calculateRemainingTime,
  hasWaitTimeExpired,
} from "@/utils/session";
import { APP_CONFIG } from "@/config/app";

interface PurchaseState {
  sessionId: string;
  isWaiting: boolean;
  waitingTimeLeft: number;
  lastPurchaseTime: number | null;
}

export const usePurchaseStore = () => {
  const [state, setState] = useState<PurchaseState>(() => {
    // Inicializar estado desde localStorage
    const sessionId =
      storage.get<string>(STORAGE_KEYS.SESSION_ID) || generateSessionId();
    const lastPurchaseTime = storage.get<number>(STORAGE_KEYS.LAST_PURCHASE);

    let isWaiting = false;
    let waitingTimeLeft = 0;

    if (lastPurchaseTime) {
      const hasExpired = hasWaitTimeExpired(
        lastPurchaseTime,
        APP_CONFIG.purchaseWaitTime
      );
      if (!hasExpired) {
        isWaiting = true;
        waitingTimeLeft = calculateRemainingTime(
          lastPurchaseTime,
          APP_CONFIG.purchaseWaitTime
        );
      }
    }

    return {
      sessionId,
      isWaiting,
      waitingTimeLeft,
      lastPurchaseTime,
    };
  });

  // Guardar sessionId en localStorage al inicializar
  useEffect(() => {
    storage.set(STORAGE_KEYS.SESSION_ID, state.sessionId);
  }, [state.sessionId]);

  // Countdown timer
  useEffect(() => {
    let interval: number;

    if (state.isWaiting && state.waitingTimeLeft > 0) {
      interval = setInterval(() => {
        setState((prev) => {
          if (prev.waitingTimeLeft <= 1) {
            // Tiempo expirado
            storage.remove(STORAGE_KEYS.LAST_PURCHASE);
            return {
              ...prev,
              isWaiting: false,
              waitingTimeLeft: 0,
              lastPurchaseTime: null,
            };
          }
          return {
            ...prev,
            waitingTimeLeft: prev.waitingTimeLeft - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isWaiting, state.waitingTimeLeft]);

  // Registrar una nueva compra
  const registerPurchase = useCallback(() => {
    const purchaseTime = getCurrentTimestamp();
    const waitTime = APP_CONFIG.purchaseWaitTime * 60; // convertir a segundos

    storage.set(STORAGE_KEYS.LAST_PURCHASE, purchaseTime);

    setState((prev) => ({
      ...prev,
      isWaiting: true,
      waitingTimeLeft: waitTime,
      lastPurchaseTime: purchaseTime,
    }));
  }, []);

  // Resetear el tiempo de espera (para testing o admin)
  const resetWaitTime = useCallback(() => {
    storage.remove(STORAGE_KEYS.LAST_PURCHASE);
    setState((prev) => ({
      ...prev,
      isWaiting: false,
      waitingTimeLeft: 0,
      lastPurchaseTime: null,
    }));
  }, []);

  // Verificar si puede comprar
  const canPurchase = !state.isWaiting;

  return {
    // Estado
    sessionId: state.sessionId,
    isWaiting: state.isWaiting,
    waitingTimeLeft: state.waitingTimeLeft,
    canPurchase,

    // Acciones
    registerPurchase,
    resetWaitTime,
  };
};

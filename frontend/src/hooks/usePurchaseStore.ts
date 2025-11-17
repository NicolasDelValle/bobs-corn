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
  const { waitTime } = usePurchaseWaitTime(); // Obtener tiempo de espera dinámico

  // Estado base persistido
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

  // Estado para forzar re-renders del countdown
  const [currentTime, setCurrentTime] = useState(getCurrentTimestamp());

  // Estado calculado reactivamente
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
      // Limpiar asíncronamente para evitar efectos en cascada
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
  }, [waitTime, baseState, currentTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // Guardar datos en localStorage
  useEffect(() => {
    storage.set(STORAGE_KEYS.SESSION_ID, state.sessionId);
    storage.set(STORAGE_KEYS.SESSION_NAME, state.sessionName);
    storage.set(STORAGE_KEYS.CORN_COUNT, state.cornCount);
  }, [state.sessionId, state.sessionName, state.cornCount]);

  // Countdown timer
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

  // Registrar una nueva compra
  const registerPurchase = useCallback((productId?: string) => {
    const purchaseTime = getCurrentTimestamp();

    storage.set(STORAGE_KEYS.LAST_PURCHASE, purchaseTime);

    // Guardar el producto comprado si se proporciona
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

  // Crear compra real a través de la API
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
      try {
        // Guardar sessionId en storage para que sea enviado en los headers
        storage.set(STORAGE_KEYS.SESSION_ID, state.sessionId);

        const response = await createPurchase(data);

        // Si llegamos aquí sin excepción, la compra fue exitosa
        registerPurchase(data.productId);

        return response;
      } catch (error) {
        console.error("Error creating purchase:", error);
        throw error;
      }
    },
    [registerPurchase, state.sessionId]
  );

  // Resetear el tiempo de espera
  const resetWaitTime = useCallback(() => {
    storage.remove(STORAGE_KEYS.LAST_PURCHASE);
    setBaseState((prev) => ({
      ...prev,
      lastPurchaseTime: null,
    }));
  }, []);

  // Verificar si puede comprar
  const canPurchase = !state.isWaiting;

  return {
    // Estado
    sessionId: state.sessionId,
    sessionName: state.sessionName,
    cornCount: state.cornCount,
    isWaiting: state.isWaiting,
    waitingTimeLeft: state.waitingTimeLeft,
    canPurchase,

    // Acciones
    registerPurchase,
    createPurchase: createPurchaseAction,
    resetWaitTime,
  };
};

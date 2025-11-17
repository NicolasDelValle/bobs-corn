import { useState, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const get = useCallback(
    (endpoint: string) => execute(() => apiGet<T>(endpoint)),
    [execute]
  );

  const post = useCallback(
    (endpoint: string, data?: unknown) =>
      execute(() => apiPost<T>(endpoint, data)),
    [execute]
  );

  const put = useCallback(
    (endpoint: string, data?: unknown) =>
      execute(() => apiPut<T>(endpoint, data)),
    [execute]
  );

  const del = useCallback(
    (endpoint: string) => execute(() => apiDelete<T>(endpoint)),
    [execute]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
    reset,
    execute,
  };
};

export const usePurchaseApi = () => {
  const api = useApi<{ success: boolean; message: string }>();

  const submitPurchase = useCallback(
    async (purchaseData: {
      paymentMethod: string;
      amount: number;
      sessionId: string;
    }) => {
      return api.post("/purchases", purchaseData);
    },
    [api]
  );

  const getPurchaseHistory = useCallback(
    () => api.get("/purchases/history"),
    [api]
  );

  return {
    ...api,
    submitPurchase,
    getPurchaseHistory,
  };
};

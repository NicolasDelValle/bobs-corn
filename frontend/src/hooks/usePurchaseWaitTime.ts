import { useState, useEffect, useCallback } from "react";
import { getPurchaseWaitTime } from "@/services/commonApi.service";

export const usePurchaseWaitTime = () => {
  const [waitTime, setWaitTime] = useState<number>(5); // Default 5 minutos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaitTime = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const time = await getPurchaseWaitTime();
      setWaitTime(time);
    } catch (err) {
      setError("Error al obtener tiempo de esperra");
      setWaitTime(5);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaitTime();
  }, [fetchWaitTime]);

  return {
    waitTime,
    loading,
    error,
    refetch: fetchWaitTime,
  };
};

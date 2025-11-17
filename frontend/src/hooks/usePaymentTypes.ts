import { useState, useEffect, useCallback } from "react";
import { getPaymentTypes } from "@/services/commonApi.service";
import type { PaymentType } from "@/types/common.types";

export const usePaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const types = await getPaymentTypes();
      setPaymentTypes(types);
    } catch (err) {
      setError("Error al cargar metodos de pago");
      setPaymentTypes([
        {
          id: "mock-1",
          name: "credit_card",
          displayName: "Tarjeta de Crédito",
          icon: "💳",
          isEnabled: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mock-2",
          name: "paypal",
          displayName: "PayPal",
          icon: "🅿️",
          isEnabled: true,
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  return {
    paymentTypes,
    loading,
    error,
    refetch: fetchPaymentTypes,
  };
};

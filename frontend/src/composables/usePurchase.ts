import type { CardDetails, PaymentType } from "@/types/common";
import { createPurchase } from "@/services/purchaseServices";

export function usePurchase(callback?: () => void) {
  const purchase = async (data: {
    productId: string;
    paymentMethod: PaymentType;
    cardDetails?: CardDetails;
  }) => {
    try {
      const result = await createPurchase(data);
      callback && callback();
      return result;
    } catch (error) {
      console.error("Error creating purchase:", error);
    }
  };

  return {
    purchase,
  };
}

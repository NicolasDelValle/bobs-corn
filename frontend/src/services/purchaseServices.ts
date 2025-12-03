import { apiPost } from "@/lib/api";
import { apiRoutes } from "@/lib/apiRoutes";
import type { CardDetails, PaymentType } from "@/types/common";
import type { PurchaseRequest, PurchaseResponse } from "@/types/purchases";

export const createPurchase = async (data: {
  productId: string;
  paymentMethod: PaymentType;
  cardDetails?: CardDetails;
}): Promise<PurchaseResponse> => {
  const request: PurchaseRequest = {
    productId: data.productId,
    paymentMethod: {
      name: data.paymentMethod.name,
      identifier:
        data.cardDetails?.cardNumber ||
        `${data.paymentMethod.name.toUpperCase()}-${Date.now()}`,
    },
  };

  return apiPost<PurchaseResponse>(apiRoutes.purchases.create, request);
};

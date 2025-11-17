import { apiPost } from "@/lib/api";
import type { PaymentType } from "@/types/common.types";

interface PurchaseRequest {
  productId: string;
  paymentMethod: {
    name: string;
    identifier: string;
  };
}

interface PurchaseResponse {
  id: string;
  clientId: string;
  productId: string;
  purchasedAt: string;
  client: {
    id: string;
    sessionId: string;
    createdAt: string;
    lastActive: string;
  };
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isEnabled: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  paymentMethod: {
    id: string;
    name: string;
    identifierHash: string;
    lastFourDigits: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export const createPurchase = async (data: {
  productId: string;
  paymentMethod: PaymentType;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    holderName: string;
  };
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

  return apiPost<PurchaseResponse>("/purchases", request);
};

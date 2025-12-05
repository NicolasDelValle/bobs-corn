import { apiPost, apiGet } from "@/lib/api";
import { apiRoutes } from "@/lib/apiRoutes";
import type { CardDetails, PaymentType } from "@/types/common";
import type { PurchaseRequest, PurchaseResponse } from "@/types/purchases";

export interface PurchasesListResponse {
  data: PurchaseResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getPurchases = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PurchasesListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }

  if (params?.limit) {
    searchParams.append("limit", params.limit.toString());
  }

  const url = `${apiRoutes.purchases.list}?${searchParams.toString()}`;
  return apiGet<PurchasesListResponse>(url);
};

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

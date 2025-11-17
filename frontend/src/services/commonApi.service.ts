import { apiGet, apiPut, apiPost } from "@/lib/api";
import type { PaymentType, CommonApiResponse } from "@/types/common.types";

export const getPurchaseWaitTime = async (): Promise<number> => {
  const response = await apiGet<CommonApiResponse>(
    "/common/purchase-wait-time"
  );
  return response.waitTime || 5;
};

export const setPurchaseWaitTime = async (minutes: number): Promise<void> => {
  await apiPut<CommonApiResponse>("/common/purchase-wait-time", { minutes });
};

export const getPaymentTypes = async (): Promise<PaymentType[]> => {
  return apiGet<PaymentType[]>("/common/payment-types");
};

export const createPaymentType = async (data: {
  name: string;
  displayName: string;
  icon: string;
  order?: number;
}): Promise<PaymentType> => {
  return apiPost<PaymentType>("/common/payment-types", data);
};

export const updatePaymentType = async (
  id: string,
  data: {
    name?: string;
    displayName?: string;
    icon?: string;
    isEnabled?: boolean;
    order?: number;
  }
): Promise<PaymentType> => {
  return apiPut<PaymentType>(`/common/payment-types/${id}`, data);
};

export const deletePaymentType = async (id: string): Promise<void> => {
  await apiGet<CommonApiResponse>(`/common/payment-types/${id}`);
};

export const seedPaymentTypes = async (): Promise<void> => {
  await apiPost<CommonApiResponse>("/common/seed-payment-types", {});
};

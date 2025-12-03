import { apiGet, apiPut, apiPost } from "@/lib/api";
import type { PaymentType, CommonApiResponse } from "@/types/common";
import { apiRoutes } from "@/lib/apiRoutes";

export const getPurchaseWaitTime = async (): Promise<number> => {
  const response = await apiGet<CommonApiResponse>(
    apiRoutes.common.purchaseWaitTime
  );
  return response.waitTime || 5;
};

export const setPurchaseWaitTime = async (minutes: number): Promise<void> => {
  await apiPut<CommonApiResponse>(apiRoutes.common.purchaseWaitTime, {
    minutes,
  });
};

export const getPaymentTypes = async (): Promise<PaymentType[]> => {
  return apiGet<PaymentType[]>(apiRoutes.common.paymentTypes.list);
};

export const createPaymentType = async (data: {
  name: string;
  displayName: string;
  icon: string;
  order?: number;
}): Promise<PaymentType> => {
  return apiPost<PaymentType>(apiRoutes.common.paymentTypes.create, data);
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
  return apiPut<PaymentType>(apiRoutes.common.paymentTypes.update(id), data);
};

export const deletePaymentType = async (id: string): Promise<void> => {
  await apiGet<CommonApiResponse>(apiRoutes.common.paymentTypes.delete(id));
};

export const seedPaymentTypes = async (): Promise<void> => {
  await apiPost<CommonApiResponse>(apiRoutes.common.paymentTypes.seed, {});
};

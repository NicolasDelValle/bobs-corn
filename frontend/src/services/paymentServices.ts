import { apiGet, apiPut, apiPost } from "@/lib/api";
import type { PaymentType, CommonApiResponse } from "@/types/common";
import { apiRoutes } from "@/lib/apiRoutes";

export const getPaymentTypes = async (): Promise<PaymentType[]> => {
  return apiGet<PaymentType[]>(apiRoutes.payments.types.list);
};

export const createPaymentType = async (data: {
  name: string;
  displayName: string;
  icon: string;
  order?: number;
}): Promise<PaymentType> => {
  return apiPost<PaymentType>(apiRoutes.payments.types.create, data);
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
  return apiPut<PaymentType>(apiRoutes.payments.types.update(id), data);
};

export const deletePaymentType = async (id: string): Promise<void> => {
  await apiGet<CommonApiResponse>(apiRoutes.payments.types.delete(id));
};

export const seedPaymentTypes = async (): Promise<void> => {
  await apiPost<CommonApiResponse>(apiRoutes.payments.types.seed, {});
};

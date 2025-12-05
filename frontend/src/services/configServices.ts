import { apiGet, apiPut } from "@/lib/api";
import type { CommonApiResponse } from "@/types/common";
import { apiRoutes } from "@/lib/apiRoutes";

export const getPurchaseWaitTime = async (): Promise<number> => {
  const response = await apiGet<CommonApiResponse>(
    apiRoutes.config.purchaseWaitTime
  );
  return response.waitTime || 60;
};

export const setPurchaseWaitTime = async (minutes: number): Promise<void> => {
  await apiPut<CommonApiResponse>(apiRoutes.config.purchaseWaitTime, {
    minutes,
  });
};

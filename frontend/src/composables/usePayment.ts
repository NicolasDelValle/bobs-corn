import { ref } from "vue";

import type { PaymentType } from "@/types/common";
import { getPaymentTypes } from "@/services/commonServices";

const paymentTypes = ref<Array<PaymentType>>([]);
const loading = ref(false);

export function usePayment() {
  const fetchPaymentTypes = async () => {
    loading.value = true;
    try {
      const response = await getPaymentTypes();
      paymentTypes.value = response;
    } catch (error) {
      console.error("Error fetching payment types:", error);
    } finally {
      loading.value = false;
    }
  };

  fetchPaymentTypes();

  return {
    paymentTypes,
    loading,
    fetchPaymentTypes,
  };
}

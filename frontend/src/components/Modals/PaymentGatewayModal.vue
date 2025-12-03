<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { usePayment } from '@/composables/usePayment';
import { ref } from 'vue';
import DebitCardForm from '@/components/Forms/DebitCardForm.vue';
import type { CardDetails, PaymentType } from "@/types/common";

const { paymentTypes, loading } = usePayment();


const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{

  (e: 'update:visible', value: boolean): void;
  (e: 'payment-selected', paymentType: PaymentType): void;
  (e: 'payment-debit-processed', data: CardDetails): void;
  (e: 'submit'): void;
}>();

const selectedPayment = ref<PaymentType | null>(null);
const currentStep = ref<'selection' | 'debit-form'>('selection');

function selectPayment(paymentType: PaymentType) {
  selectedPayment.value = paymentType;

  emit('payment-selected', paymentType);

}

function goBackToSelection() {
  currentStep.value = 'selection';
  selectedPayment.value = null;
}

function handleDebitCardSubmit(cardData: CardDetails) {
  emit('payment-debit-processed', cardData);
  handleModalClose(false);

}

function handleContinue() {
  if (selectedPayment.value) {
    if (selectedPayment.value.name === 'debit') {
      currentStep.value = 'debit-form';
    } else {
      handleModalClose(false);
    }

  }
}

function handleModalClose(value: boolean) {
  emit('update:visible', value);
  emit('submit');
  if (!value) {
    currentStep.value = 'selection';
    selectedPayment.value = null;
  }
}

</script>
<template>
  <Dialog :header="currentStep === 'selection' ? 'Selecciona tu método de pago' : 'Completar pago'" :draggable="false"
    :visible="props.visible" :modal="true" :closable="true" @update:visible="handleModalClose"
    :style="{ width: '550px' }" class="payment-modal m-4">

    <!-- Debit Card Form -->
    <DebitCardForm v-if="currentStep === 'debit-form'" @submit="handleDebitCardSubmit" @back="goBackToSelection" />

    <!-- Payment Selection -->
    <div v-else>
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-center p-2 bg-gray-100 rounded-xl animate-pulse">
          <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div class="ml-4 flex-1 space-y-2">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Payment Types Grid -->
      <div v-else class="grid grid-cols-1 gap-4 pb-4">
        <div v-for="(paymentType, index) in paymentTypes" :key="paymentType.id" v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.95 }" :enter="{ opacity: 1, y: 0, scale: 1 }" :delay="index * 100"
          :duration="400" @click="selectPayment(paymentType)" :class="[
            'group relative bg-white border-2 rounded-xl py-4 px-2 cursor-pointer transition-all duration-300 hover:shadow-lg',
            selectedPayment?.id === paymentType.id
              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
              : paymentType.isEnabled
                ? 'border-gray-200 hover:border-green-300'
                : 'border-gray-200 opacity-50 cursor-not-allowed',
            !paymentType.isEnabled && 'pointer-events-none'
          ]">



          <!-- Payment Method Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- Icon -->
              <div>
                <div :class="[
                  'w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300',
                  selectedPayment?.id === paymentType.id
                    ? 'bg-green-100'
                    : 'bg-gray-100 group-hover:bg-green-50'
                ]">
                  <!-- URL Image -->
                  <img v-if="paymentType.icon.startsWith('http')" :src="paymentType.icon" :alt="paymentType.displayName"
                    class="w-10 h-10 object-contain" />
                  <!-- SVG String -->
                  <div v-else v-html="paymentType.icon"></div>
                </div>
              </div>

              <!-- Name and Display Name -->
              <div class="flex-1">
                <h3 :class="[
                  'font-bold text-lg transition-colors duration-300',
                  selectedPayment?.id === paymentType.id
                    ? 'text-green-800'
                    : 'text-gray-800 group-hover:text-green-700'
                ]">
                  {{ paymentType.displayName }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Selected Indicator -->
          <div v-if="selectedPayment?.id === paymentType.id" v-motion :initial="{ scale: 0 }" :enter="{ scale: 1 }"
            :duration="300"
            class="absolute top-8 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">✓</span>
          </div>

          <!-- Hover glow effect -->
          <div v-if="paymentType.isEnabled"
            class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/0 to-blue-400/0 group-hover:from-green-400/5 group-hover:to-blue-400/5 transition-all duration-300 pointer-events-none">
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="currentStep === 'selection'"
        class="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
        <div class="text-sm text-gray-600">
          {{paymentTypes.filter(p => p.isEnabled).length}} métodos disponibles
        </div>

        <div class="flex gap-3">
          <button @click="handleModalClose(false)"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
            Cancelar
          </button>

          <button @click="handleContinue" :disabled="!selectedPayment" :class="[
            'px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200',
            selectedPayment
              ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]">
            {{ selectedPayment?.name === 'debit' ? 'Siguiente' : 'Continuar' }}
          </button>
        </div>
      </div>

    </div>
  </Dialog>
</template>

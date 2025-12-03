<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CardDetails } from "@/types/common";

const emit = defineEmits<{
  (e: 'submit', data: CardDetails): void;
  (e: 'back'): void;
}>();

const form = ref<CardDetails>({
  cardNumber: '',
  holderName: '',
  expiryDate: '',
  cvv: ''
});

const errors = ref<Record<string, string>>({});

const validateForm = () => {
  errors.value = {};

  if (!form.value.cardNumber || form.value.cardNumber.replace(/\s/g, '').length < 16) {
    errors.value.cardNumber = 'Número de tarjeta inválido';
  }

  if (!form.value.holderName || form.value.holderName.length < 2) {
    errors.value.holderName = 'Nombre requerido';
  }

  if (!form.value.expiryDate || !/^\d{2}\/\d{2}$/.test(form.value.expiryDate)) {
    errors.value.expiryDate = 'Formato MM/YY';
  }

  if (!form.value.cvv || !/^\d{3,4}$/.test(form.value.cvv)) {
    errors.value.cvv = 'CVV inválido';
  }

  return Object.keys(errors.value).length === 0;
};

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

const formatExpiry = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .substring(0, 5);
};

const onCardInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  form.value.cardNumber = formatCardNumber(target.value);
};

const onExpiryInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  form.value.expiryDate = formatExpiry(target.value);
};

const onCvvInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  form.value.cvv = target.value.replace(/\D/g, '').substring(0, 4);
};

const isValid = computed(() => {
  return form.value.cardNumber.replace(/\s/g, '').length === 16 &&
    form.value.holderName.length > 1 &&
    /^\d{2}\/\d{2}$/.test(form.value.expiryDate) &&
    /^\d{3,4}$/.test(form.value.cvv);
});

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      cardNumber: form.value.cardNumber.replace(/\s/g, ''),
      holderName: form.value.holderName,
      expiryDate: form.value.expiryDate,
      cvv: form.value.cvv
    });
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->


    <!-- Card Preview -->
    <div v-motion :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }" :delay="100" :duration="400"
      class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg px-4 py-8 text-white h-44 flex flex-col justify-between">
      <div class="text-lg font-mono tracking-wider mb-2">
        {{ form.cardNumber || '•••• •••• •••• ••••' }}
      </div>
      <div class="flex justify-between text-sm">
        <span>{{ form.holderName || 'NOMBRE APELLIDO' }}</span>
        <span>{{ form.expiryDate || 'MM/YY' }}</span>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0 }" :delay="200" :duration="300">
        <label class="block text-sm font-medium mb-2">Número de tarjeta</label>
        <input :value="form.cardNumber" @input="onCardInput" placeholder="1234 5678 9012 3456" maxlength="19"
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.cardNumber }" />
        <p v-if="errors.cardNumber" class="text-red-600 text-sm mt-1">{{ errors.cardNumber }}</p>
      </div>

      <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0 }" :delay="300" :duration="300">
        <label class="block text-sm font-medium mb-2">Nombre del titular</label>
        <input v-model="form.holderName" placeholder="Como aparece en la tarjeta"
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
          :class="{ 'border-red-500': errors.holderName }" />
        <p v-if="errors.holderName" class="text-red-600 text-sm mt-1">{{ errors.holderName }}</p>
      </div>

      <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0 }" :delay="400" :duration="300"
        class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Vencimiento</label>
          <input :value="form.expiryDate" @input="onExpiryInput" placeholder="MM/YY" maxlength="5"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.expiryDate }" />
          <p v-if="errors.expiryDate" class="text-red-600 text-sm mt-1">{{ errors.expiryDate }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">CVV</label>
          <input :value="form.cvv" @input="onCvvInput" placeholder="123" maxlength="4"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.cvv }" />
          <p v-if="errors.cvv" class="text-red-600 text-sm mt-1">{{ errors.cvv }}</p>
        </div>
      </div>
      <button v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }" :delay="500" :duration="400"
        size="small"
        class="w-full py-1 rounded-lg transition-colors font-medium border-2 border-green-700/50 text-green-700 hover:bg-green-100 "
        icon="pi pi-arrow-left" text @click="emit('back')">Volver</button>


      <button v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" :delay="500" :duration="400"
        type="submit" :disabled="!isValid" class="w-full py-3 rounded-lg font-medium transition-colors" :class="isValid
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
        Procesar pago
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
import type { Product } from '@/types/product';
import { ref, watch } from 'vue';

const selected = ref(false);


const props = defineProps<{
  index: number
  selectedProduct: string
  product: Product
  disabled?: boolean
}>();

const emit = defineEmits<{
  (e: 'select', productId: string): void
  (e: 'buy', productId: string): void
}>();

function toggleSelect() {
  if (props.product.isEnabled && !props.disabled) {
    emit('select', props.product.id);
  }
}

function buyProduct() {
  if (props.product.isEnabled && !props.disabled && selected.value) {
    emit('buy', props.product.id);
  } else {
    toggleSelect();
  }
}

watch(() => props.selectedProduct, (newVal) => {
  selected.value = newVal === props.product.id;
});

</script>
<template>
  <div @click="toggleSelect" v-motion :initial="{ opacity: 0, y: 20, scale: 0.9 }"
    :enter="{ opacity: 1, y: 0, scale: 1 }" :duration="400" :delay="100 + 50 * props.index" :class="[
      'group relative rounded-xl border-2 transition-all duration-300 overflow-hidden h-full flex flex-col',
      // Estados de disabled (producto no habilitado o disabled temporal)
      !props.product.isEnabled || props.disabled
        ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
        : 'bg-white cursor-pointer hover:shadow-md',
      // Opacidad para disabled temporal vs producto deshabilitado  
      !props.product.isEnabled
        ? 'opacity-60'
        : props.disabled
          ? 'opacity-75'
          : 'opacity-100',
      // Estados de selección (solo si está completamente habilitado)
      props.product.isEnabled && !props.disabled && selected
        ? 'border-green-500 shadow-lg ring-2 ring-green-200'
        : props.product.isEnabled && !props.disabled
          ? 'border-gray-200 hover:border-green-300'
          : 'border-gray-200'
    ]">

    <div class="aspect-w-16 aspect-h-9 relative overflow-hidden">
      <img :src="props.product.imageUrl" :alt="props.product.name" :class="[
        'w-full h-48 object-cover transition-transform duration-300',
        // Hover solo si está completamente habilitado
        props.product.isEnabled && !props.disabled
          ? 'group-hover:scale-105'
          : '',
        // Grayscale para producto deshabilitado, blur para disabled temporal
        !props.product.isEnabled
          ? 'filter grayscale'
          : props.disabled
            ? 'filter blur-sm'
            : ''
      ]" />

      <div v-if="props.product.isEnabled && !props.disabled && selected"
        class="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        ✓ Seleccionado
      </div>

      <div v-if="!props.product.isEnabled"
        class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        No disponible
      </div>

      <div v-if="props.product.isEnabled && props.disabled"
        class="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        ⏱️ Espera
      </div>

      <div v-if="props.product.isEnabled && !props.disabled"
        class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

      <div v-if="!props.product.isEnabled" class="absolute inset-0 bg-gray-500/20"></div>
      <div v-if="props.disabled" class="absolute inset-0 bg-orange-500/10"></div>
    </div>

    <div class="p-5 flex-1 flex flex-col">
      <div class="flex justify-between items-start mb-3 flex-1">
        <div class="flex-1 min-h-0">
          <h3 :class="[
            'font-bold text-lg transition-colors duration-200 line-clamp-2',
            props.product.isEnabled
              ? 'text-gray-800 group-hover:text-green-700'
              : 'text-gray-500'
          ]">
            {{ props.product.name }}
          </h3>
          <p :class="[
            'text-sm mt-2 line-clamp-3 flex-1',
            props.product.isEnabled ? 'text-gray-500' : 'text-gray-400'
          ]">
            {{ props.product.description }}
          </p>
        </div>

        <div class="ml-4 text-right flex-shrink-0">
          <div :class="[
            'text-2xl font-bold',
            props.product.isEnabled ? 'text-green-600' : 'text-gray-400'
          ]">
            ${{ props.product.price.toFixed(2) }}
          </div>
          <div class="text-xs text-gray-400">
            c/u
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-auto pt-4">
        <div class="flex items-center gap-2">
          <span :class="[
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
            props.product.isEnabled
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          ]">
            <span :class="[
              'w-1.5 h-1.5 rounded-full mr-1.5',
              props.product.isEnabled ? 'bg-green-400' : 'bg-red-400'
            ]"></span>
            {{ props.product.isEnabled ? 'Disponible' : 'No disponible' }}
          </span>
        </div>

        <button @click.stop="buyProduct" :disabled="!props.product.isEnabled || props.disabled" :class="[
          'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex-shrink-0',
          // Producto no habilitado
          !props.product.isEnabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            // Disabled temporal
            : props.disabled
              ? 'bg-orange-100 text-orange-600 cursor-not-allowed'
              // Estados normales cuando está habilitado
              : selected
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
        ]">
          {{
            !props.product.isEnabled ? 'No disponible' :
              props.disabled ? 'Esperando...' :
                selected ? 'Comprar ' : 'Seleccionar'
          }}
        </button>
      </div>
    </div>

    <div class="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-600 text-xs px-2 py-1 rounded-full">
      #{{ props.product.order }}
    </div>
  </div>
</template>
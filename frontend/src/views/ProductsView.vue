<script setup lang="ts">
import { useProducts } from '@/composables/useProducts';
import { Tag } from 'primevue';

const { products } = useProducts();
import DataView from 'primevue/dataview';

</script>
<template>
  <div class="card">
    <DataView :value="products">
      <template #list="slotProps">
        <div class="flex flex-col ">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
              :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
              <div class="md:w-40 relative">
                <img class="block xl:block mx-auto rounded w-full" :src="item.imageUrl" :alt="item.name" />
                <div class="absolute rounded-border" style="left: 4px; top: 4px">
                  <Tag v-if="item.isEnabled">Disponible</Tag>
                  <Tag v-else severity="danger">No Disponible</Tag>
                </div>
              </div>
              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                  <div>
                    <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                  </div>
                  <div class="bg-surface-100" style="border-radius: 30px">
                    <div class="bg-surface-0 flex items-center gap-2 justify-center">
                      <span class="font-medium text-sm">{{ item.description }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-8">
                  <span class="text-2xl font-semibold">${{ item.price }}</span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>
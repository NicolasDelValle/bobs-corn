<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';

import { APP_CONFIG } from '@/config/app';
import NavBar from '@/components/NavBar/NavBar.vue';
import TabButton from '@/components/Commons/TabButton.vue';
import ViewContainer from '@/components/Commons/ViewContainer.vue';
import ProductsView from '@/views/ProductsView.vue';
import { useConfig } from '@/composables/useConfig';

const { waitTime, loading, error, saving, fetchWaitTime, saveWaitTime } = useConfig();
const tempWaitTime = ref<number>(0);

const handleSaveWaitTime = async () => {
  if (tempWaitTime.value > 0) {
    await saveWaitTime(tempWaitTime.value);
  }
};

onMounted(() => {
  fetchWaitTime().then(() => {
    tempWaitTime.value = waitTime.value;
  });
});

</script>

<template>
  <NavBar />
  <div>

    <ViewContainer>
      <div class="bg-blue-50 p-6 rounded-lg w-full">
        <h2 class="text-xl font-semibold mb-4 text-blue-800">Configuración</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded">
            <p class="font-medium text-gray-700">App Name:</p>
            <p class="text-blue-600">{{ APP_CONFIG.app.name }}</p>
          </div>
          <div class="bg-white p-4 rounded">
            <p class="font-medium text-gray-700 mb-2">Tiempo de espera entre compras (segundos):</p>
            <div class="flex gap-2 items-center">
              <InputNumber v-model="tempWaitTime" :min="1" :max="3600" :disabled="loading || saving" class="flex-1"
                placeholder="Segundos" />
              <Button @click="handleSaveWaitTime" :disabled="loading || saving || tempWaitTime <= 0" :loading="saving"
                label="Guardar" size="small" />
            </div>
            <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
            <p v-if="!loading && !error" class="text-gray-500 text-sm mt-1">
              Tiempo actual: {{ waitTime }} segundos
            </p>
          </div>
        </div>
      </div>

      <div class="w-full">
        <Tabs value="0" style="background: transparent !important;">
          <TabList style="background: transparent !important;">
            <Tab value="0" style="background: transparent !important;">
              <TabButton label="Productos">
                <i class="pi pi-box"></i>
              </TabButton>
            </Tab>
            <Tab value="1" style="background: transparent !important;">
              <TabButton label="Compras">
                <i class="pi pi-shopping-bag"></i>
              </TabButton>
            </Tab>
            <Tab value="2" style="background: transparent !important;">
              <TabButton label="Métodos De Pago">
                <i class="pi pi-dollar"></i>
              </TabButton>
            </Tab>
          </TabList>
          <TabPanels style="background: transparent !important;">
            <TabPanel style="background: transparent !important;" value="0">
              <ProductsView />
            </TabPanel>
            <TabPanel style="background: transparent !important;" value="1">
              <p class="m-0">
                Seccion en construcción...
              </p>
            </TabPanel>
            <TabPanel style="background: transparent !important;" value="2">
              <p class="m-0">
                Seccion en construcción...
              </p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ViewContainer>
  </div>
</template>
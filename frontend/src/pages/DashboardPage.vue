<script setup lang="ts">
import { ref } from 'vue';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import { APP_CONFIG } from '@/config/app';
import { config } from '@/config';
import NavBar from '@/components/NavBar/NavBar.vue';
import TabButton from '@/components/Commons/TabButton.vue';
import ViewContainer from '@/components/Commons/ViewContainer.vue';
import ProductsView from '@/views/ProductsView.vue';

const isLoading = ref(false);

</script>

<template>
  <NavBar />
  <div>

    <ViewContainer>
      <!-- Información de configuración -->
      <div class="bg-blue-50 p-6 rounded-lg w-full">
        <h2 class="text-xl font-semibold mb-4 text-blue-800">Configuración</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded">
            <p class="font-medium text-gray-700">App Name:</p>
            <p class="text-blue-600">{{ APP_CONFIG.app.name }}</p>
          </div>
          <div class="bg-white p-4 rounded">
            <p class="font-medium text-gray-700">API URL:</p>
            <p class="text-blue-600">{{ config.api.baseUrl }}</p>
          </div>
          <div class="bg-white p-4 rounded">
            <p class="font-medium text-gray-700">Product:</p>
            <p class="text-blue-600">{{ APP_CONFIG.PRODUCT.name }} {{ APP_CONFIG.PRODUCT.image }}</p>
          </div>
          <div class="bg-white p-4 rounded">
            <p class="font-medium text-gray-700">Price:</p>
            <p class="text-blue-600">${{ APP_CONFIG.PRODUCT.price }} {{ APP_CONFIG.PRODUCT.currency }}</p>
          </div>
        </div>
      </div>

      <!-- Variantes -->
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
          <TabPanels>
            <TabPanel value="0">
              <ProductsView />
            </TabPanel>
            <TabPanel value="1">
              <p class="m-0">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
                eos
                qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
              </p>
            </TabPanel>
            <TabPanel value="2">
              <p class="m-0">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                deleniti
                atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
                similique
                sunt in culpa
                qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est
                et
                expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus.
              </p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ViewContainer>
  </div>
</template>
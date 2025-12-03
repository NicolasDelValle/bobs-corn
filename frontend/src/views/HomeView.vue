<script setup lang="ts">
import Divider from 'primevue/divider';

import NavBar from '@/components/NavBar/NavBar.vue';
import ViewContainer from '@/components/Commons/ViewContainer.vue';

import UserStats from '@/components/UserStats/UserStats.vue';
import ProductLayout from '@/components/Layouts/ProductLayout.vue';
import { createWaitTimeProvider } from '@/context/RateContext';

// Crear el provider de tiempo de espera al nivel raíz
createWaitTimeProvider();
</script>

<template>
  <div class="flex flex-col h-full">
    <NavBar />
    <ViewContainer>
      <UserStats />
      <Divider />
      <ProductLayout />
    </ViewContainer>
  </div>
</template>

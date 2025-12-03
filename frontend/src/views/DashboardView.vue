<script setup lang="ts">
import { ref } from 'vue';
import Button from "primevue/button"
import { APP_CONFIG } from '@/config/app';
import { config } from '@/config';
import NavBar from '@/components/NavBar/NavBar.vue';

const isLoading = ref(false);

const handleClick = () => {
  console.log('Button clicked!');
  console.log('App name:', APP_CONFIG.app.name);
  console.log('API URL:', config.api.baseUrl);
};

const handleLoadingClick = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
};
</script>

<template>
  <NavBar />
  <div class="p-8 space-y-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Button Component Examples</h1>

    <!-- Información de configuración -->
    <section class="bg-blue-50 p-6 rounded-lg">
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
    </section>

    <!-- Variantes -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Variantes</h2>
      <div class="flex flex-wrap gap-4">
        <Button  @click="handleClick">Primary</Button>
        <Button  @click="handleClick">Secondary</Button>
        <Button  @click="handleClick">Outline</Button>
        <Button  @click="handleClick">Ghost</Button>
        <Button  @click="handleClick">Destructive</Button>
      </div>
    </section>

    <!-- Tamaños -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Tamaños</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="small" @click="handleClick">Small</Button>
        <Button size="large" @click="handleClick">Large</Button>
      </div>
    </section>

    <!-- Estados -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Estados</h2>
      <div class="flex flex-wrap gap-4">
        <Button @click="handleClick">Normal</Button>
        <Button disabled>Disabled</Button>
        <Button :loading="isLoading" @click="handleLoadingClick">
          {{ isLoading ? 'Loading...' : 'Click to Load' }}
        </Button>
      </div>
    </section>

    <!-- Combinaciones -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Combinaciones</h2>
      <div class="flex flex-wrap gap-4">
        <Button size="large" @click="handleClick">
          Large Primary
        </Button>
        <Button size="small" @click="handleClick">
          Small Outline
        </Button>

      </div>
    </section>

    <!-- Con iconos -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Con Iconos</h2>
      <div class="flex flex-wrap gap-4">
        <Button  @click="handleClick">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Item
        </Button>

        <Button  @click="handleClick">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
            </path>
          </svg>
          Delete
        </Button>

        <Button  @click="handleClick">
          Download
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
        </Button>
      </div>
    </section>
  </div>
</template>
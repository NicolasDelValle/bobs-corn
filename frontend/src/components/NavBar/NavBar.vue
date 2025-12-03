<script setup lang="ts">
import choco from "@/assets/chcolotin.png"
import { APP_CONFIG } from "@/config/app"
import { APP_ROUTES } from '@/router/routes';
import { computed, ref } from 'vue';

import { LogIn } from "lucide-vue-next";
import Button from 'primevue/button'
import Menu from 'primevue/menu'


import { useAuth } from "@/composables/useAuth";
import { useRouter } from 'vue-router';
import type { MenuItem } from "primevue/menuitem";

const router = useRouter();

const menu = ref()

const { isAuthenticated, user, logout } = useAuth();

const isUserAuthenticated = computed(() => isAuthenticated.value);

const items: MenuItem[] = [
  {
    label: 'Configuración',
    command: () => {
    }
  },
  {
    label: 'Dashboard',
    command: () => {
      router.push(APP_ROUTES.DASHBOARD);
    }
  },
  {
    separator: true
  },
  {
    label: 'Cerrar Sesión',
    command: () => {
      logout();
    },
    danger: true
  }
];

const toggle = (event: Event) => {
  menu.value.toggle(event)
}

</script>

<template>
  <div class="bg-white px-2 shadow-lg w-full flex justify-center">
    <div class="container flex items-center justify-between py-2">

      <RouterLink to="/">
        <div v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }" :duration="600"
          class="flex flex-row items-center gap-0 sm:gap-4">
          <img :src="choco" alt="Chocolotin" class="h-12 w-12 object-contain sm:h-16 sm:w-16" v-motion
            :initial="{ scale: 0, rotate: -180 }" :enter="{ scale: 1, rotate: 0 }" :duration="400" :delay="200" />
          <div class="flex flex-col items-start">
            <span class="text-2xl sm:text-4xl font-bold text-green-800" v-motion :initial="{ opacity: 0, x: -40 }"
              :enter="{ opacity: 1, x: 0 }" :duration="300" :delay="300">
              {{ APP_CONFIG.app.name }}
            </span>
            <span class="text-sm sm:text-md font-bold text-green-800/80 border-t-2 border-yellow-400 pt-1" v-motion
              :initial="{ opacity: 0, x: -40 }" :enter="{ opacity: 1, x: 0 }" :duration="300" :delay="500">
              {{ APP_CONFIG.app.tagline }}
            </span>
          </div>
        </div>
      </RouterLink>

      <div v-if="!isUserAuthenticated" class="flex items-center gap-2" v-motion :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }" :duration="300">
        <RouterLink to="/login">
          <Button class="gap-2 flex flex-row justify-center" severity="success" size="small">
            <LogIn :size="16" />
            <span>
              Iniciar Sesión
            </span>
          </Button>
        </RouterLink>
      </div>

      <div v-if="isUserAuthenticated" class="flex items-center gap-2" v-motion :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }" :duration="300">
        <div class="user-menu">
          <Button size="large" class="menu-button" icon="pi pi-bars" text rounded @click="toggle" />

          <Menu ref="menu" id="user_menu" :model="items" :popup="true">
            <template #item="{ item, props }">
              <a v-bind="props.action" class="menu-item" :style="item.danger ? 'color:red' : ''">
                <span v-if="item.icon" :class="['menu-icon', item.icon]"></span>
                <span class="menu-label">{{ item.label }}</span>
              </a>
            </template>
          </Menu>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.menu-button {
  color: green;
}

.menu-item-danger {
  color: red;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import choco from "@/assets/chcolotin.png"
import { APP_CONFIG } from '@/config/app';
import ViewContainer from '@/components/Commons/ViewContainer.vue';
import Button from "primevue/button"
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useAuth } from '@/composables/useAuth';
import { APP_ROUTES } from '@/router/routes';

const router = useRouter();

const email = ref('');
const password = ref('');

const goBack = () => {
  console.log(router);

  router.push(APP_ROUTES.HOME);
};

const { login } = useAuth();

const onSubmit = async () => {
  try {
    await login({ email: email.value, password: password.value });
    router.push("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
  }
};

//TODO : Agregar manejo de errores y validaciones
</script>

<template>

  <Button icon="pi pi-arrow-left" class="m-4" rounded aria-label="Go back" @click="goBack" />

  <ViewContainer>
    <img :src="choco" alt="Chocolotin" class="h-24 w-24 object-contain" v-motion :initial="{ scale: 0 }"
      :enter="{ scale: 1 }" :duration="300" />
    <div class="flex flex-col items-center gap-2" v-motion :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }" :duration="300">
      <span class="text-2xl md:text-4xl font-bold text-green-800 border-b-2 border-yellow-400 pt-1">
        Bienvenido a {{ APP_CONFIG.app.name }}
      </span>
      <span class="text-green-800">
        Inicia sesión en tu cuenta
      </span>
    </div>
    <Card class="max-w-lg w-full" v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0 }"
      :duration="300" :delay="200">
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-bold text-sm text-gray-700">Usuario</label>
            <InputText id="email" v-model="email" placeholder="Ingresa tu email" class="w-full" required />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-bold text-sm text-gray-700">Contraseña</label>
            <Password id="password" v-model="password" placeholder="Ingresa tu contraseña" class="w-full"
              :feedback="false" toggleMask fluid required />
          </div>
          <Button type="submit" label="Iniciar Sesión" class="w-full mt-4" severity="success"
            :disabled="!email || !password" />

        </form>
      </template>
    </Card>
  </ViewContainer>
</template>

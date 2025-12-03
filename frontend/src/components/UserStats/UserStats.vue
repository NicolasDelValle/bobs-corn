<script setup lang="ts">
import { computed } from 'vue';
import { useSession } from '@/composables/useSession';
import { useWaitTimeContext } from '@/context/RateContext';

const { sessionId, sessionName } = useSession();
const { cornCount } = useWaitTimeContext();

// Función local para generar stats de usuario
const generateUserStats = (cornValue: number) => {
  const level = Math.floor(cornValue / 10) + 1;
  return {
    totalCorn: cornValue,
    level,
    nextLevelProgress: cornValue % 10,
    nextLevelTarget: 10,
  };
};

// Computed reactivo basado en cornCount.value
const stats = computed(() => generateUserStats(cornCount.value));
const totalCorn = computed(() => stats.value.totalCorn);
const level = computed(() => stats.value.level);
const nextLevelProgress = computed(() => stats.value.nextLevelProgress);
const nextLevelTarget = computed(() => stats.value.nextLevelTarget);
const progressPercentage = computed(() => (nextLevelProgress.value / nextLevelTarget.value) * 100);
</script>

<template>
  <div v-motion :initial="{ opacity: 0, y: 30, scale: 0.95 }" :enter="{ opacity: 1, y: 0, scale: 1 }" :duration="600"
    class="bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-green-200 rounded-xl p-5 shadow-lg  w-full hover:shadow-xl hover:border-green-300 transition-all duration-300">

    <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0 }" :delay="200"
      class="flex items-center justify-between mb-4">

      <div class="flex items-center gap-3 w-full overflow-hidden">
        <div>
          <div v-motion :initial="{ scale: 0, rotate: -180 }" :enter="{ scale: 1, rotate: 0 }" :delay="400"
            class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                viewBox="0 0 24 24">
                <path fill="#eeeeee"
                  d="M6.594 17.828a7.22 7.22 0 0 0 5.286 2.238a8.13 8.13 0 0 0 5.335-2.288a7.04 7.04 0 0 0 1.919-3.337a3.2 3.2 0 0 0 .05-1.708a.75.75 0 0 0-.41-.43a6 6 0 0 0-1 0c-1.398 0-4.415.23-7.123.34a25.8 25.8 0 0 0-5.436.45a.75.75 0 0 0-.3.569c-.02.55.064 1.1.25 1.618c.294.94.78 1.808 1.43 2.548m2.758-4.376c2.898-.06 6.605-.07 8.303-.07h.5a5.2 5.2 0 0 1-.64 2.078a5.4 5.4 0 0 1-1.089 1.529a7.08 7.08 0 0 1-4.576 2.088a6.33 6.33 0 0 1-4.676-1.808a5.5 5.5 0 0 1-1.16-1.849a5.3 5.3 0 0 1-.419-1.429v-.38a37 37 0 0 1 3.757-.159" />
                <path fill="#eeeeee"
                  d="M23.87 9.995a13.2 13.2 0 0 0-.69-2.998a10 10 0 0 0-3.377-4.496A10.73 10.73 0 0 0 14.637.433a.36.36 0 0 0-.39.3a.35.35 0 0 0 .3.38a9.9 9.9 0 0 1 4.787 2.048a9.1 9.1 0 0 1 2.997 4.176c.327.901.551 1.836.67 2.788c.085.954.085 1.913 0 2.867c-.092.941-.31 1.866-.65 2.748a12.2 12.2 0 0 1-1.289 2.528a9.63 9.63 0 0 1-4.506 3.497a12.56 12.56 0 0 1-5.735.85a12 12 0 0 1-3.158-.71a9.4 9.4 0 0 1-2.767-1.599a11.57 11.57 0 0 1-3.777-7.114c-.46-2.753.18-5.576 1.778-7.863A11.6 11.6 0 0 1 6.015 2.36a9.3 9.3 0 0 1 4.066-1.359c.71-.07 1.42-.13 2.119-.13q.702-.006 1.398.09a.3.3 0 1 0 .09-.59A11 11 0 0 0 12.21.194c-.73 0-1.46 0-2.189.09a10.2 10.2 0 0 0-4.386 1.439A12.6 12.6 0 0 0 2.218 4.82A11.48 11.48 0 0 0 .13 13.322a12.55 12.55 0 0 0 4.046 7.844a10.5 10.5 0 0 0 3.098 1.818c1.12.411 2.289.673 3.477.78a13.8 13.8 0 0 0 6.255-.96a10.57 10.57 0 0 0 4.945-3.997a13.2 13.2 0 0 0 1.37-2.757c.348-.966.566-1.974.649-2.998a16.4 16.4 0 0 0-.1-3.057" />
                <path fill="#eeeeee"
                  d="M9.012 8.606a1.78 1.78 0 0 0-.74-2.298a1.74 1.74 0 0 0-1.658.13c-.999.6-1.608 2.178-.46 2.997a2.07 2.07 0 0 0 2.858-.829m6.715.809a1.69 1.69 0 0 0 2.567-1.229a1.7 1.7 0 0 0-.849-1.818c-1.698-.73-3.377 1.129-2.338 2.528c.163.22.375.398.62.52" />
              </svg>
            </span>
          </div>
        </div>
        <div class="overflow-hidden flex-1 min-w-0">
          <h3 class="font-bold text-green-800 text-sm sm:text-lg truncate">{{ sessionName }}</h3>
          <p class="text-xs text-gray-500/60 font-mono truncate">{{ sessionId }}</p>
          <p class="text-sm text-green-600 font-medium">Nivel {{ level }}</p>
        </div>
      </div>

      <div v-motion :initial="{ opacity: 0, scale: 0 }" :enter="{ opacity: 1, scale: 1 }" :delay="600"
        class="text-right">
        <div class="text-2xl sm:text-4xl font-bold text-green-700">
          {{ totalCorn }}
        </div>
        <p class="text-sm text-green-600 font-medium">Choclos</p>
      </div>
    </div>

    <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" :delay="800"
      class="bg-white/80 border-2 border-gray-100 shadow-sm rounded-lg p-3">

      <div class="flex justify-between text-sm text-gray-700 mb-2">
        <span class="font-medium">Progreso al Nivel {{ level + 1 }}</span>
        <span class="font-bold">{{ nextLevelProgress }}/{{ nextLevelTarget }}</span>
      </div>

      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div v-motion :initial="{ width: '0%' }" :enter="{ width: `${progressPercentage}%` }" :delay="1000"
          :duration="1500" :transition="{
            type: 'spring',
            stiffness: 60,
            damping: 15,
            mass: 0.8
          }"
          class="bg-gradient-to-r from-green-400 via-green-500 to-yellow-400 h-3 rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${progressPercentage}%` }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSession } from '@/composables/useSession';

useSession();

</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50 flex flex-col">
    <RouterView />
  </div>
</template>

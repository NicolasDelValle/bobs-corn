<template>
  <div v-for="i in 8" :key="i" class="bg-gray-200 animate-pulse rounded-xl h-80">
    <div class="h-48 bg-gray-300 rounded-t-xl"></div>
    <div class="p-5 space-y-3">
      <div class="h-4 bg-gray-300 rounded w-3/4"></div>
      <div class="h-3 bg-gray-300 rounded w-1/2"></div>
      <div class="h-8 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
</template>

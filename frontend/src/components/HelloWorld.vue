<script setup lang="ts">
import { ref } from 'vue'
import Button from "primevue/button"

defineProps<{ msg: string }>()

const count = ref(0)
const isLoading = ref(false)

const incrementCount = () => {
  count.value++
}

const asyncAction = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    count.value += 5
  }, 1500)
}
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-blue-600 mb-8">{{ msg }}</h1>

    <div class="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
      <div class="mb-6">
        <p class="text-2xl font-bold text-gray-800 mb-4">Count: {{ count }}</p>
        
        <div class="flex flex-wrap justify-center gap-3">
          <Button 
            variant="primary" 
            @click="incrementCount"
          >
            +1 Count
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm"
            @click="count--"
          >
            -1
          </Button>
          
          <Button 
            variant="outline" 
            :loading="isLoading"
            @click="asyncAction"
          >
            {{ isLoading ? 'Loading...' : '+5 (Async)' }}
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            @click="count = 0"
          >
            Reset
          </Button>
        </div>
      </div>
      
      <p class="bg-red-500 text-white p-4 rounded-lg mt-4 font-semibold"> 
        🎉 ¡Button Component funcionando perfectamente!
        <br>
        <code class="bg-red-600 px-2 py-1 rounded text-sm">components/HelloWorld.vue</code>
      </p>
      
      <div class="grid grid-cols-2 gap-4 mt-6">
        <div class="bg-green-500 text-white p-3 rounded-lg">
          <span class="font-bold">Button Component</span>
        </div>
        <div class="bg-yellow-500 text-black p-3 rounded-lg">
          <span class="font-bold">Con Props</span>
        </div>
        <div class="bg-purple-500 text-white p-3 rounded-lg">
          <span class="font-bold">TypeScript</span>
        </div>
        <div class="bg-pink-500 text-white p-3 rounded-lg">
          <span class="font-bold">Tailwind</span>
        </div>
      </div>
    </div>

    <div class="mt-8 space-y-4">
      <p class="text-gray-600">
        Check out
        <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
           class="text-blue-500 hover:text-blue-700 underline">create-vue</a>, 
        the official Vue + Vite starter
      </p>
      <p class="text-gray-600">
        Learn more about IDE Support for Vue in the
        <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank"
           class="text-blue-500 hover:text-blue-700 underline">Vue Docs Scaling up Guide</a>.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Los estilos personalizados pueden ir aquí si es necesario */
</style>

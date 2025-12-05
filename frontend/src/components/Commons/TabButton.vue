<script setup lang="ts">


defineProps<{ label: string }>();


</script>

<template>
  <div class="flex flex-row items-center gap-2 bg-transparent">
    <slot></slot>
    <span>
      {{ label }}
    </span>
  </div>
</template>
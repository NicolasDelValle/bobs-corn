<script setup lang="ts">

defineProps<{
  modelValue: string | number | null;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autocomplete?: string;
  autofocus?: boolean;
  debounce?: number;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

</script>
<template lang="">
  <div>
    
  </div>
</template>

<template>
  <input class='input' type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style lang="scss">
.input {
  font-family: var(--font-family) !important;
  border-radius: 8px;
  padding-left: 16px !important;
  border: 1px solid var(--c-text);
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  &:focus {
    outline: none;
    border-color: var(--c-brand-secondary);
    box-shadow: 0 0 1px 1px var(--c-brand-secondary);
  }
}
</style>
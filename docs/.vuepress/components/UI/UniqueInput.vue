<template>
  <input class='input' type="text"
  :value="modelValue"
  @input="$emit('update:modelValue', $event.target.value)"
  />
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
  border-radius: 30px;
  padding-left: 20px !important;
  font-weight: 600;
  border: 1px solid var(--c-text);
}
</style>
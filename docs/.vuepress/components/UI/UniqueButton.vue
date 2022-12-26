<template>
  <button class='button' :style="cssVars">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { Colors } from '../types/UniqueButtonColors'

const props = defineProps({
  color: { 
    type: String as PropType<keyof typeof Colors>, 
    required: false, 
  },
})

const cssVars = computed(() => {
  switch (props.color) {
    case 'Blue':
      return {
        '--bg-color': "#15ADFF",
        '--tx-color': "#FFFFFF"
      }
    case 'White':
    default:
      return {
        '--bg-color': "--c-bg",
        '--tx-color': "#15ADFF"
      }
  }
})
</script>

<style scoped lang="scss">
.button {
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 600;
  background-color: var(--bg-color);
  color: var(--tx-color);
  border: 1px solid var(--c-brand-secondary);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    size: 1.1ch
  }
}
</style>
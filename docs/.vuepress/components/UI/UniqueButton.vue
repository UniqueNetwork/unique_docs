<template>
  <button class='button' :style="cssVars">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['color'])

const cssVars = computed(() => {
  switch (props.color) {
    case 'blue':
      return {
        '--bg-color': "#15ADFF",
        '--tx-color': "#FFFFFF"
      }
    case 'white':
      return {
        '--bg-color': "--c-bg",
        '--tx-color': "#15ADFF"
      }
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
  border: 1px solid #15ADFF;
  // box-shadow: 0 0 10px rgba(var(--c-text-hover), 0.25);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    size: 1.1ch
  }
}
</style>
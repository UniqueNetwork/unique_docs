<template>
  <button class='button' :class="props.color">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { Prop } from 'vue'

const props = defineProps<{
  color?: Prop<ButtonColors>
}>()
</script>

<style scoped lang="scss">
.button {
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 600;
  border: 1px solid var(--c-brand-secondary);
  color: var(--c-brand-secondary);
  background-color: var(--c-bg);

  &.blue {
    color: var(--c-bg);
    background-color: var(--c-brand-secondary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    size: 1.1ch
  }
}
</style>

<script lang="ts">
export enum ButtonColors {
  white = 'white',
  blue = 'blue',
}
</script>

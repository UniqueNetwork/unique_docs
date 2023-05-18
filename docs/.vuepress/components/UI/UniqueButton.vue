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
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 500;
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
    color: var(--c-text-disabled-button);
    background-color: var(--c-bg-disabled-button);
    border-color: var(--c-text-disabled-button);
  }

  &:hover:not(:disabled) {
    size: 1.1ch;
    background-color: var(--c-bg-hover-button);
  }
}
</style>

<script lang="ts">
export enum ButtonColors {
  white = 'white',
  blue = 'blue',
}
</script>

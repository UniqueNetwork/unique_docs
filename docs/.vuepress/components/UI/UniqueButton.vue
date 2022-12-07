<template>
  <button class='button'>
    <slot></slot>
  </button>
</template>

<script lang="ts">
</script>

<style scoped lang="scss">
.button {
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 30px;
  padding: 12px 20px;
  font-weight: 600;
  border: 1px black;
  box-shadow: 0 0 10px rgba(var(--c-text-hover), 0.25);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
  
  &:hover:not(:disabled) {
    color: var(--c-text-hover)
  }
}
</style>
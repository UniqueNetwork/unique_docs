<template>
  <button class='unq-btn'>
    <slot></slot>
  </button>
</template>

<script lang="ts">
</script>

<style scoped lang="scss">
.unq-btn {
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 30px;
  padding: 12px;
  font-weight: 600;
  border: 1px black;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
  &:hover {
    color: #6699cc;
    &:disabled {
      color: #999;
    }
  }
}
</style>
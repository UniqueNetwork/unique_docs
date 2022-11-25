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
  border-radius: 30px;
  padding: 12px;
  font-weight: 600;
  border: 1px black;
  &:hover {
    color: #6699cc;
  }
}
</style>
<template>
  <input class='unq-inp' type="text"
  v-model="inputRef"
  @input = "$emit('update:modelValue', $event.target.value)"
  />
</template>

<script lang="ts">
</script>

<style lang="scss">
.unq-inp {
  font-family: var(--font-family) !important;
  border-radius: 30px;
  padding-left: 20px !important;
  font-weight: 600;
}
</style>
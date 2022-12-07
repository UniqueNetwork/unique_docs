<template>
  <code>
    <slot>
    </slot>
  </code>
  <h3>This is the text@</h3>
  <UniqueButton>Copy</UniqueButton>
</template>

<script>
import UniqueButton from '../UI/UniqueButton'
export default {
  name: "CodeBlock.vue",
  components: {UniqueButton}
}
</script>

<style scoped>

</style>

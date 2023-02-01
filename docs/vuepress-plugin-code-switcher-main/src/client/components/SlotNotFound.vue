<template>
  <div>Did not find a slot with name {{ shorthand }}.</div>
</template>

<script setup lang="ts">
const {shorthand} = defineProps<{ shorthand: string }>()
</script>

<script lang="ts">
export default {
  name: 'SlotNotFound',
}
</script>

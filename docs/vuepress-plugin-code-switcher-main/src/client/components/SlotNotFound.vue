<script setup lang="ts">
import { h } from 'vue'

const props = defineProps({
  shorthand: {
    type: String,
  }
});
const render = () => h(
  'div',
  null,
  `Did not find a slot with name ${props.shorthand}.`
);
</script>
<template>
  <render />
</template>

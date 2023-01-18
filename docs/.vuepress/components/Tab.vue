<script setup lang="ts">
import {useTab} from "./composables/tabs";

const props = defineProps<{
  title: string,
}>()

const { isActive } = useTab(props.title)
</script>

<template>
  <div
    v-if="isActive"
    class="Tab"
  >
    <slot />
  </div>
</template>


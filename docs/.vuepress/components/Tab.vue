<script setup lang="ts">
import {reactive, toRef} from "vue";
import {useTab} from "./composables/tabs";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const title = toRef(props, 'title')

const { isActive } = useTab(reactive({ title }))
</script>

<template>
  <div
    v-if="isActive"
    class="Tab"
  >
    <slot />
  </div>
</template>


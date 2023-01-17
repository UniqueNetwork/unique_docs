<script setup>
import {reactive, toRef} from "vue";
import {useTab} from "./composables/tabs";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const name = toRef(props, 'name')

const { isActive } = useTab(reactive({ name }))
</script>

<template>
  <div
    v-if="isActive"
    class="Tab"
  >
    <slot />
  </div>
</template>


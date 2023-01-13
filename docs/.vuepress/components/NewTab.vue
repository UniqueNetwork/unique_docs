<script lang="ts">
import { defineComponent, toRef, reactive } from 'vue'
import { useTab } from './composables/tabs'

export default defineComponent({
  name: 'Tab',

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const name = toRef(props, 'name')

    const { isActive } = useTab(reactive({ name }))

    return {
      isActive,
    }
  },
})
</script>

<template>
  <div
    v-if="isActive"
    class="Tab"
  >
    <slot />
  </div>
</template>


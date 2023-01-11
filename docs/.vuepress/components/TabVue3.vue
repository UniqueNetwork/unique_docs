<script lang="ts">
import {defineComponent, toRef, reactive, getCurrentInstance} from 'vue'
import { useTab } from './composables/tabs'

export default defineComponent({
  name: 'Tab',

  data: () => ({
    navigationProps: getCurrentInstance()?.appContext.config.globalProperties.$navigationProps,
  }),

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const name = toRef(props, 'name')

    const { isActive } = useTab(reactive({ name }));

    return {
      isActive,
    }
  }
})
</script>

<template>
  <div
    v-if="name === navigationProps[navigationProps.dictionary[name]]"
    class="Tab"
  >
    <slot />
  </div>
</template>


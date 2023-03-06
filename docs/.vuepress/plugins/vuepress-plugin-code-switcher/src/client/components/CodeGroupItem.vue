<template>
  <div>
    <div v-if="activeTabId?.toLowerCase() === title?.toLowerCase()">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, onBeforeUnmount, inject} from 'vue'

const props = withDefaults(defineProps<{
  title: string,
}>(), {
  title: ''
})

const addTab = inject<(tabId: string) => void>('addTab')
const deleteTab = inject<(tabId: string) => void>('deleteTab')
const activeTabId = inject<string>('activeTabId')

onBeforeMount(() => {
  if (addTab) {
    addTab(props.title?.toLowerCase())
  }
})

onBeforeUnmount(() => {
  if (deleteTab) {
    deleteTab(props.title?.toLowerCase())
  }
})

</script>

<template>
  <button @click="onClick">{{ title }}</button>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'

const props = defineProps<{
  title: string
  onClick: () => {}
}>()


let color = 'currentColor'
let size = 16

onMounted(() => {
  color = getComputedStyle(document.body).getPropertyValue('--c-text')
})


</script>

<style lang="scss" scoped>

</style>

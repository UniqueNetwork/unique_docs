<template>
  <a :href="href" :target="newWindow ? '_blank': ''">{{text ?? href}}</a>
</template>

<script lang="ts" setup>
const props = defineProps<{
  href: string
  text?: string
  newWindow?: boolean
}>()
</script>

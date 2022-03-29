<template>
  <div class="button-copy" @click="copyToBuffer(props.data)">
    <span v-if="!!props.text">{{ props.text }}</span>
    <div class="external-link-icon">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24"
           :height="size"
           viewBox="0 0 24 24"
      >
        <path
          d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
          :fill="color"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import {copyToBuffer} from "_utils";

const props = defineProps<{
  text?: string
  data: string
}>()


let color = 'currentColor'
let size = 16

onMounted(() => {
  color = getComputedStyle(document.body).getPropertyValue('--c-text')
})



</script>

<style lang="scss" scoped>
.button-copy {
  display: inline-block;
  padding: .25rem .125rem .125rem .125rem;

  cursor: pointer;

  .external-link-icon {
    padding-top: .25rem;
  }
}
</style>
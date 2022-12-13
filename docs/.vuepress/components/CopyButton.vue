<template>
  <div v-show="!!data || showAlways" class="button-copy" @click="copy">
    <span v-if="!!props.text">{{ props.text }}</span>
    <div class="external-link-icon">
      <svg width="24"
         :height="size" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M4.50012 0.75C4.50012 0.335786 4.83591 0 5.25012 0H17.2501C17.6643 0 18.0001 0.335786 18.0001 0.75V12.75C18.0001 13.1642 17.6643 13.5 17.2501 13.5H12.7501C12.3359 13.5 12.0001 13.1642 12.0001 12.75C12.0001 12.3358 12.3359 12 12.7501 12H16.5001V1.5H6.00012V5.25C6.00012 5.66421 5.66434 6 5.25012 6C4.83591 6 4.50012 5.66421 4.50012 5.25V0.75Z"
          fill="#15ADFF" />
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M0 5.2501C0 4.83589 0.335786 4.5001 0.75 4.5001H12.75C13.1642 4.5001 13.5 4.83589 13.5 5.2501V17.2501C13.5 17.6643 13.1642 18.0001 12.75 18.0001H0.75C0.335786 18.0001 0 17.6643 0 17.2501V5.2501ZM1.5 6.0001V16.5001H12V6.0001H1.5Z"
          fill="#15ADFF" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification'

import { onBeforeUnmount, onMounted } from 'vue'
import { copyToBuffer } from "_utils";

const props = defineProps<{
  text?: string
  data: string | number
  showAlways?: boolean
}>()


let color = 'currentColor'
let size = 16

const toast = useToast()

onMounted(() => {
  color = getComputedStyle(document.body).getPropertyValue('--c-text')
})

onBeforeUnmount(() => {
  toast.clear()
})


const copy = async () => {
  toast(`Copied "${props.data}"`, { timeout: 2000 })

  await copyToBuffer(props.data)
}

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

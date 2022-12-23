<template>
  <details class="unique-details" >
    <summary class="unique-summary" :style="size">
      <slot name="header"/>
    </summary>
    <div class="unique-details-body">
      <slot name="body" />
    </div>
  </details>
</template>

<script setup lang="ts">
import {computed} from 'vue'

const defaultSize = '20px'
const props = defineProps(['fontSize'])

const size = computed(() => {
  if (props.fontSize)
    return {'--fz': props.fontSize + 'px'}
  else 
    return {'--fz': defaultSize}
})
</script>

<style lang="scss">
.unique-details {
  border: thin;
  border-radius: 8px !important;
  cursor: pointer;
  padding: 10px 15px;
  .unique-summary {
    font-size: var(--fz);
    padding: 10px 0 10px 15px;
    background: rgba(0, 0, 0, 0.05);
    font-weight: 400;
    margin-bottom: 5px;
    height: 35px !important;
    color:  var(--c-text);
    box-shadow: 0 0 10px var(--c-custom-border);
    border-radius: 8px !important;
  }
  .unique-details-body {
    margin-top: 0;
  }
}
</style>
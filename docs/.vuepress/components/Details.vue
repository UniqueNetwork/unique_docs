<template>
  <details class="unique-details" :style="cssVars">
    <summary class="unique-summary">
      <slot name="header"/>
    </summary>
    <div class="unique-details-body">
      <slot name="body" />
    </div>
  </details>
</template>

<script setup lang="ts">
import {computed, PropType} from 'vue'
import {DetailsSizes, smallDetails, defaultDetails} from './types/DetailsSizes'

const props = defineProps({
  size: { 
    type: String as PropType<keyof typeof DetailsSizes>, 
    required: false, 
  },
})

const cssVars = computed(() => {
  switch (props.size) {
    case 'Small': 
      return {
        '--fz': smallDetails.size,
        '--p': smallDetails.padding,
        '--h': smallDetails.height,
        '--w': smallDetails.width,
      }
    case 'Default': 
    default: 
      return {
        '--fz': defaultDetails.size,
        '--h': defaultDetails.height,
        '--p': defaultDetails.padding,
        '--w': defaultDetails.width,
      }
  }
})
</script>

<style lang="scss">
.unique-details {
  border: thin;
  border-radius: 8px !important;
  cursor: pointer;
  padding: 10px 15px;
  width: var(--w);
  min-width: 320px;
  .unique-summary {
    font-size: var(--fz);
    padding: var(--p);
    background: rgba(0, 0, 0, 0.05);
    font-weight: 400;
    margin-bottom: 5px;
    height: var(--h) !important;
    color:  var(--c-text);
    box-shadow: 0 0 6px var(--c-custom-text-hover-opacity);
    border-radius: 8px !important;
  }
  .unique-details-body {
    margin-top: 0;
  }
}
</style>
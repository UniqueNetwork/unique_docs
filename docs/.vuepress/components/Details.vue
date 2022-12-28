<template>
  <details class="unique-details" :class="props.size">
    <summary class="unique-summary">
      <slot name="header" />
    </summary>
    <div class="unique-details-body">
      <slot name="body" />
    </div>
  </details>
</template>

<script setup lang="ts">
import { Prop } from 'vue'

const props = defineProps<{
  size?: Prop<DetailsSizes>
}>()
</script>

<style lang="scss">
.unique-details {
  border: thin;
  border-radius: 8px !important;
  cursor: pointer;
  padding: 0;
  margin-bottom: 10px;
  width: 100%;
  min-width: 320px;

  .unique-summary {
    background: var(--c-bg-dark);
    font-weight: 400;
    margin-bottom: 5px;
    font-size: 16px;
    height: 20px !important;
    padding: 8px 12px;
    color: var(--c-text);
    border-radius: 8px !important;
  }

  .unique-details-body {
    background: var(--c-bg);
  }

  &.large {

    .unique-summary {
      font-size: 24px;
      height: 28px !important;
      padding: 12px 0 12px 16px;
    }
  }

  .unique-details-body {
    margin-top: 0;
  }
}
</style>

<script lang="ts">
export enum DetailsSizes {
  large = 'large',
  regular = 'regular', //dummy, uses default value
}
</script>

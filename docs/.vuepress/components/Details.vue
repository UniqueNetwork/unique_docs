<template>
  <details class="unique-details" >
    <summary class="unique-summary">
      <slot name="header"/>
    </summary>
    <div class="unique-details-body">
      <slot name="body" />
    </div>
  </details>
</template>

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

<style lang="scss">
.unique-details {
  border: thin;
  border-radius: 20px !important;
  cursor: pointer;
  padding-top: 10px;
  .unique-summary {
    padding-left: 70px;
    padding-bottom: 70px;
    margin-bottom: -20px;
    height: 45px !important;
    color:  #6699cc;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    border-radius: 20px !important;
  }
  .unique-details-body {
    margin-top: 0;
  }
}
</style>
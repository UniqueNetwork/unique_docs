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
  padding: 10px 15px 10px;
  .unique-summary {
    padding: 10px 0 10px 30px;
    background: rgba(0, 0, 0, 0.05);;
    margin-bottom: 5px;
    height: 35px !important;
    color:  #6699cc;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    border-radius: 20px !important;
  }
  .unique-details-body {
    margin-top: 0;
  }
}
</style>
<template>
  <button @click="testMetamask">Test Metamask</button>

  <p v-show="error.message" class="error">{{ error.message }}</p>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {testMetamask} from '../utils/addressUtils'

import {useInit} from 'unique_api_vue'

useInit()

const error = reactive({
  message: ''
})

</script>

<style lang="scss" scoped>
.inputContainer {
  display: flex;

  .input {
    width: 500px;
    font-family: "Courier New", monospace;
    font-size: 1rem;
    padding: 0.25rem;
    margin-right: .5rem;
  }
}

.error {
  color: red;
}

</style>

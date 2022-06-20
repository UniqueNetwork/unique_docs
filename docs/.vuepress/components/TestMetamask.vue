<template>
  <button @click="testMetamask">Test Metamask</button>

  <p v-show="error.message" class="error">{{ error.message }}</p>

  <p>
    <button @click="requestEthereumAccounts">Request eth accounts</button>
  </p>

</template>

<script setup lang="ts">
import {onMounted, reactive} from 'vue'
import {testMetamask} from '../utils/testMM'

import {useInit} from 'unique_api_vue'
import {libs} from "@unique-nft/api";

const {initTask, requestEthereumAccounts, ethAccountsRef} = useInit()

const error = reactive({
  message: ''
})

onMounted(async () => {
  setTimeout(() => {
    console.log(initTask)
    console.log(libs.getEthers())
  }, 1400)
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

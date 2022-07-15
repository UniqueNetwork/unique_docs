<template>
  <button @click="testMetamask">Test Metamask</button>

  <p v-show="error.message" class="error">{{ error.message }}</p>

  <p>
    <button @click="checkEthAccs" :disabled="!initTask.isResolved">Request eth accounts</button>
  </p>

</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {testMetamask} from '../utils/metamask'

import {useInit} from 'unique_api_vue'
// import {libs} from "@unique-nft/api";

const {requestEthereumAccounts, ethAccountsRef, initTask} = useInit()

const checkEthAccs = async () => {
  console.log(1, ethAccountsRef.value)
  const result = await requestEthereumAccounts()
  console.log(2, result, ethAccountsRef.value)
}

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

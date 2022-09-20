<template>
  <button @click="testMetamask">Test Metamask</button>

  <p v-show="error.message" class="error">{{ error.message }}</p>

  <p>
    <button @click="checkEthAccs">Request eth accounts</button>
  </p>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {testMetamask} from '../utils/metamask'
import {connectToMetamask, safeGetAccounts} from "../utils/ethereumExtensionTools";

const ethAccountsRef = ref<string[]>([])

onMounted(async () => {
  const result = await safeGetAccounts()
  if (result.extensionFound) {
    ethAccountsRef.value = result.accounts
  }
})

const checkEthAccs = async () => {
  console.log(1, ethAccountsRef.value)
  try {
    ethAccountsRef.value = await connectToMetamask()
  } catch(e) {
    console.error(e)
  }
  console.log(2, ethAccountsRef.value)
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

<template>
  <div class="inputContainer">
    <input v-model="collectionIdInputRef" class="input"/>
    <button @click="convertCollectionIdToAddress">Convert Collection Id to Address</button>
  </div>

  <div class="inputContainer">
    <input v-model="addressInputRef" class="input"/>
    <button @click="convertAddressToCollectionId">Convert Address to Collection Id</button>
  </div>

  <p v-show="errorMessageRef" class="error">{{ errorMessageRef }}</p>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {UniqueUtils} from '@unique-nft/api'

const collectionIdInputRef = ref('')
const addressInputRef = ref('')
const errorMessageRef = ref('')

const wrapWithErrorHandler = <P extends Array<unknown>, R>(fn: (...params: P) => Promise<R>) => {
  return async(...params: P) => {
    try {
      errorMessageRef.value = ''
      return await fn(...params)
    } catch (e: any) {
      errorMessageRef.value = e.message
      throw e
    }
  }
}

const convertCollectionIdToAddress = wrapWithErrorHandler(async () => {
  addressInputRef.value = await UniqueUtils.Address.collectionIdToEthAddress(collectionIdInputRef.value)
})
const convertAddressToCollectionId = wrapWithErrorHandler(async () => {
  collectionIdInputRef.value = UniqueUtils.Address.ethAddressToCollectionId(addressInputRef.value).toString()
})

</script>

<style lang="scss" scoped>
.inputContainer {
  display: flex;
  margin-bottom: 1rem;

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

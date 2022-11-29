<template>
  <div class="inputContainer">
    <UniqueInput v-model="collectionIdInputRef" class="input"/>
    <UniqueButton @click="convertCollectionIdToAddress">
      Collection Id to Address
    </UniqueButton>
  </div>

  <div class="inputContainer">
    <unique-input v-model="addressInputRef" class="input"/>
    <unique-button @click="convertAddressToCollectionId">
      Address to Collection Id
    </unique-button>
  </div>

  <p v-show="errorMessageRef" class="error">{{ errorMessageRef }}</p>
</template>

<script setup lang="ts">
import UniqueButton from '../components/UI/UniqueButton.vue'
import UniqueInput from '../components/UI/UniqueInput.vue'
import {ref} from 'vue'

const collectionIdInputRef = ref('')
const addressInputRef = ref('')
const errorMessageRef = ref('')

import {Address} from '@unique-nft/utils/address'

const wrapWithErrorHandler = <P extends Array<unknown>, R>(fn: (...params: P) => R) => {
  return (...params: P) => {
    try {
      errorMessageRef.value = ''
      return fn(...params)
    } catch (e: any) {
      console.log('IN CATCH')
      errorMessageRef.value = e.message
      throw e
    }
  }
}

const convertCollectionIdToAddress = wrapWithErrorHandler(() => {
  addressInputRef.value = Address.collection.idToAddress(parseInt(collectionIdInputRef.value)) || ''
})
const convertAddressToCollectionId = wrapWithErrorHandler(() => {
  collectionIdInputRef.value = Address.collection.addressToId(addressInputRef.value)?.toString() || ''
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

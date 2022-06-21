<template>
  <div class="inputContainer">
    <input v-model="inputRef" class="input"/>
    <button @click="convertInputSubToEth">click</button>
  </div>

  <p v-show="error.message" class="error">{{ error.message }}</p>

  <!--  <CopyButton :data="converted.toSubNormalized"/> -->


  <template v-if="converted.sourceEth">
    <p>
    Source ethereum address:
    <CopyButton :data="converted.sourceEth"/>
    {{ converted.sourceEth }}
    </p>
    <h4>All addresses below are just substrate mirrors of this ethereum address!</h4>
  </template>

  <p>
    Normalized (prefix 42) address:
    <CopyButton :data="converted.toSubNormalized"/>
    {{ converted.toSubNormalized }}
  </p>
  <p>
    Quartz format (prefix 255):
    <CopyButton :data="converted.toQuartz"/>
    {{ converted.toQuartz }}
  </p>
  <p>
    Unique format (prefix 7391):
    <CopyButton :data="converted.toUnique"/>
    {{ converted.toUnique }}
  </p>
  <p>
    Eth mirror:
    <CopyButton :data="converted.toEth"/>
    {{ converted.toEth }}
  </p>

  <p><i>Additional formats:</i></p>
  <p>
    Polkadot:
    <CopyButton :data="converted.toPolkadot"/>
    {{ converted.toPolkadot }}
  </p>
  <p>
    Kusama:
    <CopyButton :data="converted.toKusama"/>
    {{ converted.toKusama }}
  </p>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {utils} from '@unique-nft/api'
import CopyButton from './CopyButton.vue'

import {useInit} from 'unique_api_vue'

const {chainRef, initTask, ethAccountsRef, requestEthereumAccounts} = useInit()

const inputRef = ref('')
const converted = reactive({
  sourceEth: '',
  address: '',
  toSub: '',
  toQuartz: '',
  toUnique: '',
  toKusama: '',
  toPolkadot: '',
  toEth: '',
  toSubNormalized: '',
})

const error = reactive({
  message: ''
})

const convertInputSubToEth = async () => {
  let rawAddress = inputRef.value
  console.log('rawAddress', rawAddress)

  converted.sourceEth = ''
  if (utils.address.is.substrateAddress(rawAddress)) {
  } else if (utils.address.is.ethereumAddress(rawAddress)) {
    converted.sourceEth = rawAddress
    rawAddress = utils.address.ethToSubMirror(rawAddress)
  } else {
    error.message = `Address "${rawAddress}" is not valid`
    return
  }



  ;[
    converted.toEth,
    converted.toQuartz,
    converted.toUnique,
    converted.toPolkadot,
    converted.toKusama,
    converted.toSubNormalized,
  ] = await Promise.all([
    await utils.address.subToEthMirror(rawAddress),
    await utils.address.normalizeSubstrateAddress(rawAddress, 255),
    await utils.address.normalizeSubstrateAddress(rawAddress, 7391),
    await utils.address.normalizeSubstrateAddress(rawAddress, 0),
    await utils.address.normalizeSubstrateAddress(rawAddress, 2),
    await utils.address.normalizeSubstrateAddress(rawAddress),
  ])
}

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

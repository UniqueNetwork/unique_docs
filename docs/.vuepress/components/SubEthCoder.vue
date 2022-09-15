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
    <h4>All addresses below are just the substrate mirror of this ethereum address!</h4>
  </template>

  <p>
    Normalized format (prefix 42):
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

    <template v-if="converted.sourceEth">
      <br/>
      <i>Please, pay attention that this address is a <b>double</b> mirror, not the origin Ethereum address!</i>
    </template>
  </p>
  <p>
    Substrate address public key:
    <CopyButton :data="converted.toSubstratePublicKey"/>
    {{ converted.toSubstratePublicKey }}
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
import CopyButton from './CopyButton.vue'

import {Address} from '@unique-nft/utils/address'

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
  toSubstratePublicKey: '',
})

const error = reactive({
  message: ''
})

const convertInputSubToEth = async () => {
  let rawAddress = inputRef.value
  console.log('rawAddress', rawAddress)

  error.message = ''

  converted.sourceEth = ''
  if (Address.is.substrateAddress(rawAddress)) {
  } else if (Address.is.ethereumAddress(rawAddress)) {
    converted.sourceEth = rawAddress
    rawAddress = Address.mirror.ethereumToSubstrate(rawAddress)
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
    converted.toSubstratePublicKey,
  ] = [
    Address.mirror.substrateToEthereum(rawAddress),
    Address.normalize.substrateAddress(rawAddress, 255),
    Address.normalize.substrateAddress(rawAddress, 7391),
    Address.normalize.substrateAddress(rawAddress, 0),
    Address.normalize.substrateAddress(rawAddress, 2),
    Address.normalize.substrateAddress(rawAddress),
    Address.substrate.decode(rawAddress).hex
  ]
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

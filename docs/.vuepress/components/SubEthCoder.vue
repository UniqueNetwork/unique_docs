<template>
  <button @click="testMetamask">Test Metamask</button>
  <div class="inputContainer">
    <input v-model="inputRef" class="input"/>
    <button @click="convertInputSubToEth">click</button>
  </div>

  <p>Normalized (prefix 42) address: {{ converted.toSubNormalized }}</p>
  <p>Eth mirror: {{ converted.toQuartz }}</p>
  <p>Eth mirror: {{ converted.toEth }}</p>
  <p>Double mirror (sub mirror of eth mirror): {{ converted.toSubDoubleMirror }}</p>

  <p v-show="converted.error" class="error">{{converted.error}}</p>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {
  normalizeSubAddress,
  subToEth,
  subToSubMirrorOfEth,
  testMetamask,
  validateSubAddress
} from '../utils/addressUtils'

// const address = '5GbjEGWbTFV7f2XN6z7TBUyW4YidWTHmaw1ekNFCtWGuEmTT'

const inputRef = ref('')
const converted = reactive({
  toSub: '',
  toQuartz: '',
  toEth: '',
  toSubNormalized: '',
  toSubDoubleMirror: '',
  error: '',
})

const convertInputSubToEth = async () => {
  console.log('converting')
  const rawAddress = inputRef.value

  console.log('rawAddress', rawAddress)
  // console.log('rawAddress', await normalizeSubAddress('yGJ53wmtsVqF8988Zwb6fVQZjtMsAfwVmXM5934C7d2kjB3Jd'))
  // console.log('rawAddress', await normalizeSubAddress('yGJ53wmtsVqF8988Zwb6fVQZjtMsAfwVmXM5934C7d2kjB3Jd', 255))

  try {
    await validateSubAddress(rawAddress)
    converted.error = ''
  } catch (_err) {
    converted.error = `Substrate address "${rawAddress}" is not valid`
    return
  }

  ;[
    converted.toEth,
    converted.toQuartz,
    converted.toSubNormalized,
    converted.toSubDoubleMirror
  ] = await Promise.all([
    await subToEth(rawAddress),
    await normalizeSubAddress(rawAddress),
    await normalizeSubAddress(rawAddress),
    await subToSubMirrorOfEth(rawAddress)
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

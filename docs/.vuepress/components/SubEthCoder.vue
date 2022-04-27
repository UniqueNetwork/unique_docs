<template>
  <div class="inputContainer">
    <input v-model="inputRef" class="input"/>
    <button @click="convertInputSubToEth">click</button>
  </div>

  <p v-show="error.message" class="error">{{error.message}}</p>

  <!--  <CopyButton :data="converted.toSubNormalized"/> -->
  <p>Normalized (prefix 42) address: {{ converted.toSubNormalized }} </p>
  <p>Quartz format (prefix 255): {{ converted.toQuartz }}</p>
  <p>Unique format (prefix 7391): {{ converted.toUnique }}</p>
  <p>Eth mirror: {{ converted.toEth }}</p>
  <p>Double mirror (sub mirror of eth mirror): {{ converted.toSubDoubleMirror }}</p>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {
  normalizeSubAddress,
  subToEth,
  subToSubMirrorOfEth,
  validateSubAddress
} from '../utils/addressUtils'

const inputRef = ref('')
const converted = reactive({
  toSub: '',
  toQuartz: '',
  toUnique: '',
  toEth: '',
  toSubNormalized: '',
  toSubDoubleMirror: '',
})

const error = reactive({
  message: ''
})

const convertInputSubToEth = async () => {
  const rawAddress = inputRef.value
  console.log('rawAddress', rawAddress)

  try {
    await validateSubAddress(rawAddress)
    error.message = ''
  } catch (_err) {
    error.message = `Substrate address "${rawAddress}" is not valid`
    return
  }

  ;[
    converted.toEth,
    converted.toQuartz,
    converted.toUnique,
    converted.toSubNormalized,
    converted.toSubDoubleMirror
  ] = await Promise.all([
    await subToEth(rawAddress),
    await normalizeSubAddress(rawAddress, 255),
    await normalizeSubAddress(rawAddress, 7391),
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

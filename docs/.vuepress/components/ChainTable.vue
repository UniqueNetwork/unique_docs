<template>
  <table>
    <thead>
    <tr>
      <th>Parameter</th>
      <th>Value</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>Websocket RPC</td>
      <td>{{ chain.websocketUrls[0] }}
        <CopyButton :data="chain.websocketUrls[0]"/>
      </td>
    </tr>
    <tr>
      <td>SS58Prefix</td>
      <td>{{ chain.ss58Prefix }}
        <CopyButton :data="chain.ss58Prefix"/>
      </td>
    </tr>
    <tr>
      <td>Currency</td>
      <td>{{ chain.metamask.nativeCurrency.symbol }} ({{ chain.metamask.nativeCurrency.decimals }} decimals)</td>
    </tr>
    </tbody>
    <tr>
      <td>Ethereum RPC</td>
      <td>{{ chain.metamask.rpcUrls[0] }}
        <CopyButton :data="chain.metamask.rpcUrls[0]"/>
      </td>
    </tr>
    <tr>
      <td>Chain Id</td>
      <td>
        {{ chain.metamask.chainId }}
        <CopyButton :data="chain.metamask.chainId"/>
        <Button title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.unique)"/>
      </td>
    </tr>
    <tr>
      <td>Identica</td>
      <td>
        <div>
          Color: <div class="colorSquare" :style="{backgroundColor: chain.color}"></div>
          <CopyButton :data="chain.color" :text="chain.color"/>
        </div>

        <div class="logoLine">
          Logo:
          <a :href="getIpfsLinkByCid(chain.logoIpfsCid)" target="_blank" class="logo">
            <img :src="logoLink" height="24">
          </a>
          <CopyButton :data="logoLink"/>
          <CopyButton :data="chain.logoIpfsCid" text="IPFS"/>
        </div>
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import {defineProps, computed} from 'vue'
import {UNIQUE_CHAINS, uniqueChainsParameters, getIpfsLinkByCid} from '../utils/constants'
import {addChainToMetamask} from '../utils/metamask'
import CopyButton from './CopyButton.vue'

const props = defineProps<{
  chainName: UNIQUE_CHAINS
}>()

const chain = computed(() => uniqueChainsParameters[props.chainName])
const logoLink = computed(() => getIpfsLinkByCid(chain.value.logoIpfsCid))
</script>

<script lang="ts">
export default {
  name: "ChainTable"
}
</script>

<style scoped lang="scss">
.colorSquare {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
  margin: 0 .375rem;
}

.logoLine {
  margin-top: .25rem;

  .logo {
    vertical-align: middle;
  }
}


</style>

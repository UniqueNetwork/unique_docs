<template>
  <table>
    <thead>
    <tr>
      <th>Parameter</th>
      <th colspan="2">Value</th>
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
        ({{ parseInt(chain.metamask.chainId) }})
        <CopyButton :data="chain.metamask.chainId"/>
        <Button
          title="Add to metamask"
          :disabled="disableMetamask"
          :onClick="() => addChainToMetamask(chainName)"
        />
      </td>
    </tr>
    <tr>
      <td>Identica</td>
      <td class="identica">
        <div>
          <span class="title">Color:</span>
          <div class="colorSquare" :style="{backgroundColor: chain.color}"></div>
          <CopyButton :data="chain.color" :text="chain.color"/>
        </div>

        <div class="logoLine">
          <span class="title">Logo:</span>

          <template v-if="chain.logoIpfsCid">
            <a :href="getIpfsLinkByCid(chain.logoIpfsCid)" target="_blank" class="logo">
              <img :src="logoLink" height="24">
            </a>
            <Link :href="getIpfsLinkByCid(chain.logoIpfsCid)"
                  text="Link"
                  newWindow
            />
            <ExternalLinkIcon/>
            <CopyButton :data="logoLink"/>
            &nbsp;
            <CopyButton :data="chain.logoIpfsCid" text="IPFS cid"/>
          </template>

          <template v-else>
            soon
          </template>
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
import Link from "./Link.vue";

const props = defineProps<{
  chainName: UNIQUE_CHAINS
  disableMetamask?: boolean
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

table {
  display: table;
  width: 100%;
}

.colorSquare {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
  margin: 0 0.375rem;
}

td.identica {
  .title {
    display: inline-block;
    width: 3rem;
    //border: 1px solid red;
  }

  .logoLine {
    margin-top: .25rem;

    .logo {
      vertical-align: middle;
      margin-left: 0.125rem;
      margin-right: 0.5rem;
    }
  }

}


</style>

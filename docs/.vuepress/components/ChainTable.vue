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
          <CopyButton :data="chain.websocketUrls[0]" />
        </td>
      </tr>
      <tr>
        <td>SS58Prefix</td>
        <td>{{ chain.ss58Prefix }}
          <CopyButton :data="chain.ss58Prefix" />
        </td>
      </tr>
      <tr>
        <td>Currency</td>
        <td>{{ chain.metamask.nativeCurrency.symbol }} ({{ chain.metamask.nativeCurrency.decimals }} decimals)</td>
      </tr>
      <tr>
        <td>Ethereum RPC</td>
        <td>{{ chain.metamask.rpcUrls[0] }}
          <CopyButton :data="chain.metamask.rpcUrls[0]" />
        </td>
      </tr>
      <tr>
        <td>Chain Id</td>
        <td>
          {{ chain.metamask.chainId }}
          ({{ parseInt(chain.metamask.chainId) }})
          <CopyButton :data="chain.metamask.chainId" />
          <UniqueButton :disabled="disableMetamask" :onClick="() => addChainToMetamask(chainName)"> Add to metamask
          </UniqueButton>
        </td>
      </tr>
      <tr>
        <td>Identica</td>
        <td class="identica">
          <div>
            <span class="title">Color:</span>
            <div class="colorSquare" :style="{ backgroundColor: chain.color }"></div>
            <CopyButton :data="chain.color" :text="chain.color" />
          </div>

          <div class="logoLine">
            <span class="title">Logo:</span>

            <a :href="chain.metamask.iconUrls[0]" target="_blank" class="logo">
              <img :src="withBase(`/images/logo/${chainName}.svg`)" height="24">
            </a>
            <!--          <ExternalLinkIcon/>-->
            <!--          <Link :href="chain.metamask.iconUrls[0]"-->
            <!--                text="Link"-->
            <!--                newWindow-->
            <!--          />-->

            <CopyButton :data="logoIpfsCid" text="IPFS cid" />

            <CopyButton :data="chain.metamask.iconUrls[0]" text="Full link" />
            <br />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UNIQUE_CHAINS, uniqueChainsParameters } from '../utils/constants'
import { addChainToMetamask } from '../utils/metamask'
import CopyButton from './CopyButton.vue'
import UniqueButton from '../components/UI/UniqueButton.vue'
import { withBase } from "@vuepress/client";

const props = defineProps<{
  chainName: UNIQUE_CHAINS
  disableMetamask?: boolean
}>()

const chain = computed(() => uniqueChainsParameters[props.chainName])
const logoIpfsCid = computed(() => chain.value.metamask.iconUrls?.[0]?.split('/').pop())
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
  // border-radius: 20px !important;
  // box-shadow: 0 0 20px rgba(var(--c-text-hover), 0.1);
}

th {
  // border-bottom: 3px solid #999 !important;
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  background-color: rgba(var(--c-border-table));
  border: 0px;
  padding: 24px 0 24px 16px;
}

tr,
td {
  border: thin;
  font-weight: 400;
  font-size: 16px;
  padding: 14px;
  background-color: var(--bg-color);
  border-bottom: 2px solid rgba(var(--c-border-table));
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

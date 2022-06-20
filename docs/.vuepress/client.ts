import {defineClientConfig} from '@vuepress/client'
import {useInitProvider} from 'unique_api_vue'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineClientConfig({
  setup() {
    if (typeof window !== "undefined") window.global = window

    useInitProvider({
      substrateNodeWsUrl: 'wss://quartz.api.onfinality.io/public-ws',
      substrateAutoconnect: false,
      initEthereumExtension: false,
      connectToPolkadotExtensionsAs: 'Unique Network Docs',
    })
  },
})

import {defineClientConfig} from '@vuepress/client'
import {useInitProvider} from 'unique_api_vue'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineClientConfig({
  setup() {
    useInitProvider({
      connectToPolkadotExtensionsAs: 'Unique Network Docs',
      // initEthereumExtension: true,
      // substrateAutoconnectTo: ''
    })
  },
})

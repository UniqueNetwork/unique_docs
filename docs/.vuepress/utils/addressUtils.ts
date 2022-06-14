import '@unique-nft/types/augment-api'

import {libs} from '@unique-nft/api'
import SponsoringProvider from 'web3-provider-sponsoring'

export const testMetamask = async () => {
  const ethers = libs.getEthers()

  console.log(`[COMMON WEB3 TEST] Starting Web3...`)
  const rpcProvider = new ethers.providers.JsonRpcProvider('https://rpc-opal.unique.network/')
  await rpcProvider.getBlockNumber()
  const opalChainId = await rpcProvider.network.chainId
  console.log(`%c[COMMON WEB3 TEST] Success. Opal chain id is: ${opalChainId}`, "color:lightgreen")

  if ((window as any).ethereum) {
    console.log('[METAMASK WEB3 TEST] Starting Web3...')
    const extensionProvider = new ethers.providers.Web3Provider(new SponsoringProvider((window as any).ethereum))
    await extensionProvider.getBlockNumber()
    const opalChainId2 = await extensionProvider.network.chainId
    console.log(`%c[METAMASK WEB3 TEST] Success. Chain id for web3 from metamask is: ${opalChainId2}`, "color:lightgreen")
  }
}


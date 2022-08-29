import {Ethereum, libs, init} from '@unique-nft/api'
import {UNIQUE_CHAINS, AddEthereumChainParameter, uniqueChainsParameters} from './constants'
// import SponsoringProvider from 'web3-provider-sponsoring'

export const testMetamask = async () => {
  let ethers = libs.getEthers()
  if (!ethers) {
    await init()
  }
  ethers = libs.getEthers()

  console.log(`[COMMON WEB3 TEST] Starting Web3...`)
  const rpcProvider = new ethers.providers.JsonRpcProvider('https://rpc-opal.unique.network/')
  await rpcProvider.getBlockNumber()
  const opalChainId = await rpcProvider.network.chainId
  console.log(`%c[COMMON WEB3 TEST] Success. Opal chain id is: ${opalChainId}`, "color:lightgreen")

  if ((window as any).ethereum) {
    console.log('[METAMASK WEB3 TEST] Starting Web3...')
    const extensionProvider = new ethers.providers.Web3Provider(
      // new SponsoringProvider(
      (window as any).ethereum
      // )
    )
    await extensionProvider.getBlockNumber()
    const opalChainId2 = await extensionProvider.network.chainId
    console.log(`%c[METAMASK WEB3 TEST] Success. Chain id for web3 from metamask is: ${opalChainId2}`, "color:lightgreen")
  }
}

export const connectToMetamask = async (): Promise<string[]> => {
  let getAccountsResult = await Ethereum.extension.safeGetAccounts()
  if (!getAccountsResult.extensionFound) {
    return []
  }
  if (getAccountsResult.accounts.length) {
    return getAccountsResult.accounts
  } else {
    return await Ethereum.extension.requestAccounts()
  }
}


export const addChainToMetamask = async (chainName: UNIQUE_CHAINS) => {
  if (chainName !== UNIQUE_CHAINS.unique && chainName !== UNIQUE_CHAINS.quartz && chainName !== UNIQUE_CHAINS.opal) {
    throw new Error(`chainName should be "unique", "quartz" or "opal", received "${chainName}"`)
  }

  const safeGetAccountsResult = await Ethereum.extension.safeGetAccounts()
  if (!safeGetAccountsResult.extensionFound) {
    throw new Error(`No browser extension found`)
  }
  const ethereum = (window as any).ethereum

  if (ethereum.chainId === uniqueChainsParameters[chainName].metamask.chainId) {
    console.log(`No need to add the chain to wallet - wallet already has ${chainName}'s chainId: ${ethereum.chainId} (${parseInt(ethereum.chainId)})`)
    return
  }

  console.log(`trying to switch chain to ${chainName}`)

  try {
    const param: AddEthereumChainParameter = {...uniqueChainsParameters[chainName].metamask}
    delete (param as any).websocketUrls

    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [param],
    })
  } catch (addError: any) {
    console.error('Error during attempt to add chain to wallet', addError.code, addError)
    throw addError
  }

  /*
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: uniqueChainsAddEthereumParameters[chainName].chainId}],
    })
    console.log(`successfully switched chain to ${chainName}`)
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    // if (switchError.code === 4902) {
    //
    // }
    console.error('Error during attempt to switch wallet chain', switchError.code, switchError)
    throw switchError
  }
  */
}

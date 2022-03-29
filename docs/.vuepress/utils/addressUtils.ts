import '@unique-nft/types/augment-api'


import {EthAddress, SubAddress} from "./typings";

import {importPolkadotUtilCrypto, importWeb3SponsoringProvider, importWeb3} from "./util/lib_imports";

export const normalizeSubAddress = async (rawSubAddress: string): Promise<SubAddress> => {
  const {validateAddress, encodeAddress, decodeAddress} = await importPolkadotUtilCrypto()

  validateAddress(rawSubAddress)
  return encodeAddress(decodeAddress(rawSubAddress)) as SubAddress
}

export const validateSubAddress = async (rawSubAddress: string): Promise<boolean> => {
  const {validateAddress} = await importPolkadotUtilCrypto()

  return validateAddress(rawSubAddress)
}

export const ethToSub = async (rawEthAddress: string): Promise<SubAddress> => {
  const {evmToAddress} = await importPolkadotUtilCrypto()
  return evmToAddress(rawEthAddress, 42, 'blake2') as SubAddress
}

export const testMetamask = async () => {
  const Web3 = await importWeb3()

  console.log(`[COMMON WEB3 TEST] Starting Web3...`)
  const web3 = new Web3('https://rpc-opal.unique.network/')
  const opalChainId = await web3.eth.getChainId()
  console.log(`%c[COMMON WEB3 TEST] Success. Opal chain id is: ${opalChainId}`, "color:lightgreen")

  if ((window as any).ethereum) {
    const SponsoringProvider = await importWeb3SponsoringProvider()
    console.log('[METAMASK WEB3 TEST] Starting Web3...')
    const web32 = new Web3(new SponsoringProvider((window as any).ethereum));
    const opalChainId2 = await web32.eth.getChainId()
    console.log(`%c[METAMASK WEB3 TEST] Success. Chain id for web3 from metamask is: ${opalChainId2}`, "color:lightgreen")
  }
}

export const subToEth = async (rawSubAddress: string): Promise<EthAddress> => {
  const Web3 = await importWeb3()
  const {validateAddress, addressToEvm} = await importPolkadotUtilCrypto()

  validateAddress(rawSubAddress)

  const bytes = addressToEvm(rawSubAddress)
  const intermediateEthAddress = '0x' + Buffer.from(bytes).toString('hex')

  const ethAddress = Web3.utils.toChecksumAddress(intermediateEthAddress)

  return ethAddress as EthAddress
}

export const subToSubMirrorOfEth = async (substrateAddress: string): Promise<SubAddress> => {
  const {evmToAddress} = await importPolkadotUtilCrypto()

  const ethAddress = await subToEth(substrateAddress)
  return evmToAddress(ethAddress, 42, 'blake2') as SubAddress
}

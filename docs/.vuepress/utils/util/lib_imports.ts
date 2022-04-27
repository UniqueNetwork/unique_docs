import '_utils/util/plugin_web3'

import type Web3Class from 'web3'

export const importWeb3 = async (): Promise<typeof Web3Class> => {
  return (await import('web3')).default
}

export const importWeb3SponsoringProvider = async () => {
  return (await import('web3-provider-sponsoring')).default
}

export const importPolkadotUtilCrypto = async () => {
  return (await import('@polkadot/util-crypto'))
}

export const importBuffer = async() => {
  return (await import('buffer')).Buffer
}

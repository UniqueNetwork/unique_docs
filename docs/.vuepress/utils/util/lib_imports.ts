import '_utils/util/plugin_web3'

import type Web3Class from 'web3'

export const importWeb3 = async (): Promise<typeof Web3Class> => {
  return (await import('web3')).default
}

import type SponsoringProviderType from 'web3-provider-sponsoring';

export const importWeb3SponsoringProvider = async (): Promise<typeof SponsoringProviderType> => {
  return (await import('web3-provider-sponsoring')).default
}

import type PolkadotUtilCrypto from '@polkadot/util-crypto'

export const importPolkadotUtilCrypto = async (): Promise<typeof PolkadotUtilCrypto> => {
  return (await import('@polkadot/util-crypto'))
}

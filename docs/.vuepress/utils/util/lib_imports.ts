// import '_utils/util/plugin_web3'
import process from 'process'
import {Buffer} from 'buffer'
import EventEmitter from 'events'

if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.process = process
  ;(window as any).EventEmitter = EventEmitter
  ;(window as any).global = window
}

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

export enum UNIQUE_CHAINS {
  unique= 'unique',
  quartz= 'quartz',
  opal = 'opal',
  sapphire = 'sapphire',
}

export interface AddEthereumChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

interface ChainData {
  metamask: AddEthereumChainParameter

  websocketUrls: string[]
  ss58Prefix: number
  logoIpfsCid: string
  color: string
}

export const uniqueChainsParameters: Record<UNIQUE_CHAINS, ChainData> = {
  [UNIQUE_CHAINS.unique]: {
    metamask: {
      chainId: "0x22b0",
      chainName: 'Unique',
      nativeCurrency: {
        name: 'Unique',
        symbol: 'UNQ',
        decimals: 18,
      },
      rpcUrls: [`https://rpc.unique.network`],
      iconUrls: [`https://ipfs.unique.network/ipfs/QmPCqY7Lmxerm8cLKmB18kT1RxkwnpasPVksA8XLhViVT7`],
    },

    websocketUrls: [`wss://ws.unique.network`],
    ss58Prefix: 7391,
    logoIpfsCid: `QmPCqY7Lmxerm8cLKmB18kT1RxkwnpasPVksA8XLhViVT7`,
    color: `#00BFFF`,
  },
  [UNIQUE_CHAINS.quartz]: {
    metamask: {
      chainId: "0x22b1",
      chainName: "Quartz by Unique",
      nativeCurrency: {
        name: 'Quartz',
        symbol: 'QTZ',
        decimals: 18,
      },
      rpcUrls: [`https://rpc-quartz.unique.network`],
      iconUrls: [`https://ipfs.unique.network/ipfs/QmUoTq3D5p5a8CjQSFYECmErkpQN9wQWqkBAdyravzAZai`],
    },

    //unique custom fields
    websocketUrls: [`wss://ws-quartz.unique.network`],
    ss58Prefix: 255,
    logoIpfsCid: `QmUoTq3D5p5a8CjQSFYECmErkpQN9wQWqkBAdyravzAZai`,
    color: `#FF4D6A`,
  },
  [UNIQUE_CHAINS.opal]: {
    metamask: {
      chainId: "0x22b2",
      chainName: "Opal by Unique",
      nativeCurrency: {
        name: 'Opal',
        symbol: 'OPL',
        decimals: 18,
      },
      rpcUrls: [`https://rpc-opal.unique.network`],
      iconUrls: [`https://ipfs.unique.network/ipfs/QmWivYecQTys2mz72QTbved8AZmfqG6ereTBPJpmThjY4Q`],
    },

    websocketUrls: [`wss://ws-opal.unique.network`],
    ss58Prefix: 42,
    logoIpfsCid: `QmWivYecQTys2mz72QTbved8AZmfqG6ereTBPJpmThjY4Q`,
    color: `#5942C8`,
  },
  [UNIQUE_CHAINS.sapphire]: {
    metamask: {
      chainId: "0x22b3",
      chainName: "Sapphire by Unique",
      nativeCurrency: {
        name: 'Quartz',
        symbol: 'QTZ',
        decimals: 18,
      },
      rpcUrls: [`https://rpc-sapphire.unique.network`],
      iconUrls: [`https://ipfs.unique.network/ipfs/QmUoTq3D5p5a8CjQSFYECmErkpQN9wQWqkBAdyravzAZai`],
    },

    //unique custom fields
    websocketUrls: [`wss://ws-sapphire.unique.network`],
    ss58Prefix: 8883,
    logoIpfsCid: `QmPCqY7Lmxerm8cLKmB18kT1RxkwnpasPVksA8XLhViVT7`,
    color: `#0F52BA`,
  }
}

export const UNIQUE_IPFS_GATEWAY = `https://ipfs.unique.network/ipfs`
export const getIpfsLinkByCid = (cid: string) => `${UNIQUE_IPFS_GATEWAY}/${cid}`

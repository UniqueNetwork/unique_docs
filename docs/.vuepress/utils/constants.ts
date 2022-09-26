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
      iconUrls: [`https://ipfs.unique.network/ipfs/QmbJ7CGZ2GxWMp7s6jy71UGzRsMe4w3KANKXDAExYWdaFR`],
      blockExplorerUrls: ['https://uniquescan.io/unique/'],
    },

    websocketUrls: [`wss://ws.unique.network`],
    ss58Prefix: 7391,
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
      iconUrls: [`https://ipfs.unique.network/ipfs/QmaGPdccULQEFcCGxzstnmE8THfac2kSiGwvWRAiaRq4dp`],
      blockExplorerUrls: ['https://uniquescan.io/quartz/'],
    },

    //unique custom fields
    websocketUrls: [`wss://ws-quartz.unique.network`],
    ss58Prefix: 255,
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
      iconUrls: [`https://ipfs.unique.network/ipfs/QmYJDpmWyjDa3H6BxweFmQXk4fU8b1GU7M9EqYcaUNvXzc`],
      blockExplorerUrls: ['https://uniquescan.io/opal/'],
    },

    websocketUrls: [`wss://ws-opal.unique.network`],
    ss58Prefix: 42,
    color: `#0CB6B8`,
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
      iconUrls: [`https://ipfs.unique.network/ipfs/Qmd1PGt4cDRjFbh4ihP5QKEd4XQVwN1MkebYKdF56V74pf`],
      blockExplorerUrls: ['https://uniquescan.io/sapphire/'],
    },

    //unique custom fields
    websocketUrls: [`wss://ws-sapphire.unique.network`],
    ss58Prefix: 8883,
    color: `#5D59FF`,
  }
}

export const UNIQUE_IPFS_GATEWAY = `https://ipfs.unique.network/ipfs`
export const getIpfsLinkByCid = (cid: string) => `${UNIQUE_IPFS_GATEWAY}/${cid}`

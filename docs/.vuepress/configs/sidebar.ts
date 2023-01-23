import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/tutorials': [
      {
        text: 'Tutorials',
        children: [
          {
            text: 'SDK guides',
            children: [
              '/tutorials/how-to-accounts.md',
              '/tutorials/how-to-collections.md',
              // '/tutorials/accounts/create-account.md', - how-to-accounts.md
              // '/tutorials/getAccountAndBalance.md', - how-to-accounts.md
              '/tutorials/create-collection-token.md',
              // '/tutorials/accounts/integrate-creating-into-UI.md', - how-to-accounts.md
              '/tutorials/nfts-how-to-create-and-tune-collection.md',
              '/tutorials/nfts-how-to-mint.md',
              // '/tutorials/store-files.md',  - duplicate
              // '/tutorials/nfts-ways-to-create.md', - duplicate
              // '/tutorials/destroyCollection.md', - how-to-collections.md
              '/tutorials/burnNFT.md',
              '/tutorials/work-with-evm-via-sdk.md',
//              '/tutorials/live-nft-example.md', -> moved to SDK life nft
              '/tutorials/websocket-subscriptions.md',
            ]
          },
          {
            text: 'EVM and Eth-like RPC',
            children: [
              '/tutorials/eth-general.md',
              '/tutorials/how-to-ethereum.md',
            ]
          },
          {
            text: 'REST API examples',
            children: [
              '/tutorials/examplesREST.md',
            ]
          },
          {
            text: 'GraphQL samples',
            children: [
              '/tutorials/wallet-integration.md',
              '/tutorials/how-to-get-collections-tokens.md',
              '/tutorials/nfts-fetching.md',
            ]
          },
          '/tutorials/createAccount.md',
          '/tutorials/getNFTsAndTokens.md',
          '/tutorials/easy-market.md',
//        '/tutorials/how-to-use-nesting-and-bundling.md', -> moved to SDK nesting
        ],
      }
    ],
    '/business': [
      {
        text: 'Business',
        children: [
          '/business/index.md',
          '/business/ecosystem/community.md',
          '/business/ecosystem/use-cases.md',
        ],
      }
    ],
    '/concepts': [
      {
        text: 'Concepts',
        children: [
          {
            text: 'Tokens & collections types',
            children: [
              '/concepts/types/nft.md',
              '/concepts/types/rft.md',
              '/concepts/types/fungible.md',
            ]
          },
          {
            text: 'Collections',
            children: [
              '/concepts/collections/collection-schemas.md',
              '/concepts/collections/collection-properties.md',
              '/concepts/collections/token-properties.md',
              '/concepts/collections/collection-permissions.md',
              '/concepts/collections/collection-limits.md',
            ]
          },
          '/concepts/addresses/index.md',
          {
            text: 'Schemas',
            children: [
              '/concepts/schemas/unique.md',
              '/concepts/schemas/ERC721Metadata.md',
            ]
          },
          {
            text: 'Network Features',
            children: [
              '/concepts/network-features/index.md',
              '/concepts/network-features/evm.md',
              '/concepts/network-features/sponsoring.md',
              '/concepts/network-features/onchain-metadata.md',
              '/concepts/network-features/nesting-bundling.md',
              '/concepts/network-features/refungibility.md',
              '/concepts/network-features/scheduling.md',
              '/concepts/network-features/rate-limits.md',
              '/concepts/network-features/royalties.md',
              '/concepts/network-features/did.md',
            ]
          },
          '/concepts/glossary.md',
        ],
      },
    ],
    '/evm': [
      {
        text: 'EVM docs',
        children: [
          '/evm/index.md',
          '/evm/smart_contracts.md',
          '/evm/UniqueNFT.md',
        ],
      }
    ],
    '/networks': [
      {
        text: 'Networks',
        children: [
          '/networks/index.md',
          '/networks/rpc.md',
          '/networks/extrinsics.md',
          '/networks/events.md',
          '/networks/governance-only.md',
          '/networks/nesting.md',
          {
            text: 'Ecosystem',
            children: [
              '/networks/ecosystem/substrate.md',
              '/networks/ecosystem/polkadot.md',
            ]
          },
        ],
      }
    ],
    '/sdk': [
      {
        text: 'SDK docs',
        children: [
          '/sdk/index.md',
          '/sdk/examplesSubstrateREST.md',
          '/sdk/examplesSDK.md',
          '/sdk/examplesLifeNFT.md',
          '/sdk/examplesNesting.md',
//        '/sdk/installation.md', -> moved to other pages
          '/sdk/architecture.md',
          '/sdk/methods.md',
          '/sdk/ios.md',
          '/sdk/android.md',
          '/sdk/C_sharp.md',
          // '/sdk/tools.md', -> this info exists in Tutorials section
        ],
      }
    ]
  }
}

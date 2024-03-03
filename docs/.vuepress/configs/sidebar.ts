import { SidebarConfig } from '@vuepress/theme-default'

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
              '/tutorials/work-with-accounts.md',
              '/tutorials/how-to-collections.md',
              '/tutorials/how-to-tokens.md',
              // '/tutorials/accounts/create-account.md', - how-to-accounts.md
              // '/tutorials/getAccountAndBalance.md', - how-to-accounts.md
              // '/tutorials/create-collection-token.md', - exists in how-to-collections.md + how-to-tokens.md
              // '/tutorials/accounts/integrate-creating-into-UI.md', - how-to-accounts.md
              '/tutorials/nfts-how-to-create-and-tune-collection.md',
              '/tutorials/nfts-how-to-mint.md',
              // '/tutorials/store-files.md',  - duplicate
              // '/tutorials/nfts-ways-to-create.md', - duplicate
              // '/tutorials/destroyCollection.md', - how-to-collections.md
              // '/tutorials/burnNFT.md', - how-to-tokens.md
              '/tutorials/work-with-evm-via-sdk.md',
              // '/tutorials/live-nft-example.md', -> moved to SDK life nft
              '/tutorials/websocket-subscriptions.md',
            ],
          },
          {
            text: 'Minting guides',
            children: [
              '/tutorials/minting/main.md',
              '/tutorials/minting/setup-environment.md',
              '/tutorials/minting/prepare-scripts.md',
              '/tutorials/minting/prepare-account.md',
              '/tutorials/minting/generative-nft.md',
              '/tutorials/minting/mass-minting.md',
              '/tutorials/minting/customizable-nfts.md',
              '/tutorials/minting/mass-listing.md'
            ]
          },
          {
            text: 'EVM and Eth-like RPC',
            children: [
              '/tutorials/evm/eth-general.md',
              '/tutorials/evm/using-contracts.md',
              '/tutorials/evm/using-sol-interfaces.md',
              '/tutorials/evm/ready-samples.md',
              // '/tutorials/evm/how-to-ethereum.md', - disassembled
            ],
          },
          {
            text: 'REST API examples',
            children: ['/tutorials/examplesREST.md'],
          },
          {
            text: 'GraphQL samples',
            children: [
              '/tutorials/graph-node-docker.md',
              '/tutorials/subquery-indexer.md',
              '/tutorials/wallet-integration.md',
              '/tutorials/how-to-get-collections-tokens.md',
              '/tutorials/nfts-fetching.md',
            ],
          },
          // '/tutorials/createAccount.md', - how-to-accounts.md
          '/tutorials/getNFTsAndTokens.md',
          '/tutorials/easy-market.md',
          // '/tutorials/how-to-use-nesting-and-bundling.md', -> moved to SDK nesting
          '/tutorials/ledger-connect.md',
        ],
      },
    ],
    '/about': [
      {
        text: 'What is Unique Network',
        children: [
          '/about',
          '/about/ecosystem/ambassador.md',
        ],
      },
      {
        text: 'Concepts',
        children: [
          {
            text: 'Tokens & collections types',
            link: '/about/types/nft.md',
            collapsible: true,
            children: [
              '/about/types/nft.md',
              '/about/types/rft.md',
              '/about/types/fungible.md',
            ],
          },
          {
            text: 'NFT formats',
            link: '/about/nft-formats/native-nfts.md',
            collapsible: true,
            children: [
              '/about/nft-formats/native-nfts.md',
              '/about/nft-formats/customizable-nfts.md',
              '/about/nft-formats/multi-resource-nfts.md',
              '/about/nft-formats/dynamic-nfts.md',
              '/about/nft-formats/fractional-tokens.md',
              '/about/nft-formats/nested-nfts.md',
            ],
          },
          '/about/addresses/index.md',
          '/about/balances/index.md',
          {
            text: 'Network Features',
            link: '/about/network-features/evm.md',
            collapsible: true,
            children: [
              '/about/network-features/evm.md',
              '/about/network-features/sponsoring.md',
              '/about/network-features/nesting-bundling.md',
              '/about/network-features/live-nft.md',
            ],
          },
          '/about/glossary.md',
          '/about/limitations/limitations.md'
        ]
      }
    ],
    '/evm': [
      {
        text: 'EVM docs',
        children: [
          '/evm/index.md',
          '/evm/smart_contracts.md',
          '/evm/UniqueNFT.md'
        ],
      },
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
          '/networks/owner-admin-roles.md',
          {
            text: 'Ecosystem',
            children: [
              '/networks/ecosystem/substrate.md',
              '/networks/ecosystem/polkadot.md'
            ],
          },
        ],
      },
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
          // '/sdk/installation.md', -> moved to other pages
          '/sdk/architecture.md',
          '/sdk/methods.md',
          '/sdk/ios.md',
          '/sdk/android.md',
          '/sdk/C_sharp.md',
          // '/sdk/tools.md', -> this info exists in Tutorials section
        ],
      },
    ],
  },
}

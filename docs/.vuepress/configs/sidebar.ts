import { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/about': [
      {
        text: 'Intro',
        children: [
          '/about',
          '/about/approach.md',
          '/about/timeline.md',
          '/about/networks.md',
        ],
      },
      {
        text: 'Functionality',
        children: [
          {
            text: 'Token types ▾',
            link: '/about/token-types/main-types.md',
            collapsible: true,
            children: [
              '/about/token-types/main-types.md',
              '/about/token-types/nft.md',
              '/about/token-types/rft.md',
              '/about/token-types/coins.md',
            ],
          },
          {
            text: 'Advanced NFT Features ▾',
            link: '/about/nft-features/native.md',
            collapsible: true,
            children: [
              '/about/nft-features/native.md',
              '/about/nft-features/multimedia.md',
              '/about/nft-features/nested.md',
              '/about/nft-features/dynamic.md',
              '/about/nft-features/customizable.md',
              '/about/nft-features/composable.md',
            ],
          },
          '/about/network-features/evm.md',
          '/about/network-features/pricing.md',
          '/about/network-features/sponsoring.md',
          '/about/network-features/staking.md',
          '/about/network-features/sdk-indexer',
          '/about/network-features/marketplace.md',

        ]
      },
      {
        text: 'Tech Concepts',
        children: [
          '/about/tech-concepts/addresses',
          '/about/tech-concepts/balances/index.md',
          //'/about/tech-concepts/glossary.md',
        ]
      }
    ],
    '/build': [
      {
        text: 'Intro',
        children: [
          '/build',
        ]
      },
      {
        text: 'SDK',
        children: [
            '/build/sdk/getting-started.md',
            '/build/sdk/accounts.md',
            '/build/sdk/collections.md',
            '/build/sdk/tokens.md',
            '/build/sdk/examples-nesting.md',
            '/build/sdk/refungible.md',
            '/build/sdk/sponsoring.md',
        ]
      },
      {
        text: 'SDK V2 [Alpha]',
        children: [
          '/build/sdk/v2/quick-start.md',
          '/build/sdk/v2/balances.md',
          '/build/sdk/v2/collections.md',
          '/build/sdk/v2/tokens.md',
        ]
      },
      {
        text: 'EVM',
        children: [
          '/build/evm',
          '/build/evm/accounts.md',
          '/build/evm/evm-from-substrate.md',
          {
            text: 'Precompiles',
            link: '/build/evm/precompiles/index.md',
            collapsible: true,
            children: [
              '/build/evm/precompiles/index.md',
              '/build/evm/precompiles/contract-helpers.md',
              '/build/evm/precompiles/collection-helpers.md',
            ],
          },
          '/build/evm/smart_contracts.md',
          '/build/evm/UniqueNFT.md',
        ],
      }
    ],
    '/tutorials': [
      {
        text: 'Intro',
        children: [
          '/tutorials'
        ]
      },
      {
        text: 'SDK guides',
        children: [
          '/tutorials/work-with-accounts.md',
          // '/tutorials/accounts/create-account.md', - how-to-accounts.md
          // '/tutorials/getAccountAndBalance.md', - how-to-accounts.md
          // '/tutorials/create-collection-token.md', - exists in how-to-collections.md + how-to-tokens.md
          // '/tutorials/accounts/integrate-creating-into-UI.md', - how-to-accounts.md
          '/tutorials/nfts-how-to-create-and-tune-collection.md',
          '/tutorials/nfts-how-to-mint.md',
          '/tutorials/createCollectionV2',
          // '/tutorials/store-files.md',  - duplicate
          // '/tutorials/nfts-ways-to-create.md', - duplicate
          // '/tutorials/destroyCollection.md', - how-to-collections.md
          // '/tutorials/burnNFT.md', - how-to-tokens.md
          '/tutorials/work-with-evm-via-sdk.md',
          // '/tutorials/live-nft-example.md', -> moved to SDK life nft
          '/tutorials/websocket-subscriptions.md',
        ]
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
        text: 'EVM',
        children: [
          '/tutorials/evm/eth-general.md',
          '/tutorials/evm/using-contracts.md',
          '/tutorials/evm/using-sol-interfaces.md',
          '/tutorials/evm/ready-samples.md',
          // '/tutorials/evm/how-to-ethereum.md', - disassembled
        ],
      },
      {
        text: 'REST API',
        children: [
          '/tutorials/examplesREST.md',
        ]
      },
      {
        text: 'GraphQL',
        children: [
          '/tutorials/graph-node-docker.md',
          '/tutorials/subquery-indexer.md',
          '/tutorials/wallet-integration.md',
          '/tutorials/how-to-get-collections-tokens.md',
          '/tutorials/nfts-fetching.md',
        ],
      },
      {
        text: 'How to',
        children: [
          // '/tutorials/createAccount.md', - how-to-accounts.md
          '/tutorials/mass-transactions.md',
          '/tutorials/getNFTsAndTokens.md',
          '/tutorials/easy-market.md',
          // '/tutorials/how-to-use-nesting-and-bundling.md', -> moved to SDK nesting
        ]
      },
      {
        text: 'User guides',
        children: [
          {
            text: 'Choose your wallet',
            link: '/tutorials/user-guides/wallets.md',
            children: [
              '/tutorials/user-guides/polkadotjs.md',
              '/tutorials/user-guides/ledger-connect.md'
            ]
          },
        ]
      },
    ],
    '/reference': [
      {
        text: 'Blockchains',
        children: [
          '/reference',
        ]
      },
      {
        text: "SDK",
        children: [
          '/reference/sdk-endpoints.md',
          '/reference/sdk-methods.md'
        ]
      },
      {
        text: 'EVM',
        children: [
          '/reference/tools.md'
        ]
      },
      {
        text: 'Blockchain API',
        children: [
          '/reference/blockchain/collections.md',
          '/reference/blockchain/properties.md',
          '/reference/blockchain/nesting.md',
          '/reference/blockchain/owner-admin-roles.md',
          '/reference/blockchain/rpc.md',
          '/reference/blockchain/extrinsics.md',
          '/reference/blockchain/events.md',
          '/reference/blockchain/contract-helpers.md'
        ],
      },
      {
        text: 'Schemas',
        children: [
          '/reference/schemas/2.0.0',
        ]
      }
    ],
  },
}

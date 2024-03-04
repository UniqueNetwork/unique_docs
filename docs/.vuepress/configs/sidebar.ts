import { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/about': [
      {
        text: 'What is Unique Network',
        link: '/about',
        // children: [
        //   '/about',
        //   '/about/ecosystem/ambassador.md',
        // ],
      },
      {
        text: 'Features',
        link: '/about/types/nft.md',
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
          '/about/network-features/evm.md',
          '/about/network-features/sponsoring.md',
          '/about/network-features/nesting-bundling.md',
          '/about/network-features/live-nft.md',
          '/about/network-features/staking.md',
          '/about/network-features/pricing.md',
        ]
      },
      {
        text: 'Tech Concepts',
        link: '/about/addresses',
        children: [
          '/about/addresses',
          '/about/balances/index.md',
          '/about/glossary.md',
          '/about/limitations/limitations.md'
        ]
      }
    ],
    '/develop': [
      {
        text: 'Development',
        link: '/develop',
      },
      {
        text: 'SDK',
        link: '/develop/sdk/index.md',
        children: [
            '/develop/sdk/index.md',
            '/develop/sdk/examplesSubstrateREST.md',
            '/develop/sdk/examplesSDK.md',
            '/develop/sdk/examplesLifeNFT.md',
            '/develop/sdk/examplesNesting.md',
            // '/develop/sdk/installation.md', -> moved to other pages
            '/develop/sdk/architecture.md',
            '/develop/sdk/methods.md',
            '/develop/sdk/ios.md',
            '/develop/sdk/android.md',
            '/develop/sdk/C_sharp.md',
            // '/develop/sdk/tools.md', -> this info exists in Tutorials section
        ]
      },
      {
        text: 'EVM',
        link: '/develop/evm/index.md',
        children: [
          '/develop/evm/index.md',
          '/develop/evm/smart_contracts.md',
          '/develop/evm/UniqueNFT.md'
        ],
      }
    ],
    '/tutorials': [
      {
        text: 'SDK guides',
        link: '/tutorials/how-to-accounts.md',
        collapsible: true,
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
        ]
      },
      {
        text: 'Minting guides',
        collapsible: true,
        link: '/tutorials/minting/main.md',
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
        collapsible: true,
        link: '/tutorials/evm/eth-general.md',
        children: [
          '/tutorials/evm/eth-general.md',
          '/tutorials/evm/using-contracts.md',
          '/tutorials/evm/using-sol-interfaces.md',
          '/tutorials/evm/ready-samples.md',
          // '/tutorials/evm/how-to-ethereum.md', - disassembled
        ],
      },
      '/tutorials/examplesREST.md',
      {
        text: 'GraphQL samples',
        collapsible: true,
        link: '/tutorials/graph-node-docker.md',
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
        collapsible: true,
        link: '/tutorials/getNFTsAndTokens.md',
        children: [
          // '/tutorials/createAccount.md', - how-to-accounts.md
          '/tutorials/getNFTsAndTokens.md',
          '/tutorials/easy-market.md',
          // '/tutorials/how-to-use-nesting-and-bundling.md', -> moved to SDK nesting
          '/tutorials/ledger-connect.md',
        ]
      },
    ],
    '/api': [
      '/api',
      {
        text: 'Blockchain API',
        children: [
          '/api/rpc.md',
          '/api/extrinsics.md',
          '/api/events.md',
          '/api/nesting.md',
          '/api/owner-admin-roles.md',
        ],
      },
      '/api/tools.md'
    ],
  },
}

import { SidebarConfig } from '@vuepress/theme-default';

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
        ],
      },
    ],
    '/build': [
      {
        text: 'Intro',
        children: ['/build'],
      },
      {
        text: 'SDK-2.0',
        children: [
          '/build/sdk/v2/quick-start.md',
          '/build/sdk/v2/balances.md',
          '/build/sdk/v2/collections.md',
          '/build/sdk/v2/tokens.md',
          '/build/sdk/v2/sponsoring.md',
          '/build/sdk/v2/indexer.md',
          '/build/sdk/v2/evm.md',
          '/build/sdk/v2/asset-hub.md',
          '/build/sdk/v2/dapps.md',
          '/build/sdk/v2/migration.md',
        ],
      },
      // {
      //   text: 'SDK-1.0',
      //   children: [
      //       '/build/sdk/getting-started.md',
      //       '/build/sdk/accounts.md',
      //       '/build/sdk/collections.md',
      //       '/build/sdk/tokens.md',
      //       '/build/sdk/examples-nesting.md',
      //       '/build/sdk/refungible.md',
      //       '/build/sdk/sponsoring.md',
      //   ]
      // },
      {
        text: 'EVM',
        children: [
          '/build/evm/',
          '/build/evm/getting-started.md',
          '/build/evm/accounts.md',
          {
            text: 'Smart contracts',
            link: '/build/evm/smart-contracts/index.md',
            collapsible: true,
            children: [
              '/build/evm/smart-contracts/index.md',
              '/build/evm/smart-contracts/collection-helpers.md',
              '/build/evm/smart-contracts/contract-helpers.md',
              '/build/evm/smart-contracts/writing-contracts.md',
            ],
          },
          '/build/evm/UniqueNFT.md',
        ],
      },
      {
        text: 'Tech Concepts',
        children: [
          '/build/tech-concepts/addresses',
          '/build/tech-concepts/balances/index.md',
        ],
      },
    ],
    '/tutorials': [
      {
        text: 'Intro',
        children: ['/tutorials'],
      },
      {
        text: 'Minting guides',
        children: [
          '/tutorials/minting/main.md',
          '/tutorials/minting/setup-environment.md',
          '/tutorials/minting/prepare-scripts.md',
          // remove OPL: '/tutorials/minting/prepare-account.md',
          '/tutorials/minting/generative-nft.md',
          '/tutorials/minting/mass-minting.md',
          '/tutorials/minting/customizable-nfts.md',
          '/tutorials/minting/mass-listing.md',
        ],
      },
      // TODO: we need to improve build/EVM section instead of this one:
      // {
      //   text: 'EVM',
      //   children: [
      //     '/tutorials/evm/eth-general.md',
      //     '/tutorials/evm/using-contracts.md',
      //     '/tutorials/evm/using-sol-interfaces.md',
      //     '/tutorials/evm/ready-samples.md',
      //     // '/tutorials/evm/how-to-ethereum.md', - disassembled
      //   ],
      // },
      // {
      //   text: 'REST API',
      //   children: [
      //   ]
      // },
      {
        text: 'How to',
        children: ['/tutorials/mass-transactions.md'],
      },
      {
        text: 'User guides',
        children: [
          {
            text: 'Choose your wallet',
            link: '/tutorials/user-guides/wallets.md',
            children: [
              '/tutorials/user-guides/polkadotjs.md',
              '/tutorials/user-guides/ledger-connect.md',
            ],
          },
        ],
      },
    ],
    '/reference': [
      {
        text: 'Blockchains',
        children: ['/reference'],
      },
      {
        text: 'SDK',
        children: ['/reference/sdk-endpoints.md', '/reference/sdk-methods.md'],
      },
      {
        text: 'EVM',
        children: ['/reference/tools.md'],
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
          '/reference/blockchain/contract-helpers.md',
        ],
      },
      {
        text: 'Schemas',
        children: ['/reference/schemas'],
      },
    ],
  },
};

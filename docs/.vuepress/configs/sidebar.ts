import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/guide': [
      {
        text: 'Unique Guide',
        children: [
          '/guide/index.md',
          '/guide/create-account.md',
          '/guide/wallet-integration.md'
        ],
      }
    ],
    '/links': [
      {
        text: 'Links',
        children: [
          '/links/index.md',
          '/links/ecosystem/community.md',
          '/links/ecosystem/use-cases.md',
          '/links/ecosystem/identica.md',
        ],
      }
    ],
    '/concepts': [
      {
        text: 'Concepts',
        children: [
          '/concepts/addresses/index.md',
          '/concepts/glossary.md',
          '/concepts/substrate.md',
          '/concepts/polkadot.md',
        ],
      },
    ],
    '/ethereum': [
      {
        text: 'Ethereum',
        children: [
          '/ethereum/index.md',
          '/ethereum/Smart contracts.md',
          '/ethereum/UniqueNFT.md',
        ],
      }
    ],
    '/chain': [
      {
        text: 'Chain',
        children: [
          '/chain/index.md',
          '/chain/rpc.md',
          '/chain/extrinsics.md',
          '/chain/sponsoring.md',
          '/chain/governance-only.md',
          '/chain/nesting.md',
        ],
      }
    ],
    '/sdk': [
      {
        text: 'SDK',
        children: [
          '/sdk/sdk_main.md',
          '/sdk/sdk.md',
          '/sdk/sdk_2.md',
          '/sdk/sdk_methods.md',
          '/sdk/web.md',
          '/sdk/accounts.md',
          '/sdk/recipes/README.md',
          '/sdk/recipes/nft-trading-for-classic-e-commerce/README.md',
        ],
      }
    ]
  }
}

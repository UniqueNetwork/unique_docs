import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/guide': [
      {
        text: 'Unique Guide',
        children: [
          '/guide/README.md',
          '/guide/create-account.md',
          '/guide/glossary.md',
          '/guide/identica.md',
          '/guide/wallet-integration.md'
        ],
      }
    ],
    '/repos': [
      {
        text: 'GitHub',
        children: ['/repos/README.md'],
      }
    ],
    '/ecosystem': [
      {
        text: 'Ecosystem',
        children: ['/ecosystem/polkadot.md',
        '/ecosystem/kusama.md',
        '/ecosystem/substrate.md',
        '/ecosystem/community.md',
          '/ecosystem/use-cases.md'
        ]
      }
    ],
    '/concepts': [
      {
        text: 'Concepts',
        children: [
          '/concepts/addresses/index.md',

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
          '/sdk/about_sdk.md',
          '/sdk/index.md',
          '/sdk/architecture.md',
          '/sdk/installation.md',
          '/sdk/methods.md',
          '/sdk/tools.md',
        ],
      }
    ],
    '/products/market': [
      {
        text: 'Market',
        children: [
          '/products/market/index.md',
        ]
      }
    ]
  }
}

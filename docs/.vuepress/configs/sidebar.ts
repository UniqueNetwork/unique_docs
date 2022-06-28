import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/guide': [
      {
        text: 'Unique Guide',
        children: ['/guide/README.md',
          '/guide/create-account.md',
          '/guide/get-ksm.md',
          '/guide/choosing-tools.md',
          '/guide/ethereum-tools.md',
          '/guide/graphql.md',
          '/guide/glossary.md',
          '/guide/identica.md'
        ],
      }
    ],
    '/repos': [
      {
        text: 'GitHub repositories',
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
    '/reference/addresses': [
      {
        text: 'Accounts and addresses',
        children: [
          '/reference/addresses/index.md',
          '/reference/addresses/wallet-integration.md'
        ],
      },
    ],
    '/reference/ethereum': [
      {
        text: 'Ethereum',
        children: [
          '/reference/ethereum/index.md',
          '/reference/ethereum/Smart contracts.md',
          '/reference/ethereum/UniqueNFT.md',
        ],
      }
    ],
    '/reference/chain': [
      {
        text: 'Chain',
        children: [
          '/reference/chain/index.md',
          '/reference/chain/governance-only.md',
          '/reference/chain/nesting.md',
        ],
      }
    ],
    '/reference/sdk': [
      {
        text: 'SDK',
        children: [
          '/reference/sdk/index.md',
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

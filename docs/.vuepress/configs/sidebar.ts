import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/guide': [
      {
        text: 'Unique Guide',
        children: ['/guide/README.md', '/guide/identica.md'],
      }
    ],
    'repos': [
      {
        text: 'GitHub repositories',
        children: ['/repos/README.md'],
      }
    ],
    '/reference': [
      {
        text: 'Unique Reference',
        children: [
          '/reference/README.md',
          '/reference/addresses.md',
          '/reference/wallet-integration.md',
          '/reference/glossary.md'
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
  }
}

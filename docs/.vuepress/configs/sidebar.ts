import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/guide': [
      {
        text: 'Unique Guide',
        children: ['/guide/README.md', '/guide/identica.md'],
      }
    ],
    '/reference': [
      {
        text: 'Unique Reference',
        children: ['/reference/README.md', '/reference/addresses.md', "/reference/indexer.md"],
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
          '/reference/sdk/sdk_main.md',
          '/reference/sdk/sdk.md',
          '/reference/sdk/sdk_methods.md',
          '/reference/sdk/web.md',
          '/reference/sdk/accounts.md',
          '/reference/sdk/recipes/README.md',
          '/reference/sdk/recipes/nft-trading-for-classic-e-commerce/README.md',
        ],
      }
    ],
  }
}

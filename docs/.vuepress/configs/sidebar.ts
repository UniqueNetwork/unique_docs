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
  }
}

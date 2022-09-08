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
          {
            text: 'Schemas',
            children: [
              '/concepts/schemas/index.md',
              '/concepts/schemas/unique.md',
              '/concepts/schemas/ERC721Metadata.md',
            ]
          },
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
          '/sdk/about_sdk.md',
          '/sdk/index.md',
          '/sdk/architecture.md',
          '/sdk/installation.md',
          '/sdk/methods.md',
          '/sdk/tools.md',
        ],
      }
    ]
  }
}

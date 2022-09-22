import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/sdk-guides': [
      {
        text: 'SDK guides',
        children: [
          '/sdk-guides/index.md',
          '/sdk-guides/createAccount.md',
          '/sdk-guides/examplesREST.md',
          '/sdk-guides/examplesSDK.md',
          '/sdk-guides/wallet-integration.md',
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
    '/about': [
      {
        text: 'About',
        children: [
          '/about/addresses/index.md',
          {
            text: 'Schemas',
            children: [
              '/about/schemas/index.md',
              '/about/schemas/unique.md',
              '/about/schemas/ERC721Metadata.md',
            ]
          },
          '/about/glossary.md',
          '/about/collection-limits.md',
          '/about/collection-permissions.md',
          '/about/substrate.md',
          '/about/polkadot.md',
        ],
      },
    ],
    '/evm-docs': [
      {
        text: 'EVM docs',
        children: [
          '/evm-docs/index.md',
          '/evm-docs/Smart contracts.md',
          '/evm-docs/UniqueNFT.md',
        ],
      }
    ],
    '/networks': [
      {
        text: 'Networks',
        children: [
          '/networks/index.md',
          '/networks/rpc.md',
          '/networks/extrinsics.md',
          '/networks/sponsoring.md',
          '/networks/governance-only.md',
          '/networks/nesting.md',
        ],
      }
    ],
    '/sdk-docs': [
      {
        text: 'SDK docs',
        children: [
          '/sdk-docs/index.md',
          '/sdk-docs/architecture.md',
          '/sdk-docs/installation.md',
          '/sdk-docs/methods.md',
          '/sdk-docs/tools.md',
        ],
      }
    ]
  }
}

import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/sdk-guides': [
      {
        text: 'SDK guides',
        children: [
          '/sdk-guides/index.md',
          '/sdk-guides/createAccount.md',
          '/sdk-guides/accounts/ways-to-create.md',
          '/sdk-guides/examplesREST.md',
          '/sdk-guides/examplesSDK.md',
          '/sdk-guides/wallet-integration.md',
          '/sdk-guides/getAccountAndBalance.md',
          '/sdk-guides/nfts-ways-to-create.md',
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
          {
            text: 'Tokens & collections types',
            children: [
              '/about/types/rft.md',
            ]
          },
          '/about/addresses/index.md',
          {
            text: 'Schemas',
            children: [
              '/about/schemas/index.md',
              '/about/schemas/unique.md',
              '/about/schemas/ERC721Metadata.md',
            ]
          },
          {
            text: 'Network Features',
            children: [
              '/about/network-features/index.md',
              '/about/network-features/evm.md',
              '/about/network-features/sponsoring.md',
              '/about/network-features/onchain-metadata.md',
              '/about/network-features/nesting-bundling.md',
              '/about/network-features/refungibility.md',
              '/about/network-features/scheduling.md',
              '/about/network-features/rate-limits.md',
              '/about/network-features/royalties.md',
              '/about/network-features/did.md',
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

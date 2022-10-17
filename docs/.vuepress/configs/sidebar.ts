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
          '/sdk-guides/how-to-get-collections-tokens.md',
          '/sdk-guides/nfts-fetching.md',
          '/sdk-guides/easy-market.md',
          '/sdk-guides/nfts-how-to-create-and-tune-collection.md',
          '/sdk-guides/nfts-how-to-mint.md',
          '/sdk-guides/nfts-ways-to-create.md',
          '/sdk-guides/store-files.md',
          '/sdk-guides/getAccountAndBalance.md',
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
          '/about/wallet-integration.md',
          {
            text: 'SDK',
            children: [
              '/about/sdk/index.md',
              '/about/sdk/about_sdk.md',
              '/about/sdk/installation.md',
              '/about/sdk/architecture.md',
              '/about/sdk/methods.md',
              '/about/sdk/tools.md',
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
  }
}

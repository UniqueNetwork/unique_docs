import { SidebarConfig } from "@vuepress/theme-default";

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    "/about": [
      {
        text: "Intro",
        children: [
          "/about",
          "/about/approach.md",
          "/about/timeline.md",
          "/about/networks.md",
        ],
      },
      {
        text: "Functionality",
        children: [
          {
            text: "Token types ▾",
            link: "/about/token-types/main-types.md",
            collapsible: true,
            children: [
              "/about/token-types/main-types.md",
              "/about/token-types/nft.md",
              "/about/token-types/rft.md",
              "/about/token-types/coins.md",
            ],
          },
          {
            text: "Advanced NFT Features ▾",
            link: "/about/nft-features/native.md",
            collapsible: true,
            children: [
              "/about/nft-features/native.md",
              "/about/nft-features/multimedia.md",
              "/about/nft-features/nested.md",
              "/about/nft-features/dynamic.md",
              "/about/nft-features/customizable.md",
              "/about/nft-features/composable.md",
            ],
          },
          "/about/network-features/evm.md",
          "/about/network-features/pricing.md",
          "/about/network-features/sponsoring.md",
          "/about/network-features/staking.md",
          "/about/network-features/sdk-indexer",
          "/about/network-features/marketplace.md",
        ],
      },
    ],
    "/build": [
      {
        text: "Intro",
        children: ["/build"],
      },
      {
        text: "Development",
        children: [
          "/build/sdk/v2/environment.md",
          "/build/sdk/v2/quick-start.md",
          "/build/sdk/v2/balances.md",
          "/build/sdk/v2/collections.md",
          "/build/sdk/v2/tokens.md",
          {
            text: "Unique Metadata Format",
            link: "/build/sdk/v2/metadata.md",
            collapsible: true,
            children: [
              "/build/sdk/v2/metadata.md",
              "/build/sdk/v2/metadata-reference.md",
            ],
          },
          "/build/sdk/v2/sponsoring.md",
          "/build/sdk/v2/indexer.md",
          "/build/sdk/v2/evm.md",
          "/build/sdk/v2/advanced-usage.md",
          "/build/sdk/v2/asset-hub.md",
          "/build/sdk/v2/migration.md",
        ],
      },
      // {
      //   text: 'SDK-1.0',
      //   children: [
      //       '/build/sdk/getting-started.md',
      //       '/build/sdk/accounts.md',
      //       '/build/sdk/collections.md',
      //       '/build/sdk/tokens.md',
      //       '/build/sdk/examples-nesting.md',
      //       '/build/sdk/refungible.md',
      //       '/build/sdk/sponsoring.md',
      //   ]
      // },
      {
        text: "EVM",
        children: [
          "/build/evm/",
          "/build/evm/getting-started.md",
          "/build/evm/accounts.md",
          {
            text: "Smart contracts",
            link: "/build/evm/smart-contracts/index.md",
            collapsible: true,
            children: [
              "/build/evm/smart-contracts/index.md",
              "/build/evm/smart-contracts/collection-helpers.md",
              "/build/evm/smart-contracts/contract-helpers.md",
              "/build/evm/smart-contracts/writing-contracts.md",
            ],
          },
          "/build/evm/UniqueNFT.md",
        ],
      },
      {
        text: "Tutorials",
        children: [
          "/build/guides/dapps.md",
          "/build/guides/mass-transactions.md",
          {
            text: "Minting NFTs",
            link: "/build/guides/minting/main.md",
            collapsible: true,
            children: [
              "/build/guides/minting/main.md",
              "/build/guides/minting/setup-environment.md",
              "/build/guides/minting/prepare-scripts.md",
              "/build/guides/minting/generative-nft.md",
              "/build/guides/minting/mass-minting.md",
              "/build/guides/minting/customizable-nfts.md",
              "/build/guides/minting/mass-listing.md",
            ],
          },
        ],
      },
      {
        text: "Tech Concepts",
        children: [
          "/build/tech-concepts/addresses",
          "/build/tech-concepts/balances/index.md",
        ],
      },
    ],
    "/reference": [
      {
        text: "Blockchains",
        children: ["/reference"],
      },
      {
        text: "SDK",
        children: ["/reference/sdk-endpoints.md"],
      },
      {
        text: "EVM",
        children: [
          "/reference/tools.md",
          "/reference/blockchain/contract-helpers.md",
        ],
      },
      {
        text: "Blockchain API",
        children: [
          "/reference/blockchain/owner-admin-roles.md",
          "/reference/blockchain/rpc.md",
          "/reference/blockchain/extrinsics.md",
          "/reference/blockchain/events.md",
        ],
      },
    ],
  },
};

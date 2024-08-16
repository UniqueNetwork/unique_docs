# Unique SDK quick start

::: warning
The Unique SDK v2 is in alpha and may contain bugs or incomplete features. For production use or to access more stable functionality, please refer to the [documentation for the previous version](../getting-started.md) of the SDK.
:::

The SDK facilitates seamless integration of Unique Network's capabilities into the web3 application, bypassing the need for direct low-level API interaction. It enables you to effortlessly mint collections and tokens, manage account balances, and more.

All transactions require a fee so that you can use Opal tokens for test purposes. You can get them free in [Telegram faucet bot](https://t.me/unique2faucet_opal_bot).

[[toc]]

## Getting started

### Installation

Install `@unique-nft/sdk` for Unique Network interaction and `@unique-nft/sr25519` for account management.

<!-- TODO remove alpha after release -->
<CodeGroup>
 <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/sdk@alpha @unique-nft/sr25519
```

 </CodeGroupItem>
 <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/sdk@alpha @unique-nft/sr25519
```

 </CodeGroupItem>
</CodeGroup>

### Import and initialize the SDK

To begin using the Unique SDK, you need to import the required modules, set the base URL for the API, and optionally configure the default signer account.

<!-- TODO set production baseUrl -->
```typescript:no-line-numbers
import { UniqueChain } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";


const mnemonic = "SET THE MNEMONIC SEED PHRASE FOR THE DEFAULT SIGNER HERE";
const account = Sr25519Account.fromUri(mnemonic);

// set "account" as a default signer
const sdk = UniqueChain({
 baseUrl: "https://rest.unique.network/v2/opal", 
 account,
});
```

### Make some requests

```typescript:no-line-numbers
...

const balanceQuery = await sdk.balance.get({address: account.address});
console.log("Account's total balance:", balanceRequest.total);
```

The Unique SDK currently supports the following modules:

- `collection`: create, update, and manage NFT collections.
- `token`: mint, transfer, and manage individual NFTs.
- `balance`: manage and query account balances.
- `extrinsic`: build, sign, submit any extrinsic.
- `options`: configure SDK options.

## Run your own HTTP proxy

Instead of using public SDK endpoints, you can easily run your own HTTP proxy. Create a docker-compose.yml with the following content, and run `docker compose up`.

```yml:no-line-numbers
version: "3.8"

services:
  substrate-proxy:
    image: uniquenetwork/substrate-proxy-http-proxy:master
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - CHAIN=unique
      - MIN_LOG_LEVEL=info
      - EXTRINSIC_MORTAL_BLOCK_LENGTH=32
      - OPENAPI_SERVER_URL=http://localhost:3000
      - OPENAPI_SERVER_DESCRIPTION="Local development server"
      - EXTRINSICS_STORAGE_MAX_BLOCKS_COUNT=100
```


# Unique SDK quick start

The SDK facilitates seamless integration of Unique Network's capabilities into the web3 application, bypassing the need for direct low-level API interaction. It enables you to effortlessly mint collections and tokens, manage account balances, and more.

[[toc]]

## Getting started

### Installation

Install `@unique-nft/sdk` for Unique Network interaction and `@unique-nft/sr25519` for account management.

<CodeGroup>
 <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/sdk @unique-nft/sr25519
```

 </CodeGroupItem>
 <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/sdk @unique-nft/sr25519
```

 </CodeGroupItem>
</CodeGroup>

### Import and initialize the SDK

To begin using the Unique SDK, import the required modules, set the base URL for the API, and configure the default signer account.

We'll use the local development environment set up in the [previous step](./environment.md). For production deployments, simply change the `baseUrl` to a public endpoint - you can find the list in the [reference section](../../../reference/sdk-endpoints.md).

```typescript:no-line-numbers
import { UniqueChain } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";


const mnemonic = "SET THE MNEMONIC SEED PHRASE FOR THE DEFAULT SIGNER HERE";
const account = Sr25519Account.fromUri(mnemonic);

// set "account" as a default signer
const sdk = UniqueChain({
  baseUrl: "http://localhost:3000", // use public endpoint for production
  account,
});
```

### Make some requests

```typescript:no-line-numbers
...

const balanceQuery = await sdk.balance.get({address: account.address});
console.log("Account's total balance:", balanceQuery.total);
```

The Unique SDK currently supports the following modules:

- `collection`: create, update, and manage NFT collections.
- `token`: mint, transfer, and manage individual NFTs.
- `fungible`: mint, transfer, and manage fungible tokens.
- `refungible`: mint, transfer, and manage refungible tokens.
- `balance`: manage and query account balances.
- `account`: get account info.
- `utility`: utility methods.
- `evm`: deploy and invoke smart contracts, call precompiles.
- `extrinsic`: build, sign, submit any extrinsic.
- `options`: configure SDK options.

## Next Steps

Now that you know the basics of the Unique SDK, you can:

- Learn about [managing balances](./balances.md)
- Explore [working with collections](./collections.md)
- Discover [token operations](./tokens.md)
- Set up [transaction sponsoring](./sponsoring.md)

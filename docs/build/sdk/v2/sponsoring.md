# Collection sponsoring

::: warning
The Unique SDK v2 is in alpha and may contain bugs or incomplete features. For production use or to access more stable functionality, please refer to the [documentation for the previous version](../getting-started.md) of the SDK.
:::

In Unique Network, transactions can be sponsored, allowing for a gasless experience where the sponsor covers the transaction fees. This enables seamless and cost-free transfers of NFTs and the execution of smart contracts, even for accounts without native tokens.

[[toc]]


## Prerequisite

Follow the [Getting started guide](./quick-start.md) to install required libraries, receive test network OPL tokens, and initialize SDK.

At this point, you need to know how to manage collections. Learn how to do this in the [Working with collections](./collections.md) guide.

You also need to know how to [mint and transfer NFTs](./tokens.md).

## Setting collection sponsoring

The process consists of two steps:

1. Set collection sponsor – only the collection owner or admin can do
2. Confirm sponsorship. The sponsor should confirm willingness to sponsor a collection

```ts:no-line-numbers
// At this point we assume you already have a minted collection and NFT
const collectionId = ...
const tokenId = ...

await sdk.collection.setSponsor({collectionId, sponsor: account.address})
await sdk.collection.confirmSponsorship({collectionId});
```

At this point, every action with tokens of this collection, such as transfer or minting, will be sponsored by `account`.

## Setting limits

You may want to set limits on sponsorship to prevent your sponsorship account from being drained. We already discussed how to set limits in the [collection section](collections.md#collection-limits). Let's take a closer look on sponsorship-related limits.

<!-- TODO setVariableMetadata is not the case anymore -->

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  limits: {
    // The time interval in blocks defines once per how long a non-privileged user approve transaction can be sponsored.
    sponsorApproveTimeout: 100,
    // Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored
    sponsoredDataRateLimit: 100,
    // The maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode
    sponsoredDataSize: 2048,
    // The time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored
    sponsorTransferTimeout: 0,
  },
});
```

## Let's check that an account without native tokens can transfer NFT

```ts:no-line-numbers
// generate a new account without OPL
const emptyAccount = Sr25519Account.fromUri(Sr25519Account.generateMnemonic());

// mint new token directly to `emptyAccount`
const tokensCreation = await sdk.token.mintNFTs({collectionId, tokens: [
 {owner: account.address}
]});
const [token] = tokensCreation.result;

// emptyAccount makes transfer
await sdk.token.transfer(
  {
    to: alice.address,
    collectionId,
    tokenId: token.tokenId,
  },
  { signerAddress: emptyAccount.address },
  emptyAccount,
);

// Check alice is the new owner
const { owner } = await sdk.token.get({
  collectionId: collectionId,
  tokenId: token.tokenId,
});
```

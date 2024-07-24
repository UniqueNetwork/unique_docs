# Collection sponsoring

In Unique Network, transactions can be sponsored, allowing for a gasless experience where the sponsor covers the transaction fees. This enables seamless and cost-free transfers of NFTs and the execution of smart contracts, even for accounts without native tokens.

[[toc]]


## Prerequisite

Follow the [Getting started guide](./quick-start.md) to install required libraries, receive test network OPL tokens, and initialize SDK.

At this point, you need to know how to manage collections. Learn how to do this in the [Working with collections](./collections.md) guide.

You also need to know how to [mint and transfer NFTs](./tokens.md).

## Setting collection sponsoring

The process consists of two steps:

1. Set collection sponsor – only the collection owner or admin can do
2. Confirm sponsorship. The sponsor should confirm willingness to sponsor collection

```ts:no-line-numbers
// At this point we assume you already have a minted collection and NFT
const collectionId = ...
const tokenId = ...

await sdk.collection.setSponsor({collectionId, sponsor: account.address})
await sdk.collection.confirmSponsorship({collectionId});
```

At this point, every action with tokens of this collection, such as transfer or minting, will be sponsored by `account`.
<!-- 
TODO
Let's check that an account without native tokens can perform NFT transfer.

```ts:no-line-numbers
// generate a new account without OPL
const emptyAccount = Sr25519Account.fromUri(Sr25519Account.generateMnemonic());

// mint new token to `emptyAccount`
const {result} = await sdk.token.mintNFTs({collectionId, tokens: [
 {owner: account.address}
]});



``` -->
# Working with collections

<Highlight type="warning">
The Unique SDK v2 is currently in alpha and may contain bugs or incomplete features. For production use or to access more stable functionality, please refer to the <a href="../getting-started">documentation for the previous version</a> of the SDK.
</Highlight>

[[toc]]

## Intro 

NFTs have become much easier to issue, and we’re seeing increasing amounts minted daily, mostly through NFT collections. This article will dive into NFT collection minting and some popular examples of how to work with NFT collections in Unique Network.

As the name implies, an NFT collection is a unique collection of NFTs. NFT artworks are generally created on a smaller scale with the involvement of concerned content creators or digital artists. In addition, you would also notice that individual NFT artworks are available for sale on different NFT marketplaces.

In Unique Network, the collection has the following entities: 

- **name** - a collection name that defines it in the global scope; 
- **description** - some additional details about the collection;
- **token prefix** - short string value that will be added to token IDs.
- **properties** - a unique set of keys and values which defines collection specifics; 
- **limits** - a set that defines the rules for a collection, e.g. whether it can be transferred, or how many tokens you can mint in it; 
- **owner** - an address that created a collection (or if the collection was transferred, the address that owns the collection at the moment);  
- **admins** - a collection can be controlled by multiple admin addresses. Admins can issue and burn NFTs, as well as add and remove other admins, but they cannot change NFT or collection ownership; 
- **allow list** - a list of addresses collected that allow certain community members a guaranteed spot for minting a new NFT. 

## Prerequisite

Follow the [Getting started guide](./quick-start.md) to install required libraries, receive test network OPL tokens, and initialize SDK.

## Creating a collection

Below is an (almost) minimum example. Only collection `name`, `description`, and `symbol` are mandatory fields. They exist at the collection level and cannot be overridden.

Collection coverage is a part of collection metadata and is not a mandatory field.

```ts:no-line-numbers
const collectionTx = await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  info: {cover_image: {url: 'https://gateway.pinata.cloud/ipfs/QmTkhTg5S5zrqJL3UsKtyiFi8fcMT3Cao9uKtadp3Ckh7m'}},
});

console.log("Collection ID:", collectionTx.result.collectionId);
```

In Unique Network every collection has a unique collection ID. You will need it later to [mint NFTs](./tokens.md).

At this point, you can check your collection successfully created on [Unique Scan](https://uniquescan.io/opal/collections/).

## Understanding collection modes

There are three different collection modes in Unique Network:
- NFT (default)
- Fungible
- ReFungible

You can specify the collection mode during the minting.

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  info: {cover_image: {url: coverImage}},
  mode: 'Fungible' // <--- set collection mode here 
});
```

## Understanding collection properties

<!-- TODO 64 properties is this correct? -->
Every collection in Unique Network can have up to 64 properties - a unique set of keys and values that defines collection specifics. Some of them relate to NFT metadata and are set automatically by SDK.

### Setting collection properties

During the collection creation, you can set collection limits as follows:

```ts:no-line-numbers
const {result} = await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  info: {cover_image: {url: "https://gateway.pinata.cloud/ipfs/QmTkhTg5S5zrqJL3UsKtyiFi8fcMT3Cao9uKtadp3Ckh7m"}},
  properties: [ //  <--- set collection properties here 
    {key: "A", value: "value A"},
    {key: "B", value: "value B"},
  ]
});
```

Later you can set new properties or modify previously created ones.

```ts:no-line-numbers
...

await sdk.collection.setProperties({
  collectionId: result.collectionId,
  properties: [{key: "C", value: "value C"}]
});
```

### Now let's query our collection and check its properties

```ts:no-line-numbers
const collection = await sdk.collection.get({idOrAddress: result.collectionId});

console.log(collection.properties);
```

The result will be as follows, let's break it down.

```ts:no-line-numbers
[
  {
    key: "A",
    value: "value A",
    valueHex: "0x76616c75652041",
  },
  {
    key: "B",
    value: "value B",
    valueHex: "0x76616c75652042",
  },
  {
    key: "C",
    value: "value C",
    valueHex: "0x76616c75652043",
  },
  {
  key: "collectionInfo",
    value: "{\"schemaName\":\"unique\",\"schemaVersion\":\"2.0.0\",\"cover_image\":{\"url\":\"https://gateway.pinata.cloud/ipfs/QmTkhTg5S5zrqJL3UsKtyiFi8fcMT3Cao9uKtadp3Ckh7m\"}}",
    valueHex: "0x7b22736368656d614e616d65223a22756e69717565222c22736368656d6156657273696f6e223a22322e302e30222c22636f7665725f696d616765223a7b2275726c223a2268747470733a2f2f676174657761792e70696e6174612e636c6f75642f697066732f516d546b6854673553357a72714a4c3355734b74796946693866634d543343616f39754b7461647033436b68376d227d7d",
  },
  {
    key: "schemaName",
    value: "unique",
    valueHex: "0x756e69717565",
  },
  {
    key: "schemaVersion",
    value: "2.0.0",
    valueHex: "0x322e302e30",
  },
]
```

- Properties `A`, `B`, and `C` has been manually set during the collection creation and modifying collection with `setCollectionLimits`
- Properties `schemaName`, `schemaVersion`, and `collectionInfo` are set by the SDK and relate to the Unique metadata. You can read more about [Unique Schema](../../../reference/schemas/2.0.0.md) in the reference section.


## Understanding token property permissions

Every NFT token inside the collection can have properties. The list of allowed properties and their mutability permissions are handled on the collection level.

Let's look at how to specify them.

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  info: {cover_image: {url: coverImage}},
  tokenPropertyPermissions: [ // <--- set token property permissions here 
    {key: 'A', permission: {mutable: true, collectionAdmin: true, tokenOwner: true}},
    {key: 'B', permission: {mutable: false, collectionAdmin: false, tokenOwner: false}},
    {key: 'C', permission: {mutable: false, collectionAdmin: false, tokenOwner: true}},
  ]
});
```

Every NFT token in the collection could have two properties:

- `A`: this property is mutable, it could be set during the NFT minting. Later it could be rewritten by the collection admin or NFT owner
- `B`: this property is immutable, and can be set only once during the minting
- `C`: this property is immutable, and can be set only once during the minting or later by the token owner

The SDK also specifies some additional token properties related to Unique Schema. Let's check them.

```ts:no-line-numbers
const colleciton = await sdk.collection.get({idOrAddress: collectionId})

console.log(colleciton.tokenPropertyPermissions);
```

There are a lot of additional token properties, like `URI`, `customizing_overrides`, and so on. You can check more information about them in the [reference section](../../../reference/schemas/2.0.0.md).

One of the most important token properties is `tokenData`, which will be a container for all token attributes. You will learn more about `attributes` in the [NFT section](./tokens.md).

## Understanding collection limits

It is possible to set some limitations such as:
- maximum number of tokens in the collection, or
- how many tokens a single account can hold
- whether the token can be transferred or not
- and many more

You can read more about collection limits in the [reference section](../../../reference/blockchain/collections.md#limits).

And that is how you can set such limits:

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  info: {cover_image: {url: coverImage}},
  limits: { // <--- set collection limits here 
    accountTokenOwnershipLimit: 1,
    ownerCanDestroy: true,
    ownerCanTransfer: false,
    sponsorApproveTimeout: 100,
    sponsoredDataRateLimit: 100,
    sponsoredDataSize: 2048,
    sponsorTransferTimeout: 10,
    tokenLimit: 300,
    transfersEnabled: false
  },
});
```

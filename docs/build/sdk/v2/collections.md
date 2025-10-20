# Collections

[[toc]]

## Intro

NFTs have become much easier to issue, and we're seeing increasing amounts minted daily, mainly through NFT collections. This article will dive into NFT collection minting and some popular examples of how to work with NFT collections in Unique Network.

As the name implies, an NFT collection is a unique collection of NFTs. NFT artworks are generally created on a smaller scale with the involvement of concerned content creators or digital artists. In addition, you would also notice that individual NFT artworks are available for sale on different NFT marketplaces.

In Unique Network, the collection has the following entities:

- **name** - a collection name that defines it in the global scope;
- **description** - some additional details about the collection;
- **token prefix** - short string value that will be added to token IDs.
- **properties** - a unique set of keys and values which defines collection specifics;
- **limits** - a set that defines the rules for a collection, e.g., whether it can be transferred or how many tokens you can mint in it;
- **owner** - an address that created a collection (or if the collection was transferred, the address that owns the collection at the moment);
- **admins** - a collection can be controlled by multiple admin addresses. Admins can issue and burn NFTs, as well as add and remove other admins, but they cannot change NFT or collection ownership;

## Creating a collection

Below is an (almost) minimum example. Only collection `name`, `description`, and `symbol` are mandatory fields. They exist at the collection level and cannot be overridden.

```ts:no-line-numbers
const collectionTx = await unique.collection.create({
 name: "Test",
 description: "Test collection",
 symbol: "TST",
 info: {cover_image: {url: 'https://gateway.pinata.cloud/ipfs/QmTkhTg5S5zrqJL3UsKtyiFi8fcMT3Cao9uKtadp3Ckh7m'}},
});

console.log("Collection ID:", collectionTx.result.collectionId);
```

**Field constraints:**

- `name` - maximum 64 bytes
- `description` - maximum 256 bytes
- `symbol` (tokenPrefix) - maximum 16 bytes

In Unique Network every collection has a unique collection ID. You will need it later to [mint NFTs](./tokens.md).

You can check your collection successfully created on [Unique Scan](https://uniquescan.io/opal/collections/).

## Collection modes

There are three different collection modes in Unique Network:

- **NFT (default)** - Non-Fungible Tokens are unique digital assets with distinct properties and metadata. Each token is one-of-a-kind and cannot be replaced with another token. ERC-721 compatible.
- **Fungible** - Fungible tokens are identical and interchangeable, like traditional currencies. Each token has the same value and properties as any other token in the collection. ERC-20 compatible.
- **ReFungible** - Re-Fungible Tokens allow fractional ownership by dividing a single NFT into multiple fungible shares, enabling multiple people to own portions of the same unique asset.

You can specify the mode of collection during creation:

```ts:no-line-numbers
await unique.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  info: {cover_image: {url: coverImage}},
  mode: 'Fungible' // <--- set collection mode here
});
```

## Collection properties

Every collection in Unique Network can have up to 64 properties—a unique set of keys and values that define collection specifics. Some of them relate to NFT metadata and are set automatically by SDK.

### Property constraints

Collections can have up to **64 properties** with a combined maximum size of **40kB** for all keys and values.

### Setting collection properties

During the collection creation, you can set collection properties as follows:

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

### Now, let's query our collection and check its properties

```ts:no-line-numbers
const collection = await sdk.collection.get({collectionId: result.collectionId});

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
- The SDK sets' properties `schemaName`, `schemaVersion`, and `collectionInfo` and relate to the Unique metadata. You can read more about [Unique Metadata Format](./metadata-reference.md) in the reference section.

## Token property permissions

Every NFT token inside the collection can have properties. The list of allowed properties and their mutability permissions are handled on the collection level.

Token property permissions define two main aspects:

- Which properties tokens can have (maximum 64 properties per token)
- Who can set or change these properties

### Permission structure

Each property permission has three fields:

- **`mutable`** - Whether the property can be changed after token creation
- **`collectionAdmin`** - Whether collection admins can set this property
- **`tokenOwner`** - Whether the token owner can set this property

### Common permission patterns

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  tokenPropertyPermissions: [
    // Admin-set immutable property (e.g., rarity)
    {key: 'rarity', permission: {mutable: false, collectionAdmin: true, tokenOwner: false}},

    // Owner-only mutable property (e.g., nickname)
    {key: 'nickname', permission: {mutable: true, collectionAdmin: false, tokenOwner: true}},

    // Admin and owner mutable property (e.g., level)
    {key: 'level', permission: {mutable: true, collectionAdmin: true, tokenOwner: true}},

    // Immutable, can only be set by owner once (e.g., initial customization)
    {key: 'customization', permission: {mutable: false, collectionAdmin: false, tokenOwner: true}},
  ]
});
```

**Pattern 1**: `{mutable: false, collectionAdmin: true, tokenOwner: false}`

- Only the collection admin can set this property during token creation
- Once set, it cannot be changed
- Use case: Immutable metadata like rarity tier or generation number

**Pattern 2**: `{mutable: true, collectionAdmin: true, tokenOwner: true}`

- Both admin and owner can set/modify the property anytime
- Most flexible option
- Use case: Game attributes that both players and game admins can modify

**Pattern 3**: `{mutable: true, collectionAdmin: false, tokenOwner: true}`

- Only the token owner can set or modify the property
- If admin mints to their own address, they can set it as the owner
- If admin mints to another address, only the recipient can set it
- Use case: Owner-controlled customization

**Pattern 4**: `{mutable: false, collectionAdmin: false, tokenOwner: true}`

- Token owner can set this property once (during or after minting)
- Once set, it becomes permanently immutable
- Use case: One-time choices or commitments

### Metadata properties

The SDK automatically adds properties related to the [Unique Metadata Format](./metadata-reference.md):

```ts:no-line-numbers
const collection = await sdk.collection.get({collectionId})

console.log(collection.tokenPropertyPermissions);
```

Important metadata properties include:

- **`tokenData`** - Container for all token attributes (see [NFT section](./tokens.md))
- **`URI`** - External metadata URI
- **`customizing_overrides`** - Customization data
- And others defined in the metadata schema

You can check more information about metadata properties in the [reference section](./metadata-reference.md).

## Nesting configuration

In Unique Network, tokens can own other tokens through a mechanism known as nesting. Nesting permissions must be configured at the collection level to enable tokens within a collection to serve as parent tokens. Additionally, it is possible to limit which collections are allowed to participate in nesting and define the roles that can execute this action.

```ts:no-line-numbers
const { result } = await sdk.collection.create({
  name: "Name",
  description: "Description",
  symbol: "SYM",
  permissions: { // <--- set nesting in the permissions section
    nesting: {
      collectionAdmin: true,
      tokenOwner: true,
      restricted: [1, 2],  // <--- restrict nesting for specific collections
    },
  },
});
```

Learn more about nesting tokens in the [NFT section](./tokens.md#nesting).

## Collection limits

Collections support various limits to control token ownership, transfers, and sponsoring behavior:

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
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

### Ownership and transfer limits

**`accountTokenOwnershipLimit`** - Maximum number of tokens that one address can own. Useful for ensuring fair distribution or limiting holdings per account.

**`ownerCanTransfer`** - When set to `true`, collection owner and admins can transfer or burn tokens owned by other users without approval. This gives privileged accounts automatic `transferFrom` and `burnFrom` capabilities.

**`ownerCanDestroy`** - When set to `true`, the collection owner can destroy the entire collection (only if it contains no tokens).

**`transfersEnabled`** - Global flag that controls whether token transfers between users are currently enabled. Set to `false` to freeze all transfers.

**`tokenLimit`** - Maximum total number of tokens that can be minted in this collection. Once reached, no more tokens can be created.

### Sponsoring limits

These limits control the [sponsoring](./sponsoring.md) feature, which allows gasless transactions:

**`sponsoredDataSize`** - Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode.

**`sponsoredDataRateLimit`** - Number of blocks that must pass between sponsored `setVariableMetadata` transactions.

**`sponsorTransferTimeout`** - Time interval in blocks defining how often a non-privileged user's transfer or mint transaction can be sponsored.

**`sponsorApproveTimeout`** - Time interval in blocks defining how often a non-privileged user's approve transaction can be sponsored.

## Collection permissions

Control who can mint tokens and enable nesting restrictions through the `permissions` parameter:

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  permissions: {
    access: 'AllowList',
    mintMode: true,
    nesting: {
      tokenOwner: true,
      collectionAdmin: true,
      restricted: [1, 2, 3]
    }
  }
});
```

### Access modes

**`access`** - Controls who can own and mint tokens:

- **`Normal`** (default) - No extra permissions or limitations. Anyone can own tokens, and minting follows standard collection admin rules.
- **`AllowList`** - Only accounts added to the allow list can own tokens. These accounts can also mint tokens if `mintMode` is set to `true`.

```ts:no-line-numbers
// Create allow-list collection
await sdk.collection.create({
  name: "Exclusive",
  description: "Allow-list only collection",
  symbol: "EXC",
  permissions: {
    access: 'AllowList'
  }
});

// Add addresses to allow list
await sdk.collection.addToAllowList({
  collectionId,
  addresses: [
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  ]
});
```

### Mint mode

**`mintMode`** - When set to `true` and `access` is `AllowList`, addresses in the allow list can mint tokens (in addition to collection admins).

```ts:no-line-numbers
await sdk.collection.create({
  name: "Community Minting",
  description: "Allow-list members can mint",
  symbol: "COM",
  permissions: {
    access: 'AllowList',
    mintMode: true  // Allow-list members can mint
  }
});
```

### Nesting permissions

Control which tokens can be nested and who can perform nesting operations:

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  permissions: {
    nesting: {
      tokenOwner: true,        // Token owners can nest their tokens
      collectionAdmin: true,   // Collection admins can nest tokens they own
      restricted: [1, 2, 3]    // Only allow nesting with specific collections
    }
  }
});
```

**`tokenOwner`** - When enabled, token owners can nest tokens they own. Tokens can be nested as long as they share a common owner, even if they belong to different collections.

**`collectionAdmin`** - When enabled, collection administrators can nest tokens they own into the collection's tokens. Admins can nest into tokens owned by anyone (owner or other administrators). When an administrator enables nesting, the collection owner implicitly receives nesting rights as well.

**`restricted`** - Limits which collections can participate in nesting. Accepts an array of collection IDs. When set, only tokens from the specified collections can be nested. This restriction applies to both owners and administrators.

```ts:no-line-numbers
// Example: Restrict nesting to specific collections
await sdk.collection.setPermissions({
  collectionId: 1,
  permissions: {
    nesting: {
      tokenOwner: true,
      restricted: [1, 5, 10]  // Only collections 1, 5, and 10 can nest
    }
  }
});

// Reset restriction to allow all collections
await sdk.collection.setPermissions({
  collectionId: 1,
  permissions: {
    nesting: {
      restricted: null  // Remove restrictions
    }
  }
});

// Disable nesting entirely
await sdk.collection.setPermissions({
  collectionId: 1,
  permissions: {
    nesting: {
      tokenOwner: false,
      collectionAdmin: false
    }
  }
});
```

## Querying collections

### Get collection by ID

Retrieve detailed information about a specific collection:

```ts:no-line-numbers
const collection = await unique.collection.get({
  collectionId: 1
});

console.log(collection);
```

#### Query options

You can control what data is included in the response:

```ts:no-line-numbers
const collection = await unique.collection.get({
  collectionId: 1,
  withAdmins: true,        // include admin addresses (default: true)
  withLimits: true,        // include collection limits (default: true)
  withLastTokenId: true,   // include last minted token ID (default: true)
  withTotalSupply: true    // include total token count (default: true)
});
```

### List all collections

Get a paginated list of all collections on the network:

```ts:no-line-numbers
const { collections, isLastPage } = await unique.collection.list({
  page: 1,
  limit: 10
});

collections.forEach(collection => {
  console.log(`${collection.collectionId}: ${collection.name}`);
});

if (!isLastPage) {
  // Fetch next page
  const nextPage = await unique.collection.list({
    page: 2,
    limit: 10
  });
}
```

### Get network statistics

Retrieve statistics about all collections:

```ts:no-line-numbers
const stats = await unique.collection.getAllCollectionStats();

console.log('Total collections created:', stats.created);
console.log('Collections destroyed:', stats.destroyed);
console.log('Total tokens across all collections:', stats.tokensCount);
```

### Get account's tokens in a collection

List all tokens owned by a specific account within a collection:

```ts:no-line-numbers
const tokens = await unique.collection.accountTokens({
  collectionId: 1,
  address: account.address
});

// Returns array of token IDs
tokens.forEach(({ collectionId, tokenId }) => {
  console.log(`Token ${collectionId}:${tokenId}`);
});
```

## Collection admin management

Collections can have multiple administrators who are privileged accounts with special permissions. Learn more about [roles and access rights](../../../reference/blockchain/owner-admin-roles.md).

### Admin capabilities

Collection admins can:

- Mint and burn tokens
- Add or remove other admins
- Modify collection properties
- Set token properties (if permitted by `tokenPropertyPermissions`)
- Transfer and burn tokens owned by others (if `ownerCanTransfer: true`)

Admins **cannot**:

- Change collection ownership
- Destroy the collection

### Adding an admin

```ts:no-line-numbers
await unique.collection.addAdmin({
  collectionId: 1,
  newAdmin: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});
```

### Removing an admin

```ts:no-line-numbers
await unique.collection.removeAdmin({
  collectionId: 1,
  adminToDelete: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});
```

### Viewing admins

You can retrieve the admin list when querying a collection:

```ts:no-line-numbers
const collection = await unique.collection.get({
  collectionId: 1,
  withAdmins: true  // Include admin list in response
});

console.log('Collection admins:', collection.admins);
```

## Transferring collection ownership

Transfer ownership of a collection to another account:

```ts:no-line-numbers
const result = await unique.collection.transferCollection({
  collectionId: 1,
  to: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
});
```

## Destroying a collection

Permanently delete a collection. This is only possible if:

- The collection has no tokens
- The caller is the collection owner
- The `ownerCanDestroy` limit is set to `true`

```ts:no-line-numbers
const result = await unique.collection.deleteCollection({
  collectionId: 1
});
```

## Sponsoring

In Unique Network, transactions with collections can be sponsored, allowing for a gasless experience where the sponsor covers the transaction fees. This enables seamless and cost-free transfers of NFTs and the execution of smart contracts, even for accounts without native tokens.

Setting sponsorship of a collection should be done in several steps.

### Setting collection sponsor

Firstly, we need to specify an account that will pay transaction fees.

```ts:no-line-numbers
await unique.collection.setSponsor({
  collectionId: 1,
  sponsor: alice.address
});
```

Secondly, the specified account should confirm sponsorship

```ts:no-line-numbers
await unique.collection.confirmSponsorship({ collectionId: 1 });
```

Finally, set sponsoring rate limits

```ts:no-line-numbers
await unique.collection.setLimits({
  collectionId: 1,
  limits: {
    sponsorApproveTimeout: 0,
    sponsorTransferTimeout: 0,
  },
});
```

### Checking sponsorship status

```ts:no-line-numbers
const collection = await unique.collection.get({ collectionId: 1 });

if (collection.sponsorship.isConfirmed) {
  console.log(`Sponsored by: ${collection.sponsorship.sponsor}`);
} else if (collection.sponsorship.isEnabled) {
  console.log('Sponsorship pending confirmation');
} else {
  console.log('No sponsorship');
}
```

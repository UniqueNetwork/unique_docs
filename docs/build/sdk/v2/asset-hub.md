# Asset Hub

The Unique SDK supports the Asset Hub, as well as the `uniques` and `nfts` pallets. You can use a [publicly available endpoint](../../../reference/sdk-endpoints.md) to interact with the Asset Hub:

```ts:no-line-numbers
import { AssetHub } from "@unique-nft/sdk";

const assetHub = AssetHub({
  baseUrl: "https://rest.unique.network/v2/westend-asset-hub",
  account,
});
```

After initialization, you can use the assetHub instance for RPC calls and sending transactions, such as working with balances:

```ts:no-line-numbers
...

// Retrieve the balance of an address
await assetHub.balance.get({
  address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
});

// Transfer tokens to another address
await assetHub.balance.transfer({
  amount: "10",
  isAmountInCoins: true,
  to: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
});
```

## Minting NFTs

Asset Hub supports two types of NFT pallets: `uniques` and `nfts`. You can create NFTs using either of them. However, note that the `uniques` pallet is deprecated, so it's recommended to use the `nfts` pallet for new projects.

### `nfts` pallet

First, we need to create a collection using the `nfts` pallet. 

<!-- TODO collection config should be optional -->

```ts:no-line-numbers
const collectionTx = await assetHub.nftsPallet.collection.create({
  collectionConfig: {
    maxSupply: 100,
    mintSettings: {
      // For more details, refer to the documentation:
      // https://wiki.polkadot.network/docs/learn-nft-pallets#creating-a-collection
    },
  },
});

const { collectionId, creator, owner } = collectionTx.result;
```

#### Creating an item

After creating a collection, you can mint individual NFT items within it.

```ts:no-line-numbers
const item = await assetHub.nftsPallet.item.mint({
  collectionId,
  itemId: 10,
  mintTo: bob.address,
  witnessData: {},
});
```

This code mints an NFT with itemId 10 and assigns it to `bob.address`.

#### Setting metadata and attributes

Enhance your NFTs by adding metadata and attributes.

```ts:no-line-numbers
await assetHub.nftsPallet.metadata.setForItem({ collectionId, itemId: 10, data: "QmRKs2ZfuwvmZA3QAWmCqrGUjV9pxtBUDP3wuc6iVGnjA2" });

await assetHub.nftsPallet.attributes.set({
  collectionId,
  itemId: 10,
  attribute: { key: "Key", value: "Value", namespace: "itemOwner" },
});
```

Metadata can include URLs to images or JSON files, while attributes can store additional key-value data relevant to the NFT.

#### Transfer and burn

You can transfer ownership of an NFT or burn it.

```ts:no-line-numbers
await assetHub.nftsPallet.item.transfer({collectionId, itemId, to: bob.address});

await assetHub.nftsPallet.item.burn({ collectionId, itemId });
```


### `uniques` pallet

:::warning
The Uniques Pallet is deprecated. Everything related to NFTs will be covered by the NFTs Pallet.

[https://wiki.polkadot.network/docs/learn-nft-pallets#uniques-pallet](https://wiki.polkadot.network/docs/learn-nft-pallets#uniques-pallet)
:::

#### Creating a collection

```ts:no-line-numbers
const collectionTx = await assetHub.uniquesPallet.collection.create({
  admin: account.address,
});

const collectionId = collectionTx.result.collectionId;
```

You can manage the collection using its `collectionId`:

```ts
// See existing roles: https://wiki.polkadot.network/docs/learn-nft-pallets#roles
await assetHub.nftsPallet.collection.setTeam({collectionId, admin, freezer, issuer});

await assetHub.nftsPallet.collection.setMaxSupply({
  collectionId,
  maxSupply: 300,
});

// ...
```

#### Creating an asset

Create an asset within the `collection`

```ts:no-line-numbers
const assetTx = await assetHub.uniquesPallet.asset.mint({
  collectionId: collectionTx.result.collectionId,
  assetId: 42,
  owner: account.address,
});

const assetId = assetTx.result.assetId;
```

#### Set asset metadata and attributes

Add metadata and attributes to your asset:

```ts:no-line-numbers
const metadataTx = await assetHub.uniquesPallet.attributes.setAssetMetadata({
  data: "http://example.com",
  assetId: assetId,
  collectionId: collectionId,
});
```

Note that the asset's metadata is mutable until the asset is frozen.

```ts:no-line-numbers
const attributeTx = await assetHub.uniquesPallet.attributes.setAssetAttribute(
  {
    collectionId,
    assetId,
    attribute: { key: "age", value: "18" },
  },
);
```

<!-- TODO asset should have freeze method -->

#### Get asset

Retrieve details of an asset using its collectionId and assetId:

```ts:no-line-numbers
const asset = await assetHub.uniquesPallet.asset.get({
  collectionId,
  assetId,
});
```

#### Transfer and burn

Transfer or burn the asset:


```ts:no-line-numbers
await assetHub.uniquesPallet.asset.transfer({ assetId, collectionId, newOwner: bob.address });
await assetHub.uniquesPallet.asset.burn({ assetId, collectionId });
```

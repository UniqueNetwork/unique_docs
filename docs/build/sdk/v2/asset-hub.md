# Asset Hub

Unique SDK supports `Asset Hub` as well as `uniques` and `nfts` pallets. You can use publicly available endpoint:

```ts:no-line-numbers
import { AssetHub } from "@unique-nft/sdk";

const assetHub = AssetHub({
  baseUrl: "https://rest.unique.network/v2/westend-asset-hub",
  account,
});
```

After initialization you can use it for RPC calls and sending transactions, such as working with balances:

```ts:no-line-numbers
...

await assetHub.balance.get({address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"});

await assetHub.balance.transfer({
  amount: "10",
  isAmountInCoins: true,
  to: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
});
```

## Minting NFTs

Asset Hub supports two types of NFT pallets – `uniques` and `nfts`. You can create NFT for both of them.

### `nfts` pallet

First, we need to create a collection.

<!-- TODO collection config should be optional -->

```ts:no-line-numbers
const collectionNfts = await sdk.nftsPallet.collection.create({
  collectionConfig: {},
});
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

#### Creating an asset

Use `collectionId` to create an asset.

```ts:no-line-numbers
const assetTx = await assetHub.uniquesPallet.asset.mint({
  collectionId: collectionTx.result.collectionId,
  assetId: 42,
  owner: account.address,
});

const assetId = assetTx.result.assetId;
```

#### Set asset metadata and attributes

Asset's metadata is mutable until asset is frozen.

Use `collectionId` and `assetId` to set asset metadata

```ts:no-line-numbers
const metadataTx = await assetHub.uniquesPallet.attributes.setAssetMetadata({
  data: "http://example.com",
  assetId: assetId,
  collectionId: collectionId,
});
```

You can also set asset attributes, representing key/value pair.

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

```ts:no-line-numbers
const asset = await assetHub.uniquesPallet.asset.get({
  collectionId,
  assetId,
});
```

#### Transfer and burn

```ts:no-line-numbers
await assetHub.uniquesPallet.asset.transfer({ assetId, collectionId, newOwner: bob.address });
await assetHub.uniquesPallet.asset.burn({ assetId, collectionId });
```

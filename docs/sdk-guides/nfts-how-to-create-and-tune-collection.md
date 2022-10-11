# NFTs. How to create and tune a collection.

To create NFT collection you need to have initialized SDK client. [Here](./examplesSDK.md) you can learn how to get it. Also there you can find how to get the signer address, that you'll need to sign collection creation transaction.

And for optional collection cover you'll need a _valid ipfs cid_ of your cover image. Read more about storing images, videos, etc [here](#todo).

## Simple collection creation

All you should know so far is that collection can be created using different schemas. For now we support three kinds of schemas:

```typescript
enum COLLECTION_SCHEMA_NAME {
  unique = "unique",
  old = "_old_",
  ERC721Metadata = "ERC721Metadata",
}
```

Actually you have two options, because you should NOT use **old** schema name because of it's deprecation.

Let's create simple collection with **unique** schema:

```typescript
import { Sdk } from "@unique-nft/substrate-client";
import {
  COLLECTION_SCHEMA_NAME,
  CreateCollectionNewArguments,
} from "@unique-nft/substrate-client/tokens";
import { UniqueCollectionSchemaToCreate } from "@unique-nft/api";

main() {
    // Create SDK client, get address
    ...

    // Get ipfs cid of collection cover
    ...

    // Create basic collection schema
    const collectionSchema: UniqueCollectionSchemaToCreate = {
        schemaName: COLLECTION_SCHEMA_NAME.unique,
        schemaVersion: "1.0.0",
        image: { urlTemplate: "some_url/{infix}.extension" },
        coverPicture: {
            ipfsCid: "<valid_ipfs_cid>",
        },
    };

    // Fill up required arguments
    const args: CreateCollectionNewArguments = {
        address: "<valid_address>",
        name: "My simple collection",
        description: "I've created my first NFT collection!",
        tokenPrefix: "MSC",
        schema: collectionSchema,
    };

    const result = await sdk.collections.creation.submitWaitResult(args);

    const { isCompleted } = result;

    if (isCompleted) {
        const {
            parsed: { collectionId },
        } = result;

        console.log(`Created new collection with id ${collectionId}`);
    } else {
        const {
            submittableResult: { dispatchError },
        } = result;

        console.warn("Something went wrong: ", dispatchError);
    }
}

main();

```

### Arguments for sdk.collections.creation method:

**address** - The address of the collection owner

**name** - Collection name (text, up to 64 characters)

**description** - Collection description (text, up to 256 characters)

**mode** - The collection type (Nft, Fungible, or ReFungible)

**tokenPrefix** - Token prefix (text, up to 4 characters)

**sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.

**limits** - Collection limits

**metaUpdatePermission** - Permission for update meta (ItemOwner, Admin, None)

**permissions** - Collection permissions

**schema** - Collection schema

## Tune collection

Your NFT collection have a bunch of various properties such as limits, permissions, token attributes and some others. Some of them you can set only while collection creation, but others you can set up later, when your collection is already created.

_#### todo: А это так? Например атрибуты токенов же можно задать только в момент создания? Может указать конкретный список свойств с указанием что можно перезадать, что нельзя? Где взять этот список?_

[Here](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/collection) you can see the list of SDK methods, that you can use to tune your collection.

Let's for example update collection limits using _sdk.collections.setLimits_ method. The method sets some collection limits and starts enforcing them immediately. By the way, only collection owner has permission to call this method.

```typescript
import "@unique-nft/substrate-client/tokens";
import { SetCollectionLimitsArguments } from "@unique-nft/substrate-client/tokens/types";

const limitsArgs: SetCollectionLimitsArguments = {
  address: "<your account address>",
  collectionId: "<ID of the collection>",
  limits: {
    accountTokenOwnershipLimit: 1000,
    sponsoredDataSize: 1024,
    sponsoredDataRateLimit: 30,
    tokenLimit: 1000000,
    sponsorTransferTimeout: 6,
    sponsorApproveTimeout: 6,
    ownerCanTransfer: false,
    ownerCanDestroy: false,
    transfersEnabled: false,
  },
};
const setResult = await sdk.collections.setLimits.submitWaitResult(limitsArgs);
const {
  parsed: { collectionId, limits },
} = result;
```

The complete list of sdk.collections module you can check right [in the sources](https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/substrate-client/tokens/sdk-collections.ts) of @unique/substrate-client package (See _SdkCollections_ class definition), or exploring tree of docs in the _UniqueNetwork/unique-sdk_ GitHub [repo](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens).

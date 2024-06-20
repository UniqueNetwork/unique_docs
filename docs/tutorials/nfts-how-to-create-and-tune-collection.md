# How to create and setup a collection

To create an NFT collection, you need to initialize the SDK client. You can learn how to to do this in this [article](../sdk/installation.md). Also, you can learn how to get the signer address there, that you'll need to sign a collection creation transaction.

And, you'll need a _valid ipfs cid_ of your cover image. Read more about storing images, videos, etc. [here](./store-files.md).

### Create a simple collection

Please keep in mind that collections can be created using different schemas. At the moment, we support three schemas:

```typescript:no-line-numbers
enum COLLECTION_SCHEMA_NAME {
  unique = "unique",
  old = "_old_",
  ERC721Metadata = "ERC721Metadata",
}
```

In fact, you have only two available options, because we strongly do not recommend using the `_old_` schema, because it is already deprecated.

So, let's create a simple collection using the `unique` schema:

```typescript:no-line-numbers
import Sdk from "@unique-nft/substrate-client";
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

    const result = await sdk.collection.create.submitWaitResult(args);

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

**Arguments for the `sdk.collection.create` method**:

`address` - the address of the collection owner.

`name` - the collection name (text value up to 64 characters).

`description` - the collection description (text value up to 256 characters).

`mode` - the collection type (NFT, Fungible, or ReFungible).

`tokenPrefix` - the token prefix (text value up to 4 characters).

`sponsorship` - this field defines whether a sponsorship is enabled and which address is the current collection sponsor.

`limits` - the collection limits.

`metaUpdatePermission` - the permission to update metadata (ItemOwner, Admin, None).

`permissions` - the collection permissions.

`schema` - the collection schema.

## Setup a collection

Your NFT collection have a bunch of various properties such as limits, permissions, token attributes and some others. Some of them you can set only while collection creation, but others you can set up later, when your collection is already created.

<!---
_#### todo: А это так? Например атрибуты токенов же можно задать только в момент создания? Может указать конкретный список свойств с указанием что можно перезадать, что нельзя? Где взять этот список?_
_#### todo: 
-->

You can find the list of SDK methods, that you can use to adjust your collection [here](../sdk/methods.md#collection).

For example, let's update the collection limits using `sdk.collection.setLimits` method. The method sets some collection limits and starts enforcing them immediately. By the way, only the collection owner has the permission to call this method.

```typescript:no-line-numbers
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

const setResult = await sdk.collection.setLimits.submitWaitResult(limitsArgs);
const {
  parsed: { collectionId, limits },
} = result;
```

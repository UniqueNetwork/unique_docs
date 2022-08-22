# SDK Methods 

# Table of Contents 

- [Get account tokens of the collection](#get-account-tokens-of-the-collection) 
- [Add collection admin](#add-collection-admin) 
- [Add To Allow List](#add-to-allow-list) 
- [Adminlist](#adminlist) 
- [Allow list](#allow-list) 
- [Get allowance](#get-allowance) 
- [Check is allowed](#check-is-allowed) 
- [Approve](#approve) 
- [Destroys a concrete instance of NFT](#destroys-a-concrete-instance-of-nft) 
- [Get collection by Id](#get-collection-by-id) 
- [Get collection by Id (new)](#get-collection-by-id-(new)) 
- [Collection properties](#collection-properties) 
- [Collection tokens](#collection-tokens) 
- [Confirm sponsorship of collection](#confirm-sponsorship-of-collection) 
- [Create collection](#create-collection) 
- [Create collection (new)](#create-collection-(new)) 
- [Create token (new)](#create-token-(new)) 
- [Create token (new)](#create-token-(new)) 
- [Delete collection properties](#delete-collection-properties) 
- [Delete token properties](#delete-token-properties) 
- [Destroy collection](#destroy-collection) 
- [Get effective limits by collection ID](#get-effective-limits-by-collection-id) 
- [Get collection stats](#get-collection-stats) 
- [Get last generated token id](#get-last-generated-token-id) 
- [Nest token](#nest-token) 
- [Get number of blocks when sponsored transaction is available](#get-number-of-blocks-when-sponsored-transaction-is-available) 
- [Property permissions](#property-permissions) 
- [Remove collection admin](#remove-collection-admin) 
- [Remove sponsor of collection](#remove-sponsor-of-collection) 
- [Remove an address from allow list](#remove-an-address-from-allow-list) 
- [Set collection limits](#set-collection-limits) 
- [Set collection permissions](#set-collection-permissions) 
- [Set collection properties](#set-collection-properties) 
- [Set sponsor of collection](#set-sponsor-of-collection) 
- [Set token properties](#set-token-properties) 
- [Set token property permissions](#set-token-property-permissions) 
- [Set transfers enabled flag](#set-transfers-enabled-flag) 
- [Get token](#get-token) 
- [Token children](#token-children) 
- [Checks if token exists in collection](#checks-if-token-exists-in-collection) 
- [Get token owner](#get-token-owner) 
- [Token parent](#token-parent) 
- [Token properties](#token-properties) 
- [Topmost token owner](#topmost-token-owner) 
- [Transfer token](#transfer-token) 
- [Change the owner of the collection](#change-the-owner-of-the-collection) 
- [Unnest token](#unnest-token) 

## Get account tokens of the collection

Returns array of tokens, owned by address

#### Arguments

- **collectionId** - ID of collection
- **address** - address of tokens owner

#### Returns

Method returns array of objects with properties:

- **collectionId** - Collection id
- **tokenId** - Token id

#### Examples

```typescript
const accountTokens = await sdk.tokens.getAccountTokens({
  collectionId: 1,
  address: '<address>',
});

const [{ tokenId, collectionId }, ...restTokens] = accountTokens;
```

## Add collection admin

#### Arguments

- **address** - Signer address
- **collectionId** - Collection id
- **newAdmin** - New admin address

#### Returns

The method returns an `CollectionAdminAdded` event.

#### Examples

```ts
import { AddCollectionAdminArguments } from '@unique-nft/sdk/tokens';

const args: AddCollectionAdminArguments = {
  address: '<address>',
  collectionId: 1,
  newAdmin: '<address>',
};

const result = await sdk.collections.addAdmin.submitWaitResult(args);

console.log(result.parsed);
```

## Add To Allow List

Adds an address to allow list of a collection.

#### Arguments

- **address** - Sender address
- **collectionId** - an ID of the collection which will be affected
- **newAdminId** - the address to be added to the allow list

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, address: string`.

#### Examples

```typescript
import { AddToAllowListArguments } from '@unique-nft/sdk/tokens/types';

const addToAllowListArgs: AddToAllowListArguments = {
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    newAdminId: '<valid address>'
};

const { parsed } = await sdk.collections.addToAllowList.submitWaitResult(addToAllowListArgs);
const { collectionId, address } = parsed;
```

## Adminlist

Get array of collection admins

#### Arguments

- **collectionId** - ID of token collection

#### Returns

Method return an array of accounts

#### Examples

```ts
import {
  AdminlistArguments,
  AdminlistResult,
} from '@unique-nft/sdk/tokens/types';

const args: AdminlistArguments = {
  collectionId: 1,
};

const result: AdminlistResult = await sdk.collections.admins(args);
```

## Allow list

Gets the addresses that are in to allow list for the specified collection.

#### Arguments

- **collectionId** - an ID of the collection which will be checked
- **hash** _optional_ - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

#### Returns

The method returns an object containing array string addresses.

#### Examples

```typescript
import { AllowListArguments } from '@unique-nft/sdk/tokens/types';

const allowListArgs: AllowListArguments = {
    collectionId: '<ID of the collection>', 
    hash: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const addresses = await sdk.collections.allowList(allowListArgs);
```

## Get allowance

Get the amount of token pieces approved to transfer

#### Arguments

- **from** - address from
- **to** - address to
- **collectionId** - ID of collection
- **tokenId** - ID of token

#### Returns

Method returns object:

- **isAllowed** - boolean

#### Examples

```typescript
const { isAllowed } = await sdk.tokens.allowance({
  from: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
});
```

## Check is allowed

Check if a user is allowed to use a collection. Returns true or false.

#### Arguments

- **collectionId** - ID of collection
- **account** - Account address
- **blockHashAt** _optional_ - hash of execution block

#### Returns

Method returns object:

- **isAllowed** - boolean

#### Examples

```typescript
const { isAllowed } = await sdk.collection.allowed({
  collectionId: 1,
  account: '<address>',
});
```

## Approve

Set, change, or remove approved address to transfer the ownership of the token. The Amount value must be between 0 and owned amount or 1 for NFT.

#### Arguments

- **spender** - Address that is approved to transfer this token
- **collectionId** - Collection id
- **tokenId** - Token id
- **amount** - Must be true (for approval) or false (for disapproval)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, tokenId: number`.

#### Examples

```typescript
import { ApproveArguments } from '@unique-nft/sdk/tokens/types';

const approveArgs: ApproveArguments = {
    spender: '<Account address for whom token will be approved>',
    collectionId: '<ID of the collection>',
    tokenId: '<ID of the token>',
    amount: true
};

const result = await sdk.tokens.approve.submitWaitResult(approveArgs);
const { collectionId, tokenId } = result.parsed;
```

## Destroys a concrete instance of NFT

#### Arguments

- **address*** - Sender address
- **collectionId*** - ID of the collection
- **from** - Address that owns token
- **tokenId*** - ID of NFT to burn
- **value** - amount to burn
  - non-fungible mode: `ignored` (only the whole token can be burned)
  - fungible mode: `must specify` transferred amount
  - re-fungible mode: `ignored` (the owned portion is burned completely)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, tokenId: number, address: string, value: number`.

#### Examples

```ts
import '@unique-nft/sdk/tokens';
import { BurnTokenArguments } from '@unique-nft/sdk/tokens/types';
const burnItemArgs: BurnTokenArguments = {
  tokenId: 1,
  collectionId: 1,
};
const setResult = await sdk.tokens.burn.submitWaitResult(burnItemArgs);
const { collectionId, tokenId, address, value } = setResult.parsed;
```

## Get collection by Id

Returns collection info in human format.

#### Arguments

- **collectionId** - ID of collection

#### Returns

Method return collection info:

- **id** - Collection id
- **owner** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **properties** - [Collection properties](#todo)
- **permissions** - [Collection permissions](#todo)
- **tokenPropertyPermissions** - [Collection tokens permissions](#todo)

#### Examples

```typescript
import { CollectionIdArguments, CollectionInfo } from '@unique-nft/sdk/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };
const collection: CollectionInfo = await sdk.collections.get(getCollectionArgs);
```

## Get collection by Id (new)

Returns collection info (with Unique schema)

#### Arguments

- **collectionId** - Id of collection

#### Returns

Method return collection info:

- **id** - Collection id
- **owner** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **readOnly** - collection is read only
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **permissions** - [Collection permissions](#todo)
- **schema** - [Collection schema](#todo)
- **properties** - [Collection properties](#todo)

#### Examples

```typescript
const collection = await sdk.collections.get_new({ collectionId: 2 });

const { id, owner, name, description, mode, tokenPrefix, schema } = collection;
```

## Collection properties

Get array of collection properties

#### Arguments

- **collectionId** - Collection ID
- **propertyKeys** _optional_ - Array of property keys

#### Returns

Method return an array of properties `{ key: string, value: string }`

#### Examples

```ts
import {
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
} from '@unique-nft/sdk/tokens/types';

const args: CollectionPropertiesArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: CollectionPropertiesResult = await sdk.collections.properties(
  args,
);
```

## Collection tokens

Get tokens contained within a collection

#### Arguments

- **collectionId** - Collection ID

#### Returns

Method returns array of tokenIds contained within passed collection.

#### Examples

```ts
import { CollectionTokensResult } from '@unique-nft/sdk/tokens/types';

const result: CollectionTokensResult = await sdk.collections.tokens({
  collectionId: 1,
});
```

## Confirm sponsorship of collection

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, sponsor: string`.

#### Examples

```typescript
import { ConfirmSponsorshipArguments } from '@unique-nft/sdk/tokens/types';

const confirmArgs: ConfirmSponsorshipArguments = {
  address: '<Account address of owner of collection>',
  collectionId: '<ID of the collection>',
};

const result = await sdk.collections.confirmSponsorship.submitWaitResult(confirmArgs);
const { collectionId, sponsor } = result.parsed;
```

## Create collection

#### Arguments

- **address** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **properties** - [Collection properties](#todo)
- **permissions** - [Collection permissions](#todo)
- **tokenPropertyPermissions** - [Collection tokens permissions](#todo)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number`.

#### Examples

```typescript
import { CreateCollectionArguments } from '@unique-nft/sdk/types';
const createArgs: CreateCollectionArguments = {
  address: '<your account address>',
  name: `FOO`,
  description: 'BAR',
  tokenPrefix: 'BAZ',
  properties: {},
};
const createResult = await sdk.collections.creation.submitWaitResult(createArgs);
const { collectionId } = createResult.parsed;
const collection = await sdk.collections.get({ collectionId });
```

## Create collection (new)

#### Arguments

- **address** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **permissions** - [Collection permissions](#todo)
- **schema** - [Collection schema](#todo)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number`.

#### Examples

```typescript
import {
    UniqueCollectionSchemaToCreate,
    CollectionSchemaName,
    AttributeType,
    AttributeKind,
    CreateCollectionNewArguments,
} from '@unique-nft/sdk/tokens';

const collectionSchema: UniqueCollectionSchemaToCreate = {
    schemaName: COLLECTION_SCHEMA_NAME.unique,
    schemaVersion: '1.0.0',
    attributesSchemaVersion: '1.0.0',
    attributesSchema: {
        image: { urlTemplate: 'some_url/{infix}.extension' },
        '0': {
            name: 'just_string_attribute',
            type: AttributeType.string,
            kind: AttributeKind.freeValue,
        },
    },
    coverPicture: {
        ipfsCid: '<valid_ipfs_cid>',
    },
};

const createArgs: CreateCollectionArguments = {
  address: '<your account address>',
  name: `FOO`,
  description: 'BAR',
  tokenPrefix: 'BAZ', 
  schema: collectionSchema,
};

const createResult = await sdk.collections.creation_new.submitWaitResult(createArgs);
const { collectionId } = createResult.parsed;

const collection = await sdk.collections.get({ collectionId });
```

## Create token (new)

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **owner** - The address of token owner (optional)
- **data.image** - Token image (`url`, `urlInfix` or `ipfsCid`)
- **data.encodedAttributes** - Token attributes

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, tokenId: number`.

#### Examples

```typescript
import { CreateTokenNewArguments } from '@unique-nft/sdk/tokens/types';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
} from '@unique-nft/sdk/tokens';

const createTokenArgs: CreateTokenNewArguments = {
    address: '<your account address>',
    collectionId: 123,
    data: {
        encodedAttributes: {
            '0': 0,
            '1': [0],
            '2': 'foo_bar',
        },
        image: {
            ipfsCid: '<valid_ipfs_cid>',
        },
    },
};

const result = await sdk.tokens.create_new.submitWaitResult(createArgs);
const { collectionId, tokenId } = result.parsed;

const token = await sdk.tokens.get_new({ collectionId, tokenId });
```

## Create token (new)

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **owner** - The address of token owner (optional)
- **data[i].image** - Token image (`url`, `urlInfix` or `ipfsCid`)
- **data[i].encodedAttributes** - Token attributes

#### Returns

The method returns an array of `parsed` objects that contains `collectionId: number, tokenId: number`.

#### Examples

```typescript
import { CreateTokensArguments } from '@unique-nft/sdk/tokens';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
} from '@unique-nft/sdk/tokens';

const createTokenArgs: CreateTokenNewArguments = {
    address: '<your account address>',
    collectionId: 123,
    data: [{
        encodedAttributes: {
            '0': 0,
            '1': [0],
            '2': 'foo_bar',
        },
        image: {
            ipfsCid: '<valid_ipfs_cid>',
        },
    }],
};

const result = await sdk.tokens.createMultiple.submitWaitResult(createArgs);
const [{ collectionId, tokenId }] = result.parsed;

const token = await sdk.tokens.get_new({ collectionId, tokenId });
```

## Delete collection properties

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **propertyKeys** - Array of properties keys

#### Returns

The method returns an array of `CollectionPropertyDeleted` events.

#### Examples

```ts
const args: DeleteCollectionPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  propertyKeys: ['foo', 'bar'],
};

const result = await sdk.collections.deleteProperties.submitWaitResult(args);

console.log(result.parsed);
```

## Delete token properties

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **tokenId** - Token id
- **propertyKeys** - Array of properties keys

#### Returns

The method returns an array of `TokenPropertyDeleted` events.

```ts
const args: DeleteTokenPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  tokenId: 1,
  propertyKeys: ['foo', 'bar'],
};

const result = await sdk.tokens.deleteProperties.submitWaitResult(args);

console.log(result.parsed);
```

## Destroy collection

Destroys collection if no tokens within this collection

#### Arguments

- **address** - Owner of collection
- **collectionId** - Collection id

#### Returns

The method returns a `parsed` object that contains the `success: boolean`.

#### Examples

```typescript
import { DestroyCollectionArguments } from '@unique-nft/sdk/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
const { success } = result.parsed;
```

## Get effective limits by collection ID

By default, the collection limit is not set (their value is null).
This limit value can be seen when requesting a collection using [Get collection by ID](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/collection-by-id) method.
If the limit is not set by the user, then the default limit is actually applied to the collection.
The values of the limits actually applied to the collection (default and user-set) can be obtained using `Get effective limits` by collection ID.

#### Arguments

- **collectionId** - ID of collection

#### Returns

Method return collection info:

- **id** - Collection id
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/set-collection-limits#arguments)
#### Examples

```typescript
import { CollectionIdArguments, GetCollectionLimitsResult } from '@unique-nft/sdk/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };
const collection: CollectionInfo = await sdk.collections.getLimits(getCollectionArgs);
```

## Get collection stats

Returns blockchain collection statistics.

#### Arguments

No arguments required.

#### Returns

Blockchain collection stats:

- **created** - The number of total collections created
- **destroyed** - The number of destroyed collections
- **alive** - The number of collections that are still alive

#### Examples

```typescript
import { GetStatsResult } from '@unique-nft/sdk/types';

const stats: GetStatsResult | null = await sdk.collections.getStats();
```

## Get last generated token id

#### Arguments

- **collectionId** - ID of collection

#### Returns

Method return last generated token id.

- **tokenId** - id of token

#### Examples

```typescript
import { LastTokenIdArguments, LastTokenIdResult } from '@unique-nft/sdk/types';
const args: LastTokenIdArguments = {
  collectionId: 1,
};
const lastTokenIdResult: LastTokenIdResult = await sdk.collections.lastTokenId(args);
```

## Nest token

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

#### Arguments

- **address** - Owner address
- **parent** - Parent token object `{ collectionId: number, tokenId: number }`
- **nested** - Nested token object `{ collectionId: number, tokenId: number }`

#### Returns

The method returns a `parsed` object that contains `{ collectionId: number, tokenId: number }`

#### Examples

```ts
import { NestTokenArguments } from '@unique-nft/sdk/tokens/types';

const args: NestTokenArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
};

const result = await sdk.tokens.nestToken.submitWaitResult(args);

const { tokenId, collectionId } = result.parsed;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully nested`,
);
```

## Get number of blocks when sponsored transaction is available

Returns number of block or none string.

#### Arguments

- **address** - Substrate or Ethereum address
- **collectionId** - ID of collection
- **tokenId** - ID of token

#### Returns

Method return number of blocks or none string.

- **blockNumber** - Number of token

#### Examples

```typescript
import { NextSponsoredArguments, NextSponsoredResult } from '@unique-nft/sdk/types';
const getSponsoredArgs: NextSponsoredArguments = {
  address: '<your address>',
  collectionId: 1,
  tokenId: 1,
};
const nextSponsoredResult: NextSponsoredResult = await sdk.collections.nextSponsored(getSponsoredArgs);
```

## Property permissions

Get array of collection property permissions

#### Arguments

- **collectionId** - Collection ID
- **propertyKeys** _optional_ - Array of property keys

#### Returns

Method return an array of property permissions `{ key: string, permission: { mutable: boolean, collectionAdmin: boolean, tokenOwner: boolean } }`

#### Examples

```ts
import {
  PropertyPermissionsArguments,
  PropertyPermissionsResult,
} from '@unique-nft/sdk/tokens/types';

const args: PropertyPermissionsArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: PropertyPermissionsResult =
  await sdk.collections.propertyPermissions(args);
```

## Remove collection admin

#### Arguments

- **address** - Signer address
- **collectionId** - Collection id
- **accountId** - Admin address

#### Returns

The method returns an `CollectionAdminRemoved` event.

#### Examples

```ts
import { RemoveCollectionAdminArguments } from '@unique-nft/sdk/tokens';

const args: RemoveCollectionAdminArguments = {
  address: '<address>',
  collectionId: 1,
  accountId: '<address>',
};

const result = await sdk.collections.removeAdmin.submitWaitResult(args);

console.log(result.parsed);
```

## Remove sponsor of collection

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id

#### Returns

The method returns a `parsed` object that contains the `collectionId: number`.

#### Examples

```typescript
import { RemoveCollectionSponsorArguments } from '@unique-nft/sdk/tokens/types';

const removeArgs: SetCollectionSponsorArguments = {
  address: '<Account address of owner of collection>',
  collectionId: '<ID of the collection>',
};

const result = await sdk.collections.removeCollectionSponsor.submitWaitResult(removeArgs);
const { collectionId } = result.parsed;
```

## Remove an address from allow list

#### Arguments

- **address** - Sender address
- **collectionId** - an ID of the collection which will be affected
- **addressToDelete** - the address to be removed from the allow list

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, address: string`.

#### Examples

```typescript
import { RemoveFromAllowListArguments } from '@unique-nft/sdk/tokens/types';

const removeFromAllowListArgs: RemoveFromAllowListArguments = {
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    addressToDelete: '<valid address>'
};

const { parsed } = await sdk.collections.removeFromAllowList.submitWaitResult(removeFromAllowListArgs);
const { collectionId, address } = parsed;
```

## Set collection limits

#### Arguments

- **address** - The address of collection owner
- **collectionId** - ID of the collection to set limits for
- **limits** - [the effective limits of the collection](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/effective-collection-limits). List of optional fields:
  - **accountTokenOwnershipLimit** - Maximum number of tokens that one address can own
  - **sponsoredDataSize** - Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode
  - **sponsoredDataRateLimit** - Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored
  - **tokenLimit** - Total amount of tokens that can be minted in this collection
  - **sponsorTransferTimeout** - Time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored
  - **sponsorApproveTimeout** - Time interval in blocks that defines once per how long a non-privileged user approve transaction can be sponsored
  - **ownerCanTransfer** - Boolean value that tells if collection owner or admins can transfer or burn tokens owned by other non-privileged users
  - **ownerCanDestroy** - Boolean value that tells if collection owner can destroy it
  - **transfersEnabled** - Flag that defines whether token transfers between users are currently enabled 

#### Returns

The method returns a `parsed` object that contains the `collectionId: number`.

#### Examples

```typescript
import '@unique-nft/sdk/tokens';
import { SetCollectionLimitsArguments } from '@unique-nft/sdk/tokens/types';
const limitsArgs: SetCollectionLimitsArguments = {
  address: '<your account address>',
  collectionId: '<ID of the collection>',
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
  }
};
const setResult = await sdk.collections.setLimits.submitWaitResult(limitsArgs);
const { collectionId, limits } = setResult.parsed;
```

## Set collection permissions

Sets onchain permissions for collection

#### Arguments

- **address** - Owner address
- **collectionId** - Collection id
- **permissions** - Struct that contains the permissions for a collection
  - **access**
  - **mintMode**
  - **nesting**
    - **tokenOwner**
    - **collectionAdmin**
    - **restricted**

#### Returns

The method returns a `parsed` object that contains the `{ collectionId: number }`.

#### Examples

```ts
import {
  SetCollectionPermissionsArguments,
  CollectionAccess,
} from '@unique-nft/sdk/tokens';

const args: SetCollectionPermissionsArguments = {
  address: account.address,
  collectionId,
  permissions: {
    access: CollectionAccess.Normal,
    mintMode: true,
    nesting: {
      collectionAdmin: true,
      tokenOwner: true,
    },
  },
};

const result = await sdk.collections.setPermissions.submitWaitResult(args);

console.log(
  `Collection #${result.parsed.collectionId} permissions successfully updated`,
);
```

## Set collection properties

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **properties** - Array of properties `{ key: string, value: string }`

#### Returns

The method returns an array of `CollectionPropertySet` events.

#### Examples

```ts
const args: SetCollectionPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  properties: [
    {
      key: 'foo',
      value: 'bar',
    },
  ],
};

const result = await sdk.collections.setProperties.submitWaitResult(args);

console.log(result.parsed);
```

## Set sponsor of collection

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **newSponsor** - The address of new sponsor of the collection

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, sponsor: string`.

#### Examples

```typescript
import { SetCollectionSponsorArguments } from '@unique-nft/sdk/tokens/types';

const setSponsorArgs: SetCollectionSponsorArguments = {
    address: '<Account address of owner of collection>',
    collectionId: '<ID of the collection>',
    newSponsor: '<Account addres of new sponsor>',
};

const result = await sdk.collections.setCollectionSponsor.submitWaitResult(setSponsorArgs);
const { collectionId, sponsor } = result.parsed;
```

## Set token properties

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **tokenId** - Token id
- **properties** - Array of properties `{ key: string, value: string }`

#### Returns

The method returns an array of `TokenPropertySet` events.

#### Examples

```ts
const args: SetTokenPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  tokenId: 1,
  properties: [
    {
      key: 'foo',
      value: 'bar',
    },
  ],
};

const result = await sdk.tokens.setProperties.submitWaitResult(args);

console.log(result.parsed);
```

## Set token property permissions

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **propertyPermissions** - Array of property permissions `{ key: string, permission: { mutable: boolean, collectionAdmin: boolean, tokenOwner: boolean } }`

#### Returns

The method returns an array of `PropertyPermissionSet` events.

#### Examples

```ts
const args: SetTokenPropertyPermissionsArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  propertyPermissions: [
    {
      key: 'foo',
      permission: {
        mutable: true,
        collectionAdmin: true,
        tokenOwner: true,
      },
    },
  ],
};

const result =
  await sdk.collections.setTokenPropertyPermissions.submitWaitResult(args);

console.log(result.parsed);
```

## Set transfers enabled flag

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **isEnabled** - New flag value

#### Permission

- Collection Owner

#### Returns

Enable / disable transfers for particular collection

#### Examples

```ts
import { SetTransfersEnabledArguments } from '@unique-nft/sdk/tokens/types';
 
const args: SetTransfersEnabledArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  isEnabled: true,
};

const result = await sdk.collections.setTransfersEnabled.submitWaitResult(args);

console.log(result.parsed.success);
```

## Get token

Returns token info and attributes

#### Arguments

- **collectionId** - Collection Id
- **tokenId** - Token Id

#### Returns

The method returns token info:

- **collectionId** - Collection Id
- **tokenId** - Token Id
- **owner** - The address of token owner
- **image** - Token image (`url`, `urlInfix` or `ipfsCid`)
- **attributes** - Token attributes
- **parent** - if token is nested contains *collectionId* and *tokenId* of the parent token

#### Examples

```typescript
const token = await sdk.tokens.get_new({
  collectionId: 2,
  tokenId: 1,
});
    
const {
    collectionId,
    tokenId,
    owner,
    image,
    attributes,
} = token;
```

## Token children

Get array of nested tokens

#### Arguments

- **collectionId** - ID of token collection
- **tokenId** - ID of token

#### Returns

Method return an array of tokens `{ collectionId: number, tokenId: number }`

#### Examples

```ts
import {
  TokenChildrenArguments,
  TokenChildrenResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenChildrenArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenChildrenResult = await sdk.tokens.tokenChildren(args);
```

## Checks if token exists in collection

Returns true or false

#### Arguments

- **collectionId** - ID of collection
- **tokenId** - ID of token

#### Returns

Method returns object:
- **isExists** - boolean

#### Examples

```typescript
const { isExists } = await sdk.tokens.exists({ collectionId: 123, tokenId: 321 });
```

## Get token owner

#### Arguments

- **collectionId** - ID of token collection
- **tokenId** - ID of token
- **blockHashAt** _optional_ - hash of execution block

#### Returns

Return substrate address in an object that contains `owner: string`.

#### Examples

```ts
import {
  TokenOwnerArguments,
  TokenOwnerResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TokenOwnerResult = await sdk.tokens.tokenOwner(
  args,
);
```

## Token parent

Return info about token parent

#### Arguments

- **collectionId** - ID of token collection
- **tokenId** - ID of token

#### Returns

Method return an object of token parent

- **collectionId** - ID of parent collection
- **tokenId** - ID of parent token
- **address** - Token owner address

#### Examples

```ts
import {
  TokenParentArguments,
  TokenParentResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenParentArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenParentResult = await sdk.tokens.tokenParent(args);
```

## Token properties

Get array of token properties

#### Arguments

- **collectionId** - Collection ID
- **tokenId** - Token ID
- **propertyKeys** _optional_ - Array of property keys

#### Returns

Method return an array of properties `{ key: string, value: string }`

#### Examples

```ts
import {
  TokenPropertiesArguments,
  TokenPropertiesResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenPropertiesArguments = {
  collectionId: 1,
  tokenId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: TokenPropertiesResult = await sdk.tokens.properties(args);
```

## Topmost token owner

Return substrate address of topmost token owner

#### Arguments

- **collectionId** - ID of token collection
- **tokenId** - ID of token
- **blockHashAt** _optional_ - hash of execution block

#### Returns

Return substrate address in an object that contains `topmostOwner: string`.


#### Examples

```ts
import {
  TokenOwnerArguments,
  TopmostTokenOwnerResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TopmostTokenOwnerResult = await sdk.tokens.topmostTokenOwner(
  args,
);
```

## Transfer token

#### Arguments

- **address** - Signer address
- **from** _optional_ - Address that owns token (default is signer address)
- **to** - Address of token recipient
- **collectionId** - Collection id
- **tokenId** - Token id
- **value** _optional_ - For (re)fungible transfer (default is 1)

#### Returns

The method returns an `Transfer` event.

#### Examples

```ts
import { TransferArguments } from '@unique-nft/sdk/tokens';

const args: TransferArguments = {
  address: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
```

## Change the owner of the collection

#### Arguments

- **collectionId** - ID of the collection to change owner for
- **from** - The address of collection owner
- **to** - New collection owner (Substrate address)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, newOnwer: string`.

#### Examples

```typescript
import { TransferCollectionArguments } from '@unique-nft/sdk/tokens/types';

const args: TransferCollectionArguments = {
    collectionId: '<ID of the collection>',
    from: '<collection owner>',
    to: '<new collection owner>'
};

const result = await sdk.collections.transfer.submitWaitResult(args);
const { collectionId, newOnwer } = result.parsed;
```

## Unnest token

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

#### Arguments

- **address** - Owner address
- **parent** - Parent token object `{ collectionId: number, tokenId: number }`
- **nested** - Nested token object `{ collectionId: number, tokenId: number }`

#### Returns

The method returns a `parsed` object that contains `{ collectionId: number, tokenId: number }`

#### Examples

```ts
import { UnnestTokenArguments } from '@unique-nft/sdk/tokens/types';

const args: UnnestTokenArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
};

const result = await sdk.tokens.unnestToken.submitWaitResult(args);

const { tokenId, collectionId } = result.parsed;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully unnested`,
);
```


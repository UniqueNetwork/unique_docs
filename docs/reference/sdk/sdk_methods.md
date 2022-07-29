# SDK Methods 

# Table of Contents 

- [Approve](#approve) 
- [Get collection by Id](#get-collection-by-id) 
- [Get collection by Id (new)](#get-collection-by-id-(new)) 
- [Collection properties](#collection-properties) 
- [Create collection](#create-collection) 
- [Create collection (new)](#create-collection-(new)) 
- [Create token (new)](#create-token-(new)) 
- [Delete collection properties](#delete-collection-properties) 
- [Delete token properties](#delete-token-properties) 
- [Get effective limits by collection ID](#get-effective-limits-by-collection-id) 
- [Get collection stats](#get-collection-stats) 
- [Nest token](#nest-token) 
- [Property permissions](#property-permissions) 
- [Set collection limits](#set-collection-limits) 
- [Set collection properties](#set-collection-properties) 
- [Set token properties](#set-token-properties) 
- [Set token property permissions](#set-token-property-permissions) 
- [Get token](#get-token) 
- [Token children](#token-children) 
- [Token parent](#token-parent) 
- [Token properties](#token-properties) 
- [Topmost token owner](#topmost-token-owner) 
- [Transfer token](#transfer-token) 
- [Unnest token](#unnest-token) 

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
import { ApproveArguments } from '@unique-nft/sdk/tokens/methods/approve';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
    AttributeKind,
} from '@unique-nft/api';

const approveArgs: ApproveArguments = {
    spender: '<Account address for whom token will be approved>',
    collectionId: '<ID of the collection>',
    tokenId: '<ID of the token>',
    amount: true
};

const result = await sdk.tokens.approve.submitWaitResult(approveArgs);
const { collectionId, tokenId } = result.parsed;
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
import { CreateTokenNewArguments } from '@unique-nft/sdk/tokens/methods/create-token';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
    AttributeKind,
} from '@unique-nft/api';

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

## Get effective limits by collection ID

By default, the collection limit is not set (their value is null).
This limit value can be seen when requesting a collection using [Get collection by ID](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens/methods/collection-by-id) method.
If the limit is not set by the user, then the default limit is actually applied to the collection.
The values of the limits actually applied to the collection (default and user-set) can be obtained using Get effective limits by collection ID method.

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

Return substrate address as `string`

#### Examples

```ts
import {
  TopmostTokenOwnerArguments,
  TopmostTokenOwnerResult,
} from '@unique-nft/sdk/tokens/types';

const args: TopmostTokenOwnerArguments = {
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

- **from** - Sender address
- **to** - Recipient
- **collectionId** - Collection id
- **tokenId** - Token id

#### Returns

The method returns an `Transfer` event.

#### Examples

```ts
import { TransferArguments } from '@unique-nft/sdk/tokens';

const args: TransferArguments = {
  from: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
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


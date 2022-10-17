# Methods

## Collection

<Details><template v-slot:header>

### Get collection by Id new

</template><template v-slot:body>

#### Overview

The method returns collection info with parsed unique schema.

#### Brief example

```typescript
import { CollectionIdArguments, CollectionInfoWithSchema } from '@unique-nft/substrate-client/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };

const collection: CollectionInfoWithSchema = await sdk.collections.get(getCollectionArgs);
```

#### Arguments

`collectionId: number` — collection id

#### Behaviour and errors

Returns null if the collection does not exist.

If collection properties can not be presented as unique schema, `schema` property will be empty.

#### Returns

```typescript
interface CollectionInfoWithSchema {
    id: number;
    owner: string;
    mode: CollectionMode;
    decimals?: number;
    name: string;
    description: string;
    tokenPrefix: string;
    sponsorship?: CollectionSponsorship;
    limits?: CollectionLimits;
    metaUpdatePermission?: MetaUpdatePermission;
    readOnly?: boolean;
    permissions?: CollectionPermissions;
    schema?: UniqueCollectionSchemaDecoded;
    properties: CollectionProperty[];
}
```


#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { CollectionIdArguments, CollectionInfoWithSchema } from '@unique-nft/substrate-client/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };

const collection: CollectionInfo = await sdk.collections.get(getCollectionArgs);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/collection?collectionId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const collection = await sdk.collections.get({ collectionId: 1 });
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Get collection properties

</template><template v-slot:body>

#### Overview

Gets the array of **Collection properties**.  More details about **Collection properties** can be found in [Set collection properties](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-properties).

#### Brief example

```typescript
import {
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
} from '@unique-nft/substrate-client';

const args: CollectionPropertiesArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: CollectionPropertiesResult = await sdk.collections.properties(args);
```

#### Arguments

`collectionId` - number

`propertyKeys` - string[] - optional

#### Behaviour and errors

Returns array of collection properties


#### Returns

```typescript
interface CollectionProperty {
    key: string;
    value: string;
} 

interface CollectionPropertiesResult {
    properties: CollectionProperty[];
};
```


#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import {
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
} from '@unique-nft/substrate-client';

const args: CollectionPropertiesArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: CollectionPropertiesResult = await sdk.collections.properties(args);
```


  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/collection/properties?collectionId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { properties } = await sdk.collections.properties({ collectionId: 1 });
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Create collection with unique schema

</template><template v-slot:body>

#### Overview

The method creates a new collection with the Unique schema.

#### Brief example

```typescript
import { CreateCollectionNewArguments } from '@unique-nft/substrate-client/tokens';

const result = await sdk.collections.creation.submitWaitResult({
  address: '<your address>',
  name: 'Foo',
  description: 'Bar',
  tokenPrefix: 'Baz',
  schema: {
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    image: { urlTemplate: '{infix}' },
    coverPicture: { ipfsCid: '<ipfs cid>' },
  },
});

const {
  parsed: { collectionId },
} = result;

console.log(`Created new collection with id ${collectionId}`);
```

#### Arguments

`address` - The address of the collection owner

`name` - Collection name (text, up to 64 characters)

`description` - Collection description (text, up to 256 characters)

`mode` - The collection type (`Nft`, `Fungible`, or `ReFungible`)

`tokenPrefix` - Token prefix (text, up to 4 characters)

`sponsorship` - This field tells if sponsorship is enabled and what address is the current collection sponsor.

`limits` - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-limits#arguments)

`metaUpdatePermission` - [Permission](#todo) for update meta (ItemOwner, Admin, None)

`permissions` - [Collection permissions](#todo)

`schema` - [Collection schema](#todo)

#### Behaviour and errors

Throws common errors on insufficient balance and so on.

#### Returns

```typescript
interface CollectionIdArguments {
  collectionId: number;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { CreateCollectionNewArguments } from '@unique-nft/substrate-client/tokens';

const result = await sdk.collections.creation.submitWaitResult({
  address: '<your address>',
  name: 'Foo',
  description: 'Bar',
  tokenPrefix: 'Baz',
  schema: {
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    image: { urlTemplate: '{infix}' },
    coverPicture: { ipfsCid: '<ipfs cid>' },
  },
});

const {
  parsed: { collectionId },
} = result;

console.log(`Created new collection with id ${collectionId}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'POST' \
  'https://rest.unique.network/opal/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "mode": "Nft",
  "name": "Sample collection name",
  "description": "sample collection description",
  "tokenPrefix": "TEST",
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "schema": {
    "coverPicture": {
"ipfsCid": ""
    },
    "image": {
      "urlTemplate": "{infix}"
    },
    "schemaName": "unique",
    "schemaVersion": "1.0.0"
  }
}'

# then we sign, then we call

curl -X 'POST' \
'https://rest.unique.network/opal/extrinsic/submit' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
"signerPayloadJSON": { *from previous response* },
"signature": "0x_your_signature_in_hex"
}'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.collections.creation.submitWaitResult({
  address: '<your address>',
  name: 'Foo',
  description: 'Bar',
  tokenPrefix: 'Baz',
  schema: {
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    image: { urlTemplate: '{infix}' },
    coverPicture: { ipfsCid: '<ipfs cid>' },
  },
});

const {
  parsed: { collectionId },
} = result;

console.log(`Created collection with id ${collectionId}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Delete collection properties

</template><template v-slot:body>

#### Overview

This method deletes collection properties.

#### Brief example

```typescript
import { DeleteCollectionPropertiesArguments} from '@unique-nft/substrate-client/tokens';

const args: DeleteCollectionPropertiesArguments = {
    address: '<your address>',
    collectionId: 1,
    propertyKeys: ['foo', 'bar'],
};

const result = await sdk.collections.deleteProperties.submitWaitResult(args);
const deletedKeys = result.parsed.properties.map((property) => property.propertyKey);

console.log(`Deleted ${deletedKeys.join()}`);
```

#### Arguments

`address` - string

`collectionId` - number

`propertyKeys` - string[]


#### Behaviour and errors

Throws common errors on insufficient balance and so on.

#### Returns

```typescript
interface CollectionPropertyDeletedEvent {
  collectionId: number;
  propertyKey: string;
}

interface DeleteCollectionPropertiesResult {
  properties: CollectionPropertyDeletedEvent[];
}
```


#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { DeleteCollectionPropertiesArguments} from '@unique-nft/substrate-client/tokens';

const args: DeleteCollectionPropertiesArguments = {
    address: '<your address>',
    collectionId: 1,
    propertyKeys: ['foo', 'bar'],
};

const result = await sdk.collections.deleteProperties.submitWaitResult(args);
const deletedKeys = result.parsed.properties.map((property) => property.propertyKey);

console.log(`Deleted ${deletedKeys.join()}`);
```


  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'DELETE' \
  'https://rest.unique.network/opal/collection/properties' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 1,
  "propertyKeys": [
    "foo", "bar"
  ]
}'

# then we sign, then we call

curl -X 'POST' \
'https://rest.unique.network/opal/extrinsic/submit' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
"signerPayloadJSON": { *from previous response* },
"signature": "0x_your_signature_in_hex"
}'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

await sdk.collections.deleteProperties.submitWaitResult({
    address: '<your address>',
    collectionId: 1,
    propertyKeys: ['foo', 'bar'],
});
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Destroy collection

</template><template v-slot:body>

#### Overview

The method destroys collection if no tokens within this collection.

#### Brief example

```typescript
import { DestroyCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
const { success } = result.parsed;
```

#### Arguments

`address` - string

`collectionId` - number

#### Behaviour and errors

Throws common errors on insufficient balance and so on.

#### Returns

```typescript
interface DestroyCollectionResult {
    success: boolean;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { DestroyCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
const { success } = result.parsed;
```


  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'DELETE' \
  'https://rest.unique.network/opal/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 1
}'
### then we sign, then we call

curl -X 'POST' \
'https://rest.unique.network/opal/extrinsic/submit' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
"signerPayloadJSON": { *from previous response* },
"signature": "0x_your_signature_in_hex"
}'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

client.collections.destroy.submitWaitResult({
    address: '<your address>',
    collectionId: 1,
});
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Get effective limits by collection Id

</template><template v-slot:body>

#### Overview

The method gets collection effective limits.

#### Brief example

```typescript
import { CollectionIdArguments, GetCollectionLimitsResult } from '@unique-nft/substrate-client/types';

const { collectionId, limits }: GetCollectionLimitsResult = await sdk.collections.getLimits({ collectionId: 123 });

console.log(`Collection ${collectionId} limits: ${JSON.stringify(limits)}`);
```

#### Arguments

`collectionId` - number


#### Behaviour and errors

By default, the collection limit is not set (their value is null).

This limit value can be seen when requesting a collection using the [Get collection by ID](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/collection-by-id) method.

If the limit is not set by the user, then the default limit is actually applied to the collection.

The values of the limits actually applied to the collection (default and user-set) can be obtained using `Get effective limits` by collection ID.


#### Returns

```typescript
interface CollectionLimits {
    accountTokenOwnershipLimit: number | null;
    sponsoredDataSize: number | null;
    sponsoredDataRateLimit: number | null;
    tokenLimit: number | null;
    sponsorTransferTimeout: number | null;
    sponsorApproveTimeout: number | null;
    ownerCanTransfer: boolean | null;
    ownerCanDestroy: boolean | null;
    transfersEnabled: boolean | null;
}

interface GetCollectionLimitsResult {
    collectionId: number;
    limits: CollectionLimits;
}
```


#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { CollectionIdArguments, GetCollectionLimitsResult } from '@unique-nft/substrate-client/types';

const { collectionId, limits }: GetCollectionLimitsResult = await sdk.collections.getLimits({ collectionId: 123 });

console.log(`Collection ${collectionId} limits: ${JSON.stringify(limits)}`);
```


  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/collection/limits?collectionId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { collectionId, limits } = await sdk.collections.getLimits({ collectionId: 1 });

console.log(`Collection ${collectionId} limits: ${JSON.stringify(limits)}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Property permissions

</template><template v-slot:body>

#### Overview

The method gets an array of **collection property permissions** (see [Set token property permissions](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-token-property-permissions)).

#### Brief example

```typescript
  import {
    PropertyPermissionsArguments,
    PropertyPermissionsResult,
  } from '@unique-nft/substrate-client/tokens/types';
  
  const args: PropertyPermissionsArguments = {
    collectionId: 1,
    // propertyKeys: ['foo', 'bar'],
  };
  
  const result: PropertyPermissionsResult =
    await sdk.collections.propertyPermissions(args);
```

#### Arguments

`collectionId: number` - Collection ID

`propertyKeys?: string[]` - Array of property keys to get values for

`at?: HexString;` - Allows specifying at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

#### Behaviour and errors

Throw errors:

- Collection not found

#### Returns

This method returns `PropertyPermissionsResult`

```typescript
  type PropertyPermissionsResult = {
    propertyPermissions: Array<{  
      key: string;
      permission: {
        mutable: boolean;
        collectionAdmin: boolean;
        tokenOwner: boolean;
      };
    }>;
  }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
  import {
    PropertyPermissionsArguments,
    PropertyPermissionsResult,
  } from '@unique-nft/substrate-client/tokens/types';
  
  const args: PropertyPermissionsArguments = {
    collectionId: 1,
    // propertyKeys: ['foo', 'bar'],
  };
  
  const result: PropertyPermissionsResult =
    await sdk.collections.propertyPermissions(args);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'GET' \
      'http://rest.unique.network/opal/collection/property-permissions?collectionId=1' \
      -H 'accept: application/json'
      
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
  const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
  
  const result = await sdk.collections.propertyPermissions({
    collectionId: 1,
  });
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Set collection limits

</template><template v-slot:body>

#### Overview

The method sets some **collection limits** and starts enforcing them immediately.

You can get the current **collection limits** using the [Get effective limits by collection Id](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/effective-collection-limits) method.

Only the **Collection Owner** has permission to call this method.

#### Brief example

```typescript
    import '@unique-nft/substrate-client/tokens';
    import { SetCollectionLimitsArguments } from '@unique-nft/substrate-client/tokens/types';
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
    const { parsed: { collectionId, limits } } = result;
```

#### Arguments

`address: string`- Signer, the address of the **Collection Owner**

`collectionId: number` - ID of the collection to set limits for

`limits: CollectionLimits*` - The **Effective Limits** of the collection. The difference between the **Effective Limits** and the limits returned by [Get collection by Id](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/collection-by-id) is explained in [the effective limits of the collection](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/effective-collection-limits).

&ast; Interface **CollectionLimits**

- `accountTokenOwnershipLimit?: number | null` - Maximum number of tokens that one address can own
- `sponsoredDataSize?: number | null` - Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode
- `sponsoredDataRateLimit?: number | null` - Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored
- `tokenLimit?: number | null` - Total amount of tokens that can be minted in this collection.
- `sponsorTransferTimeout?: number | null` - Time interval in blocks that defines once per how long a non-privileged user transfer or the mint transaction can be sponsored
- `sponsorApproveTimeout?: number | null` - Time interval in blocks that defines once per how long a non-privileged user approve transaction can be sponsored
- `ownerCanTransfer?: boolean | null` - A boolean value that tells if collection owner or admins can transfer or burn tokens owned by other non-privileged users
- `ownerCanDestroy?: boolean | null` - A boolean value that tells if collection owner can destroy it
- `transfersEnabled?: boolean | null` - Flag that defines whether token transfers between users are currently enabled

#### Behaviour and errors

**Attention!** Total amount of tokens includes also the tokens that have been minted and burned after that. So if tokenLimit=3, 2 tokens were minted and 1 of them was burned, only 1 more token can be minted.

Throw errors:

- Collection not found
- Signer is not **Collection Owner**

#### Returns

This method returns `SetCollectionLimitsResult`

```typescript
    interface SetCollectionLimitsResult {
      collectionId: number;
      limits: CollectionLimits;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import '@unique-nft/substrate-client/tokens';
    import { SetCollectionLimitsArguments } from '@unique-nft/substrate-client/tokens/types';
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
    const { parsed: { collectionId, limits } } = result;
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/set-limits?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "limits": {
        "accountTokenOwnershipLimit": 1000,
        "sponsoredDataSize": 1024,
        "sponsoredDataRateLimit": 30,
        "tokenLimit": 1000000,
        "sponsorTransferTimeout": 6,
        "sponsorApproveTimeout": 6,
        "ownerCanTransfer": false,
        "ownerCanDestroy": false,
        "transfersEnabled": false
      },
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "collectionId": 1
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.setLimits.submitWaitResult({
      "limits": {
        "accountTokenOwnershipLimit": 1000,
        "sponsoredDataSize": 1024,
        "sponsoredDataRateLimit": 30,
        "tokenLimit": 1000000,
        "sponsorTransferTimeout": 6,
        "sponsorApproveTimeout": 6,
        "ownerCanTransfer": false,
        "ownerCanDestroy": false,
        "transfersEnabled": false
      },
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "collectionId": 1
    });
    
    const { parsed: { collectionId, limits } } = result;
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Set collection permissions

</template><template v-slot:body>

#### Overview

This method sets on-chain permissions for collection

#### Brief example

```typescript
    import {
      SetCollectionPermissionsArguments,
      CollectionAccess,
    } from '@unique-nft/substrate-client/tokens';
    
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

#### Arguments

`address: string` - Owner address

`collectionId: number` - Collection id

`permissions: CollectionPermissions` - Struct that contains the permissions for a collection
  - `access?: CollectionAccess` - 'Normal' (for public access) or 'WhiteList' (for restricted access)
  - `mintMode?: boolean`- True, if anyone is allowed to mint. False otherwise
  - `nesting?:`
    - `tokenOwner?: boolean`
    - `collectionAdmin?: boolean`
    - `restricted?: number[]`

#### Behaviour and errors

Throw errors:

- Collection not found

#### Returns

This method returns `SetCollectionPermissionsResult`

```typescript
  type SetCollectionPermissionsResult = {
    collectionId: number;
  }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
  import {
    SetCollectionPermissionsArguments,
    CollectionAccess,
  } from '@unique-nft/substrate-client/tokens';
  
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

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/permissions?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "collectionId": 1,
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "permissions": {
        "access": "Normal",
        "mintMode": true,
        "nesting": {
          "tokenOwner": true,
          "collectionAdmin": true
        }
      }
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
  const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
  
  const result = await sdk.collections.setPermissions.submitWaitResult({
    "collectionId": 1,
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "permissions": {
      "access": "Normal",
      "mintMode": true,
      "nesting": {
        "tokenOwner": true,
        "collectionAdmin": true
      }
    }
  });
  
  console.log(
    `Collection #${result.parsed.collectionId} permissions successfully updated`,
  );
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Set collection properties

</template><template v-slot:body>

#### Overview

**Collection properties** are a unique set of keys and values. The maximum number of keys is 64. The maximum size of a parameter data block (keys and values) is 40kB.

Only the **Collection Owner** and **Collection Admin** can modify the **Collection properties**.

Property **keys** can only be added, they cannot be removed.

The naming of keys is restricted to a limited set of the following characters: Latin letter any case, numbers, dot, hyphen and underscore (regex: ^[0-9a-zA-Z.-_]).

#### Brief example

```typescript
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

#### Arguments

`address: Address` - Signer, the address of the **Collection Owner** or **Collection Admin**

`collectionId: number` - Collection id

`properties: Array<{
key: string;
value: string;
}>` - Array of properties

#### Behaviour and errors

Throw errors:

- Collection not found
- Signer is not **Collection Owner** or **Collection Admin**

#### Returns

This method returns `SetCollectionPermissionsResult`

```typescript
    type SetCollectionPermissionsResult = {
      collectionId: number;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
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

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/properties?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
      "collectionId": 1,
      "properties": [
          {
              "key": "foo",
              "value": "bar"
          }
      ]
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.setProperties.submitWaitResult({
      "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
      "collectionId": 1,
      "properties": [
        {
          "key": "foo",
          "value": "bar"
        }
      ]
    });
    
    const { parsed: { properties } } = result;
    
    console.log(`Properties ${properties.map(t => t.propertyKey).join()} are set for the collection`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Set token property permissions

</template><template v-slot:body>

#### Overview

The method sets some **tokenPropertyPermissions** values. The current value of **tokenPropertyPermissions** can be found using [Property permissions](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/property-permissions).

The token cannot be attributed to an arbitrary key, only to a key from the **tokenPropertyPermissions** list.

Only the **Collection Owner** and **Collection Admin** can add and modify keys.

The permissions to create and modify properties of a collection are carried out using three keys - **mutable**, **collectionAdmin** and **tokenOwner**.

- **mutable** attribute sets the immutability attribute.
- **collectionAdmin** grants the designated collection administrator and the collection owner 'write/modify' access
- **tokenOwner** grants the token owner 'write/modify' access

#### Brief example

```typescript
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

#### Arguments

`address: string` - Signer, the address of the **Collection Owner** or **Collection Admin**

`collectionId: number` - Collection id

`propertyPermissions: Array<{ key: string; permission: PropertyPermission*; }>` - Array of property permissions

&ast; Type **PropertyPermission**

`mutable: boolean` - attribute sets the immutability attribute

`collectionAdmin: boolean` - grants the designated collection administrator and the collection owner 'write/modify' access

`tokenOwner: boolean` - grants the token owner 'write/modify' access

#### Behaviour and errors

Throw errors:

- Collection not found
- Signer is not **Collection Owner** or **Collection Admin**

#### Returns

This method returns `SetTokenPropertyPermissionsResult`

```typescript
    type SetTokenPropertyPermissionsResult = {
      propertyPermissions: Array<{
        collectionId: number;
        propertyKey: string;
      }>;
    };
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
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

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/property-permissions?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
      "collectionId": 1,
      "propertyPermissions": [
        {
          "key": "foo",
          "permission": {
            "mutable": true,
            "collectionAdmin": true,
            "tokenOwner": true
          }
        }
      ]
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.setPropertyPermissions.submitWaitResult({
      "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
      "collectionId": 1,
      "propertyPermissions": [
        {
          "key": "foo",
          "permission": {
            "mutable": true,
            "collectionAdmin": true,
            "tokenOwner": true
          }
        }
      ]
    });
    
    const { parsed: { propertyPermissions } } = result;
    
    console.log(`the values of the keys ${propertyPermissions.map(t => t.propertyKey).join()} are set`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Set transfers enabled flag

</template><template v-slot:body>

#### Overview

The method enables or disables transfers in a collection.

Only the **Collection Owner** can call this method.

The method sets **transfersEnabled** flag for particular collection. The current value of the **transfersEnabled** flag can be found using the method [**Get effective limits**](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/effective-collection-limits)

#### Brief example

```typescript
    import { SetTransfersEnabledArguments } from '@unique-nft/substrate-client/tokens/types';
    
    const args: SetTransfersEnabledArguments = {
      address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
      collectionId: 1,
      isEnabled: true,
    };
    
    const result = await sdk.collections.setTransfersEnabled.submitWaitResult(args);
    
    console.log(result.parsed.success);
```

#### Arguments

`address: string`- Signer, the address of the **Collection Owner**

`collectionId: number` - Collection id

`isEnabled: boolean` - New flag value. If True, allows transfers, otherwise token transfers are frozen

#### Behaviour and errors

Throw errors:

- Collection not found
- Signer is not **Collection Owner**

#### Returns

This method returns `SetTransfersEnabledResult`

```typescript
    interface SetTransfersEnabledResult {
      success: boolean;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import { SetTransfersEnabledArguments } from '@unique-nft/substrate-client/tokens/types';
    
    const args: SetTransfersEnabledArguments = {
      address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
      collectionId: 1,
      isEnabled: true,
    };
    
    const result = await sdk.collections.setTransfersEnabled.submitWaitResult(args);
    
    console.log(result.parsed.success);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/transfers-enabled?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "collectionId": 1,
      "isEnabled": true
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.setTransfersEnabled.submitWaitResult({
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "collectionId": 1,
      "isEnabled": true
    });

    console.log(result.parsed.success);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Change the owner of the collection

</template><template v-slot:body>

#### Overview

This method assigns a new collection owner. Only the **Collection Owner** can call this method.

#### Brief example

```typescript
    import { TransferCollectionArguments } from '@unique-nft/substrate-client/tokens/types';
    
    const args: TransferCollectionArguments = {
      collectionId: '<ID of the collection>',
      from: '<collection owner>',
      to: '<new collection owner>'
    };
    
    const result = await sdk.collections.transfer.submitWaitResult(args);
    const { collectionId, newOnwer } = result.parsed;
```

#### Arguments

`collectionId: number` - ID of the collection to change owner for

`from: string` - The address of the **Collection Owner**

`to: string` - New collection owner (Substrate address)

#### Behaviour and errors

Throw errors:

- Collection not found
- **from** address is not **Collection Admin** address

#### Returns

This method returns `TransferCollectionResult`

```typescript
    export interface TransferCollectionResult {
      collectionId: number;
      owner: string;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import { TransferCollectionArguments } from '@unique-nft/substrate-client/tokens/types';
    
    const args: TransferCollectionArguments = {
      collectionId: '<ID of the collection>',
      from: '<collection owner>',
      to: '<new collection owner>'
    };
    
    const result = await sdk.collections.transfer.submitWaitResult(args);
    const { collectionId, newOnwer } = result.parsed;
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'PATCH' \
      'https://rest.unique.network/opal/collection/transfer?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "collectionId": 1,
      "from": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      "to": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.transfer.submitWaitResult({
      "collectionId": 1,
      "from": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      "to": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    });
    
    const { parsed: { collectionId, owner } } = result;
    
    console.log(`new owner of collection ${collectionId} has address ${owner}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

## Collections admin

<Details><template v-slot:header>

### Add collection admin

</template><template v-slot:body>

#### Overview

Adds an **admin** of the Collection. 

**Admin** description is available in [Get admin list](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/admin-list).

Only **Collection Owner** or **Collection Admin** has permission to call this method.

#### Brief example

```typescript
    import { AddCollectionAdminArguments } from '@unique-nft/substrate-client/tokens';
    
    const args: AddCollectionAdminArguments = {
      address: '<address>',
      collectionId: 1,
      newAdmin: '<address>',
    };
    
    const result = await sdk.collections.addAdmin.submitWaitResult(args);
    
    console.log(result.parsed);
```

#### Arguments

`address: string` - Signer, the address of the **Collection Owner** or **Collection Admin**

`collectionId: number` - ID of the Collection to add **admin** for

`newAdmin: string` - Address of new admin to add

#### Behaviour and errors

Throw errors:

- Collection not found
- Signer is not **Collection Owner** or **Collection Admin**

#### Returns

This method returns `AddCollectionAdminResult`

```typescript
    interface AddCollectionAdminResult {
      collectionId: number;
      newAdmin: string;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import { AddCollectionAdminArguments } from '@unique-nft/substrate-client/tokens';
    
    const args: AddCollectionAdminArguments = {
      address: '<address>',
      collectionId: 1,
      newAdmin: '<address>',
    };
    
    const result = await sdk.collections.addAdmin.submitWaitResult(args);
    
    console.log(result.parsed);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/admins?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      "collectionId": 1,
      "newAdmin": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.addAdmin.submitWaitResult({
      "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      "collectionId": 1,
      "newAdmin": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    });
    
    const { parsed: { collectionId, newAdmin } } = result;
    
    console.log(`collection ${collectionId} has admin ${newAdmin}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Get admin list

</template><template v-slot:body>

#### Overview

Gets an array of **Collection Admins**.

NFT Collection can be controlled by multiple **admin** addresses (some of which can also be servers, for example).

**Admins** can issue and burn NFTs, as well as add and remove other **admins**, but cannot change NFT or Collection ownership.

The list of admins may be or become empty. 

To add a **Collection Admin**, use the **[Add collection admin](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/add-collection-admin)** method.

#### Brief example

```typescript
    import {
      AdminlistArguments,
      AdminlistResult,
    } from '@unique-nft/substrate-client/tokens/types';
    
    const args: AdminlistArguments = {
      collectionId: 1,
    };
    
    const result: AdminlistResult = await sdk.collections.admins(args);
```

#### Arguments

`collectionId: number` - Collection id

`at?: string;` - Allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

#### Behaviour and errors

Throw errors:

- Collection not found

#### Returns

This method returns `AdminlistResult`

```typescript
    type AdminlistResult = {
      admins: string[];
    };
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import {
      AdminlistArguments,
      AdminlistResult,
    } from '@unique-nft/substrate-client/tokens/types';
    
    const args: AdminlistArguments = {
      collectionId: 1,
    };
    
    const result: AdminlistResult = await sdk.collections.admins(args);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
      'https://rest.unique.network/opal/collection/admins?collectionId=1' \
      -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.admins({
        collectionId: 1,
    });
    
    const { admins } = result;
    
    console.log(`${admins.join()} - collection admins`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Remove collection admin

</template><template v-slot:body>

#### Overview

The method removes the **admin** address of the Collection. An **admin** address can remove itself.

The list of admins may be or become empty, in which case only **Collection Owner** will be able to add an **Admin**.

**Admin** description is available in [Get admin list](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/admin-list).

Only the **Collection Owner** or **Collection Admin** has permission to call this method.

#### Brief example

```typescript
    import { RemoveCollectionAdminArguments } from '@unique-nft/substrate-client/tokens';
    
    const args: RemoveCollectionAdminArguments = {
      address: '<address>',
      collectionId: 1,
      accountId: '<address>',
    };
    
    const result = await sdk.collections.removeAdmin.submitWaitResult(args);
    
    console.log(result.parsed);
```

#### Arguments

`address: string` - Signer, the address of the **Collection Owner** or **Collection Admin**

`collectionId: number` - ID of the Collection to remove admin for

`admin: string` - Address of admin to remove

#### Behaviour and errors

Throw errors:

- Collection not found
- Signer is not **Collection Owner** or **Collection Admin**

#### Returns

This method returns `RemoveCollectionAdminResult`

```typescript
    interface RemoveCollectionAdminResult {
      collectionId: number;
      admin: string;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import { RemoveCollectionAdminArguments } from '@unique-nft/substrate-client/tokens';
    
    const args: RemoveCollectionAdminArguments = {
      address: '<address>',
      collectionId: 1,
      accountId: '<address>',
    };
    
    const result = await sdk.collections.removeAdmin.submitWaitResult(args);
    
    console.log(result.parsed);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'DELETE' \
      'https://rest.unique.network/opal/collection/admins?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
          "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
          "collectionId": 1,
          "admin": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
        }'
        
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

    const result = await sdk.collections.removeAdmin.submitWaitResult({
      "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      "collectionId": 1,
      "admin": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    });
    
    const { parsed: { collectionId, admin } } = result;
    
    console.log(`admin ${admin} removed from collection ${collectionId}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

## Collections allow list

<Details><template v-slot:header>

### Add To Allow List

</template><template v-slot:body>

#### Overview

Adds an address to allow list of a collection.

#### Brief example

```typescript
import { AddToAllowListArguments } from '@unique-nft/substrate-client/tokens/types';

const addToAllowListArgs: AddToAllowListArguments = {
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    newAdminId: '<valid address>'
};

const { parsed } = await sdk.collections.addToAllowList.submitWaitResult(addToAllowListArgs);
const { collectionId, address } = parsed;
```

#### Arguments

- **address** - Sender address
- **collectionId** - An ID of the collection which will be affected
- **newAdminId** - The address to be added to the allow list

#### Behaviour and errors

#### Returns

This method returns `AddToAllowListResult`

```typescript
interface AccountTokensResult {
  address: Address;
  collectionId: number;
}
```

#### Examples

<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
import { AddToAllowListArguments } from '@unique-nft/substrate-client/tokens/types';

const addToAllowListArgs: AddToAllowListArguments = {
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    newAdminId: '<valid address>'
};

const { parsed } = await sdk.collections.addToAllowList.submitWaitResult(addToAllowListArgs);

const { collectionId, address } = parsed;

console.log(
  `Address ${address} is allowed in collection ${collectionId}`,
);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/add-to-allow-list' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "<address>",
      "collectionId": 1,
      "newAdminId": "<address>"
    }'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { parsed } = await sdk.collections.addToAllowList.submitWaitResult({
  address: '<your account address>',
  collectionId: '<ID of the collection>',
  newAdminId: '<valid address>'
});

const { address, collectionId } = parsed;

console.log(
  `Address ${address} is allowed in collection ${collectionId}`,
);
```

  </CodeGroupItem>

</CodeGroup>


</template></Details>

<Details><template v-slot:header>

### Allow list

</template><template v-slot:body>

#### Overview

Gets the addresses from allow list of the specified collection.

#### Brief example

```typescript
import { AllowListArguments } from '@unique-nft/substrate-client/tokens/types';

const allowListArgs: AllowListArguments = {
  collectionId: 1,
};

const addresses = await sdk.collections.allowList(allowListArgs);
```


#### Arguments

- **collectionId** - an ID of the collection which will be checked

#### Returns

This method returns `AllowListResult`

```typescript
interface AllowListResult {
  addresses: Address[];
}
```

#### Examples

<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
  import { AllowListArguments } from '@unique-nft/substrate-client/tokens/types';
  
  const allowListArgs: AllowListArguments = {
    collectionId: 1,
  };

  const { addresses } = await sdk.collections.allowList(allowListArgs);
  
  console.log(`addresses: ${addresses}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.unique.network/opal/collection/allow-list?collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const { addresses } = await sdk.collections.allowList({
        collectionId: 1,
    });

    console.log(`addresses: ${addresses}`);
```

  </CodeGroupItem>

</CodeGroup>



</template></Details>

<Details><template v-slot:header>

### Get allowance

</template><template v-slot:body>

The method gets the number of token pieces approved to transfer

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

</template></Details>

<Details><template v-slot:header>

### Check is allowed

</template><template v-slot:body>

#### Overview
Checks if user is allowed to use the collection. Returns true or false.

#### Brief example
```typescript
const { isAllowed } = await sdk.collection.allowed({
  collectionId: 1,
  account: '<address>',
});

console.log(`isAllowed: ${isAllowed}`);
```

#### Arguments

- **collectionId** - ID of collection
- **account** - Account address
- **at** _optional_ - hash of execution block

#### Returns

This method returns `AllowedResult`

```typescript
interface AllowedResult {
  isAllowed: boolean;
}
```

#### Examples

<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
  const { isAllowed } = await sdk.collection.allowed({
    collectionId: 1,
    account: '<address>',
  });
  
  console.log(`isAllowed: ${isAllowed}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.unique.network/opal/collection/allowed?collectionId=1&address=<address>'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const { isAllowed } = await sdk.collections.allowed({
        collectionId: 1,
        account: '<address>',
    });

    console.log(`isAllowed: ${isAllowed}`);
```

  </CodeGroupItem>

</CodeGroup>


</template></Details>

<Details><template v-slot:header>

### Remove from allow list

</template><template v-slot:body>

#### Overview

Removes an account from the allow list.

#### Brief example

```typescript
import { RemoveFromAllowListArguments } from '@unique-nft/substrate-client/tokens/types';

const removeFromAllowListArgs: RemoveFromAllowListArguments = {
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    addressToDelete: '<valid address>'
};

const { parsed } = await sdk.collections.removeFromAllowList.submitWaitResult(removeFromAllowListArgs);
const { collectionId, address } = parsed;
```


#### Arguments

- **address** - Sender address
- **collectionId** - an ID of the collection which will be affected
- **addressToDelete** - the address to be removed from the allow list

#### Returns

This method returns `RemoveFromAllowListResult`

```typescript
interface RemoveFromAllowListResult {
  address: Address;
  collectionId: number;
}
```

#### Examples

<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
    import { RemoveFromAllowListArguments } from '@unique-nft/substrate-client/tokens/types';
    
    const removeFromAllowListArgs: RemoveFromAllowListArguments = {
        address: '<your account address>',
        collectionId: '<ID of the collection>',
        addressToDelete: '<valid address>'
    };
    
    const { parsed } = await sdk.collections.removeFromAllowList.submitWaitResult(removeFromAllowListArgs);
    
    const { collectionId, address } = parsed;
    
    console.log(
      `Address ${address} removed from allow list in collection ${collectionId}`,
    );
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'POST' \
      'https://rest.unique.network/opal/collection/remove-from-allow-list' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "<address>",
      "collectionId": 1,
      "addressToDelete": "<address>"
    }'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const { parsed } = await sdk.collections.removeFromAllowList.submitWaitResult({
      address: '<your account address>',
      collectionId: '<ID of the collection>',
      addressToDelete: '<valid address>'
    });
    
    const { collectionId, address } = parsed;
    
    console.log(
      `Address ${address} removed from allow list in collection ${collectionId}`,
    );
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

## Nesting

<Details><template v-slot:header>

### Get bundle

</template><template v-slot:body>

#### Overview

Returns full tree of a nested tokens. You can request it with any token from the bundle, the result will be the same for all.

#### Brief example

```typescript
import { NestedToken } from '@unique-nft/substrate-client/types';

const result: NestedToken = await sdk.tokens.getBundle({
  collectionId: 2,
  tokenId: 5,
});

console.log(result);

/*
{
    tokenId: 1,
    collectionId: 1,
    nestingChildTokens: [
    {tokenId: 2, collectionId 1, childs: []},
    ...
    {tokenId: 5, collectionId 1, childs: []},       <------- this is the requested token
    ]
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Behaviour and errors

Throw errors:

- If the topmost token of a bundle has no nested tokens
- Recursion depth exceeded
- Token not found during search for nested children

#### Returns

This method returns `NestedToken`

```typescript
type NestedToken = Omit<TokenByIdResult, 'nestingChildTokens'> & {
  nestingChildTokens: NestedToken[];
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { GetBundleArguments } from '@unique-nft/substrate-client/tokens';

const args: GetBundleArguments = {
  collectionId: 2,
  tokenId: 5,
};

const bundle = await sdk.tokens.getBundle(args);

console.log(bundle);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/token/get-bundle?collectionId=2&tokenId=5' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const bundle = await sdk.tokens.getBundle({
  collectionId: 2,
  tokenId: 5,
});

console.log(bundle);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Is Bundle

</template><template v-slot:body>

#### Overview

The method returns whether the token is in part of the bundle or not.

#### Brief example

```typescript
const isBundle = await sdk.tokens.isBundle({
  collectionId: 2,
  tokenId: 1,
});

console.log(isBundle);

// false
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Returns

This method returns `IsBundleResult`

```typescript
type IsBundleResult = boolean;
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { IsBundleArguments } from '@unique-nft/substrate-client/tokens';

const args: IsBundleArguments = {
  collectionId: 2,
  tokenId: 1,
};

const bundle = await sdk.tokens.isBundle(args);

console.log(bundle);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/token/is-bundle?collectionId=2&tokenId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.tokens.isBundle({
  collectionId: 2,
  tokenId: 1,
});

console.log(result.isBundle);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Nest token

</template><template v-slot:body>

#### Overview

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

#### Brief example

```typescript
import { NestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

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

#### Arguments

`address: string` - Token owner address

`parent: { collectionId: number, tokenId: number }` - Parent token object

`nested: { collectionId: number, tokenId: number }` - Nested token object

#### Behaviour and errors

Nesting can be applied only if the token collection has permission for nesting. If the collection has no permission for nesting - "UserIsNotAllowedToNest" Error will be thrown.

```typescript
await sdk.collections.creation.submitWaitResult({
  // ...
  permissions: {
    nesting: {
      tokenOwner: true,
      collectionAdmin: true,
    },
  },
```

#### Returns

The method returns `NestTokenResult`

```typescript
type NestTokenResult = {
  /**
   * id of the collection
   */
  collectionId: number;
  /**
   * id of the token
   */
  tokenId: number;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { NestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

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

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/token/nest' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
      "parent": {
        "collectionId": 1,
        "tokenId": 1
      },
      "nested": {
        "collectionId": 1,
        "tokenId": 2
      }
    }'

    # then we sign, then we call

    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.tokens.nest.submitWaitResult({
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
});

const {
  parsed: { sponsor, collectionId },
} = result;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully nested`,
);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Token children

</template><template v-slot:body>

#### Overview

Gets an array of nested tokens. If the token has no children returns an empty array.

#### Brief example

```typescript
import {
  TokenChildrenArguments,
  TokenChildrenResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenChildrenArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenChildrenResult = await sdk.tokens.children(args);

console.log(result);

/*
{
  children: [
    {
      collectionId: 1,
      token: 2
    },
    {
      collection: 1,
      token: 3
    }
  ]
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Returns

This method returns `TokenChildrenResult`

```typescript
type TokenChildrenArguments = {
  collectionId: number;
  tokenId: number;
};

type TokenChildrenResult = {
  children: TokenChildrenArguments[];
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import {
  TokenChildrenArguments,
  TokenChildrenResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenChildrenArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenChildrenResult = await sdk.tokens.children(args);

console.log(result);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/token/children?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.tokens.children({
  collectionId: 1,
  tokenId: 1,
});

console.log(result.children);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Token parent

</template><template v-slot:body>

#### Overview

Returns info about the token parent. Call the `tokenOwner` method. If the owner is not a nesting token returns `null`.

#### Brief example

```typescript
import {
  TokenParentArguments,
  TokenParentResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenParentArguments = {
  collectionId: 1,
  tokenId: 2,
};

const result: TokenParentResult = await sdk.tokens.parent(args);

console.log(result);

/*
{
  collectionId: 1;
  tokenId: 1;
  address: "5HpZHYXjV23eEdVzhvYD2D3H6g1kM3aRGYwrmuGe9zaod6od";
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Returns

This method returns `TokenParentResult`

```typescript
type TokenParentResult = {
  collectionId: number;
  tokenId: number;
  address: Address;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import {
  TokenParentArguments,
  TokenParentResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenParentArguments = {
  collectionId: 1,
  tokenId: 2,
};

const result: TokenParentResult = await sdk.tokens.parent(args);

console.log(result);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/token/parent?collectionId=1&tokenId=2' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.tokens.parent({
  collectionId: 1,
  tokenId: 2,
});

console.log(result);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Topmost token owner

</template><template v-slot:body>

#### Overview

Returns substrate address of the topmost token owner.

#### Brief example

```typescript
import {
  TokenOwnerArguments,
  TopmostTokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TopmostTokenOwnerResult = await sdk.tokens.topmostOwner(args);

console.log(result);

/*
{
  topmostOwner: "5HpZHYXjV23eEdVzhvYD2D3H6g1kM3aRGYwrmuGe9zaod6od"
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

`blockHashAt: string` - _optional_ - hash of execution block

#### Returns

This method returns `TopmostTokenOwnerResult`

```typescript
type TopmostTokenOwnerResult = { topmostOwner: Address };
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import {
  TokenOwnerArguments,
  TopmostTokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TopmostTokenOwnerResult = await sdk.tokens.topmostOwner(args);

console.log(result);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/token/topmost-owner?collectionId=1&tokenId=2' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.tokens.topmostOwner({
  collectionId: 1,
  tokenId: 2,
});

console.log(result.topmostOwner);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Unnest token

</template><template v-slot:body>

#### Overview

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

#### Brief example

```typescript
import { UnnestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

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

#### Arguments

`address: string` - Token owner address

`parent: { collectionId: number, tokenId: number }` - Parent token object

`nested: { collectionId: number, tokenId: number }` - Nested token object

#### Behaviour and errors

This method can only be executed if the token is nested.

#### Returns

The method returns `UnnestTokenResult`

```typescript
type UnnestTokenResult = {
  /**
   * id of the collection
   */
  collectionId: number;
  /**
   * id of the token
   */
  tokenId: number;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { UnnestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

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

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/token/unnest' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
      "parent": {
        "collectionId": 1,
        "tokenId": 1
      },
      "nested": {
        "collectionId": 1,
        "tokenId": 2
      }
    }'

    # then we sign, then we call

    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.tokens.unnest.submitWaitResult({
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
});

const {
  parsed: { sponsor, collectionId },
} = result;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully unnested`,
);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

## Sponsorship

<Details><template v-slot:header>

### Confirm sponsorship

</template><template v-slot:body>

#### Overview

**Sponsors** should use this method to confirm sponsorship after the collection **owner** called the [set collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-sponsor) method.

#### Brief example

```typescript
    import { ConfirmSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const confirmSponsorshipArgs: ConfirmSponsorshipArguments = {
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    };
    
    await sdk.collections.confirmSponsorship.submitWaitResult(confirmSponsorshipArgs);

    const { sponsorship } = await sdk.collections.get({ collectionId: 1 });

    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - true`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

#### Arguments

`address: string` — sponsor address

`collectionId: number` — collection id

#### Behaviour and errors

This method takes collection id and confirms the signer to be a collection sponsor.

The collection **owner** should call the [set collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-sponsor) with the **sponsor** address, otherwise, an error will be thrown.

Only an unconfirmed **sponsor** of the collection should call and sign this method.

Throws common errors on insufficient balance and so on.

#### Returns

This method returns `ConfirmSponsorshipResult`

```typescript
    interface ConfirmSponsorshipResult {
        /**
         * id of the collection
         */
        collectionId: number;
    
        /**
         * address of the sponsor (Substrate)
         */
        sponsor: Address;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import { ConfirmSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const confirmSponsorshipArgs: ConfirmSponsorshipArguments = {
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    };
    
    await sdk.collections.confirmSponsorship.submitWaitResult(confirmSponsorshipArgs);
    
    const { sponsorship } = await sdk.collections.get({ collectionId: 1 });
    
    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - true`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
    'https://rest.unique.network/opal/collection/sponsorship/confirm' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp",
    "collectionId": 1
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.confirmSponsorship.submitWaitResult({
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    });
    
    const { parsed: { sponsor, collectionId } } = result;
    
    console.log(`${sponsor} approved sponsorship of ${collectionId} collection`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Next sponsored

</template><template v-slot:body>

#### Overview

This method returns the number of blocks when the sponsored transaction is available. Returns null if sponsorship hasn't been set.

#### Brief example

```typescript
import {
  NextSponsoredArguments,
  NextSponsoredResult,
} from '@unique-nft/substrate-client/types';

const args: NextSponsoredArguments = {
  collectionId: 1,
  tokenId: 1,
  address: '5G4M7RCt8PvtFPFm4XSwu85eK9Z8n9c6rygHZawHVALUvgcd',
  // at: "0xa37d1c0155bda5877f4bc64c62cd37022c1b6db201c8225da7d169336d38b257"
};

const result: NextSponsoredResult = await sdk.collections.nextSponsored(args);

console.log(result);
/*
{
  "blockNumber": 0
}
*/
```

#### Arguments

`collectionId: number` - ID of collection

`tokenId: number` - ID of token

`address: string` - Address of transaction account

`at: string` - _optional_ - Hash of execution block

#### Returns

This method returns `NextSponsoredResult`

```typescript
type NextSponsoredResult = {
  blockNumber: number | null;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import {
  NextSponsoredArguments,
  NextSponsoredResult,
} from '@unique-nft/substrate-client/types';

const args: NextSponsoredArguments = {
  collectionId: 1,
  tokenId: 1,
  address: '5G4M7RCt8PvtFPFm4XSwu85eK9Z8n9c6rygHZawHVALUvgcd',
  // at: "0xa37d1c0155bda5877f4bc64c62cd37022c1b6db201c8225da7d169336d38b257"
};

const result: NextSponsoredResult = await sdk.collections.nextSponsored(args);

console.log(result);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/collection/next-sponsored?collectionId=934&address=5GbRWxdwL8eHAgVaeXW3GUBffyLaKaLRhXXPwcnZbbzKDUU8&tokenId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.tokens.nextSponsored({
  collectionId: 1,
  tokenId: 1,
  address: '5G4M7RCt8PvtFPFm4XSwu85eK9Z8n9c6rygHZawHVALUvgcd',
});

console.log(result);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Remove collection sponsor

</template><template v-slot:body>

#### Overview

The collection **owner** can use this method to remove **sponsors** added by the [set collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-sponsor) method.

#### Brief example

```typescript
    import { RemoveSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const removeSponsorshipArgs: RemoveSponsorshipArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
    };
    
    await sdk.collections.removeSponsorship.submitWaitResult(removeSponsorshipArgs);

    const { sponsorship } = await sdk.collections.get({ collectionId: 1 });

    // `null`
    console.log(sponsorship);
```

#### Arguments

`address: string` — collection owner address

`collectionId: number` — collection id

#### Behaviour and errors

This method takes the collection id and removes the collection sponsor.

Only collection **owners** are allowed to call this method.

Throws common errors on insufficient balance and so on.

#### Returns

This method returns `RemoveSponsorshipResult`

```typescript
    interface RemoveSponsorshipResult {
        /**
         * id of the collection
         */
        collectionId: number;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import { RemoveSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const removeSponsorshipArgs: RemoveSponsorshipArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
    };
    
    await sdk.collections.removeSponsorship.submitWaitResult(removeSponsorshipArgs);
    
    const { sponsorship } = await sdk.collections.get({ collectionId: 1 });
    
    // `null`
    console.log(sponsorship);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'DELETE' \
    'https://rest.unique.network/opal/collection/sponsorship' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ",
    "collectionId": 1
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.removeSponsorship.submitWaitResult({
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
    });
    
    const { parsed: { collectionId } } = result;
    
    console.log(`${collectionId} now works without sponsoring`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Set collection sponsor

</template><template v-slot:body>

#### Overview

The collection **owner** can use this method to set the **sponsor** of the collection.

After that **sponsor** should [confirm sponsorship](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/confirm-sponsorship) and the sponsoring mechanism will be enabled.

The collection **owner** can also [remove collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/remove-collection-sponsor).

#### Brief example

```typescript
    import { SetCollectionSponsorArguments } from '@unique-nft/substrate-client/tokens/types';
    
    const setSponsorArgs: SetCollectionSponsorArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
        newSponsor: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
    };
    
    await sdk.collections.setCollectionSponsor.submitWaitResult(setSponsorArgs);

    const { sponsorship } = await sdk.collections.get({ collectionId: 1 });

    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - false`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

#### Arguments

`address: string` — collection owner address

`collectionId: number` — collection id

`newSponsor: string` — address of new sponsor


#### Behaviour and errors

The method takes an address and sets it as a collection sponsor.

The signer must be an admin of the collection.

Be aware that if the address is already a sponsor of the given collection no exception will be thrown, but a fee will be charged.

Throws common errors on insufficient balance.

#### Returns

This method returns `SetSponsorshipResult`

```typescript
    interface SetSponsorshipResult {
        /**
         * id of the collection
         */
        collectionId: number;
    
        /**
         * address of the sponsor (Substrate)
         */
        sponsor: Address;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
    import { SetCollectionSponsorArguments } from '@unique-nft/substrate-client/tokens';
    
    const setSponsorArgs: SetCollectionSponsorArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
        newSponsor: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
    };
    
    await sdk.collections.setCollectionSponsor.submitWaitResult(setSponsorArgs);
    
    const { sponsorship } = await sdk.collections.get({ collectionId: 1 });
    
    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - false`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
    'https://rest.unique.network/opal/collection/sponsorship' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ",
    "collectionId": 1,
    "newSponsor": "5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp"
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.setSponsorship.submitWaitResult({
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
        newSponsor: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
    });
    
    const { parsed: { sponsor, collectionId } } = result;
    
    console.log(`${sponsor} should now approve sponsorship of ${collectionId} collection`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

## Statistics

<Details><template v-slot:header>

### Get account tokens of the collection

</template><template v-slot:body>

#### Overview
Returns an array of tokens, owned by address.

#### Brief example

```typescript
import { AccountTokensResult } from '@unique-nft/substrate-client/tokens';

const tokensResult: AccountTokensResult = await sdk.tokens.getAccountTokens({
  collectionId: 1,
  address: '<address>',
});

const token = tokensResult.tokens[0];
const { collectionId, tokenId } = token;
```

#### Arguments

`collectionId: number` - ID of collection 

`address: string` - address of tokens owner

#### Behaviour and errors

#### Returns

This method returns `AccountTokensResult`

```typescript
import { TokenIdArguments } from '@unique-nft/substrate-client/tokens';

interface AccountTokensResult {
  tokens: TokenIdArguments[];
}
```

#### Examples


<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
  import { AccountTokensArguments, AccountTokensResult } from '@unique-nft/substrate-client/tokens';
  
  const accountTokensArguments: AccountTokensArguments = {
      address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
      collectionId: 1,
  };
  
  const tokensResult: AccountTokensResult = await sdk.tokens.getAccountTokens(accountTokensArguments);
  
  const token = tokensResult.tokens[0];
  const { collectionId, tokenId } = token;
  
  console.log(`${collectionId} - ${tokenId}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.unique.network/opal/token/account-tokens?address=5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp&collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const tokensResult = await sdk.tokens.accountTokens({
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    });

    const token = tokensResult.tokens[0];
    const { collectionId, tokenId } = token;
    
    console.log(`${collectionId} - ${tokenId}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Get collection tokens

</template><template v-slot:body>

#### Overview

This method gets tokens contained within a collection.

#### Brief example

```typescript
import { CollectionTokensResult } from '@unique-nft/substrate-client/tokens/types';

const result: CollectionTokensResult = await sdk.collections.tokens({
  collectionId: 1,
});
```

#### Arguments

`collectionId: number` - Collection ID

#### Behaviour and errors

#### Returns

This method returns `CollectionTokensResult` - an array of token Ids contained within the passed collection.

```typescript
interface CollectionTokensResult {
  ids: number[];
}
```


#### Examples

<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
  import { CollectionTokensResult } from '@unique-nft/substrate-client/tokens';

  const tokensResult: CollectionTokensResult = await sdk.collections.tokens({
    collectionId: 1,
  });
  
  const { ids } = tokensResult;
  
  console.log(`ids - ${ids}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.unique.network/opal/collection/tokens?collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const tokensResult = await sdk.collections.tokens({
        collectionId: 1,
    });

    const { ids } = tokensResult;
    
    console.log(`ids - ${ids}`);
```

  </CodeGroupItem>

</CodeGroup>


</template></Details>

<Details><template v-slot:header>

### Get collection stats

</template><template v-slot:body>

#### Overview

Returns blockchain collection statistics:
 - The number of total collections created
 - The number of destroyed collections
 - The number of collections that are still alive

#### Brief example

```typescript
import { GetStatsResult } from '@unique-nft/substrate-client/types';

const stats: GetStatsResult = await sdk.collections.getStats();

console.log(`stats: ${stats.created}, ${stats.destroyed}, ${stats.alive}`);
```


#### Arguments

No arguments required.

#### Returns

This method returns `GetStatsResult`
```typescript
interface GetStatsResult {
  created: number;
  destroyed: number;
  alive: number;
}
```

#### Examples

<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
  import { CollectionTokensResult } from '@unique-nft/substrate-client/tokens';

  const stats: GetStatsResult = await sdk.collections.getStats();
  
  const { created, destroyed, alive } = stats;
  
  console.log(`stats - ${created}, ${destroyed}, ${alive}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.unique.network/opal/collection/stats'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const stats = await sdk.collections.stats();

    const { created, destroyed, alive } = stats;

    console.log(`stats - ${created}, ${destroyed}, ${alive}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Last token id

</template><template v-slot:body>

#### Overview

The method gets the last generated token id.

#### Brief example

```typescript
import { LastTokenIdResult } from '@unique-nft/substrate-client/types';

const lastTokenIdResult: LastTokenIdResult = await sdk.collections.lastTokenId({
  collectionId: 1,
});

const { tokenId } = lastTokenIdResult;

console.log(`tokenId - ${tokenId}`);
```

#### Arguments

`collectionId: number` - ID of collection

#### Returns

This method returns `LastTokenIdResult`
```typescript
interface LastTokenIdResult {
  tokenId: number;
};
```

#### Examples


<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
  import { LastTokenIdResult } from '@unique-nft/substrate-client/types';

  const lastTokenIdResult: LastTokenIdResult = await sdk.collections.lastTokenId({
    collectionId: 1,
  });
  
  const { tokenId } = lastTokenIdResult;
  
  console.log(`tokenId - ${tokenId}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.unique.network/opal/collection/last-token-id?collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const lastTokenId = await sdk.collections.lastTokenId();

    const { tokenId } = lastTokenId;

    console.log(`lastTokenId - ${tokenId}`);
```

  </CodeGroupItem>

</CodeGroup>


</template></Details>

<Details><template v-slot:header>

### Total supply

</template><template v-slot:body>

#### Overview

Returns the number of tokens in the collection.

#### Brief example

```typescript
import {
  TotalSupplyResult,
} from '@unique-nft/substrate-client/tokens/types';

const result: TotalSupplyResult = await sdk.collections.totalSupply({
  collectionId: 1
});
const { totalSupply } = result;

console.log(`totalSupply - ${totalSupply}`);
```


#### Arguments

`collectionId: number` - ID of collection

`blockHashAt?: number` - hash of execution block, is optional

#### Returns

This method returns `LastTokenIdResult`

```typescript
interface TotalSupplyResult {
  totalSupply: number;
}
```

#### Examples


<CodeGroup>
  <CodeGroupItem title="JS">

```typescript
  import {
    TotalSupplyResult,
  } from '@unique-nft/substrate-client/tokens/types';
  
  const result: TotalSupplyResult = await sdk.collections.totalSupply({
    collectionId: 1
  });
  const { totalSupply } = result;
  
  console.log(`totalSupply - ${totalSupply}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.unique.network/opal/collection/total-supply?collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.collections.totalSupply();

    const { totalSupply } = result;

    console.log(`totalSupply - ${totalSupply}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

## Token

<Details><template v-slot:header>

### Get allowance

</template><template v-slot:body>

#### Overview

Get the amount of token pieces approved to transfer

#### Brief example

```typescript
import { AllowanceArguments } from '@unique-nft/substrate-client/tokens/types';

const AllowanceArgs: AllowanceArguments = {
    from: '<address>',
    to: '<address>',
    collectionId: 1,
    tokenId: 1,
};

const { isAllowed } = await sdk.tokens.allowance(AllowanceArgs);
```


#### Arguments

`from: string` - address from

`to: string` - address to

`collectionId: number` - ID of collection

`tokenId: number` - ID of token

`at?: string` — hash of execution block

#### Behaviour and errors

Throw errors:

- Collection or token not found

#### Returns

This method returns `AllowanceResult`

```typescript
type AllowanceResult = {
    isAllowed: boolean;
}
```

#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```typescript
import { AllowanceArguments } from '@unique-nft/substrate-client/tokens/types';

const AllowanceArgs: AddToAllowListArguments = {
    from: '<address>',
    to: '<address>',
    collectionId: 1,
    tokenId: 1,
};

const { isAllowed } = await sdk.tokens.allowance(AllowanceArgs);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'http://localhost:3000/token/allowance?collectionId=1&tokenId=1&from=<address>&to=<address>' \
  -H 'accept: application/json'
```
  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { isAllowed } = await sdk.tokens.allowance({
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    newAdminId: '<valid address>'
});
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Burn token

</template><template v-slot:body>

#### Overview

This method destroys a concrete instance of NFT or amount of Fungible token.

If the **from** parameter is specified, then the token is destroyed on behalf of **the owner of the item**.

Only the **Collection Owner**, **Collection Admin**, or **Current NFT owner** has permission to call this method.

#### Brief example

```typescript
import '@unique-nft/substrate-client/tokens';
import { BurnTokenArguments } from '@unique-nft/substrate-client/tokens/types';
const burnItemArgs: BurnTokenArguments = {
  tokenId: 1,
  collectionId: 1,
};
const setResult = await sdk.tokens.burn.submitWaitResult(burnItemArgs);
const { collectionId, tokenId, address, value } = setResult.parsed;
```

#### Arguments

`address: string` - Signer address

`collectionId: number` - ID of the collection

`tokenId: number` - ID of NFT to burn

Optional Arguments

`from?: string` - The owner of the item on whose behalf the token is destroyed

`value?: number` - Amount to burn
  - Non-Fungible Mode: Ignored
  - Fungible Mode: Must specify the transferred amount
  - Re-Fungible Mode: Must specify transferred portion (between 0 and 1)

#### Behaviour and errors

Throw errors:

- Collection or token not found
- The **Signer** or **from** addresses do not have permission to call this method
- If **the owner of the collection** (but not the owner of the token) wants to burn the token and the **ownerCanDestroy** flag is set to false. Check the set limits using the method [effectiveCollectionLimits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../effective-collection-limits)
- Insufficient balance

#### Returns

This method returns `BurnTokenResult`

```typescript
  interface BurnTokenResult {
    collectionId: number;
    tokenId: number;
    address: Address;
    value: number;
  }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import '@unique-nft/substrate-client/tokens';
import { BurnTokenArguments } from '@unique-nft/substrate-client/tokens/types';
const burnItemArgs: BurnTokenArguments = {
  tokenId: 1,
  collectionId: 1,
};
const setResult = await sdk.tokens.burn.submitWaitResult(burnItemArgs);
const { collectionId, tokenId, address, value } = setResult.parsed;
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'DELETE' \
    'http://rest.unique.network/opal/token?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "collectionId": 183,
    "tokenId": 5,
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.tokens.burn.submitWaitResult({
      "collectionId": 1,
      "tokenId": 1,
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    });
    
    const { parsed: { collectionId, tokenId } } = result;
    
    console.log(`burned token ${tokenId} collection ${collectionId}`);

```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Create multiple tokens

</template><template v-slot:body>

#### Overview

This method creates multiple items in a collection.

Only the **Collection Owner**, **Collection Admin** and addresses from the **Allow List** (if **Allow List** is enabled and **MintPermission** is enabled) can mint tokens.

#### Brief example

```typescript
import { CreateMultipleTokensArguments } from '@unique-nft/substrate-client/tokens';

import {
  UniqueCollectionSchemaToCreate,
  COLLECTION_SCHEMA_NAME,
  AttributeType,
} from '@unique-nft/substrate-client/tokens';

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

const token = await sdk.tokens.get({ collectionId, tokenId });
```

#### Arguments

`address: Address` - The address of the collection owner

`collectionId: number` - Collection id

`data: Array<UniqueTokenToCreate & { owner?: string} >` - The content of the tokens:

- Description **UniqueTokenToCreate** available in [Create token](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/create-token)

- `owner?: string` - The address of token owner (optional)

#### Behaviour and errors

Throw errors:

- Collection not found
- The signer must be **Collection Owner** or **Collection Admin** or in **Allow List** of the collection
- The collection is set **TokenLimit** and creating a new token will exceed the token limit
- Insufficient balance

#### Returns

This method returns `TokenIdArguments[]`

```typescript
interface TokenIdArguments {
  collectionId: number;
  tokenId: number;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { CreateMultipleTokensArguments } from '@unique-nft/substrate-client/tokens';

import {
  UniqueCollectionSchemaToCreate,
  COLLECTION_SCHEMA_NAME,
  AttributeType,
} from '@unique-nft/substrate-client/tokens';

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

const token = await sdk.tokens.get({ collectionId, tokenId });
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'POST' \
    'http://rest.unique.network/opal/token/create-multiple?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "collectionId": 183,
    "data": [
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
        }
      },
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image2.png"
        }    
      }
    ]
  }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
  const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
  
  const result = await sdk.tokens.createMultiple.submitWaitResult({
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "collectionId": 183,
    "data": [
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
        }
      },
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image2.png"
        }
      }
    ]
  });
  
  const { parsed } = result;
  
  console.log(`minted ${parsed.length} tokens`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Create token (mint)

</template><template v-slot:body>

#### Overview

This method creates a concrete instance of NFT collection.

Collection can be created with [Create collection](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../create-collection-ex-new) method.

Only the **Collection Owner**, **Collection Admin** and addresses from the **Allow List** (if **Allow List** is enabled and **MintPermission** is enabled) can mint token.

The **owner** of the token is specified in the **owner** field. If the owner field is not set, then the **Signer** becomes the owner of the token.

#### Brief example

```typescript
import { CreateTokenNewArguments } from '@unique-nft/substrate-client/tokens/types';

import {
  UniqueCollectionSchemaToCreate,
  COLLECTION_SCHEMA_NAME,
  AttributeType,
} from '@unique-nft/substrate-client/tokens';

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

const result = await sdk.tokens.create.submitWaitResult(createArgs);
const { collectionId, tokenId } = result.parsed;

const token = await sdk.tokens.get({ collectionId, tokenId });   
```

#### Arguments

`address: string` - The address of collection owner

`collectionId: number` - Collection id

`owner?: string` - The address of token owner (optional)

`data: UniqueTokenToCreate` - The content of the token is stored in the fields of the object:

- `name?: LocalizedStringWithDefault*`
  
- `description?: LocalizedStringWithDefault*`

- `image: GenericInfixUrlOrCidWithHash**` - Token image (`url`, `urlInfix` or `ipfsCid`)

- `imagePreview?: GenericInfixUrlOrCidWithHash**`

- `video?: GenericInfixUrlOrCidWithHash**`

- `audio?: GenericInfixUrlOrCidWithHash**`

- `spatialObject?: GenericInfixUrlOrCidWithHash**`

- `encodedAttributes?: EncodedTokenAttributes` - Token attributes

&ast; Type **LocalizedStringWithDefault**

```typescript
{
  _: string;
  [K: string]: string;
}
```

&ast; Type **GenericInfixUrlOrCidWithHash**
```typescript
  { urlInfix?: string; hash?: string | null }
  | { url?: string; hash?: string | null }
  | { ipfsCid?: string; hash?: string | null };
```

#### Behaviour and errors

Throw errors:

- Collection not found
- The signer must be **Collection Owner** or **Collection Admin** or in **Allow List** of the collection
- The collection is set **TokenLimit** and creating a new token will exceed the token limit (TokenLimit includes all the tokens that have been minted, even if some of them were burned after)
- Insufficient balance

#### Returns

This method returns `TokenIdArguments`

```typescript
  interface TokenIdArguments extends CollectionIdArguments {
    tokenId: number;
  }   
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { CreateTokenNewArguments } from '@unique-nft/substrate-client/tokens/types';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
} from '@unique-nft/substrate-client/tokens';

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

const result = await sdk.tokens.create.submitWaitResult(createArgs);
const { collectionId, tokenId } = result.parsed;

const token = await sdk.tokens.get({ collectionId, tokenId });
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'POST' \
    'http://rest.unique.network/opal/token?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "collectionId": 183,
    "data": {
      "image": {
        "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
      },
      "name": {
        "_": "Hello!"
      },
      "description": {
        "_": "Hello!"
      }
    }
  }'

# then we sign, then we call

    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.tokens.create.submitWaitResult({
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "collectionId": 183,
      "data": {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
        },
        "name": {
          "_": "Hello!"
        },
        "description": {
          "_": "Hello!"
        }
      }
    });
    
    const { parsed: { collectionId, tokenId } } = result;
    
    console.log(`created token ${tokenId} in collection ${collectionId}`);
```

  </CodeGroupItem>

</CodeGroup>


</template></Details>

<Details><template v-slot:header>

### Delete token properties

</template><template v-slot:body>

#### Overview

Deletes **properties** (see [Token properties](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/token-properties)) from a token.

#### Brief example

```typescript
  const args: DeleteTokenPropertiesArguments = {
    address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
    collectionId: 1,
    tokenId: 1,
    propertyKeys: ['foo', 'bar'],
  };
  
  const result = await sdk.tokens.deleteProperties.submitWaitResult(args);
  
  console.log(result.parsed);
```

#### Arguments

`address: string` - Signer, the address of the **Collection Owner**, **Collection Admin** or **Token Owner**

`collectionId: number` - Collection id

`tokenId: number` - Token id

`propertyKeys: string[]` - Array of properties keys

#### Behaviour and errors

Throw errors:

- Collection or token not found
- Signer is **Collection Admin** or **Token Owner** and does not have **permission** to call the method (see [Set token property permissions](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../collection/set-token-property-permissions) for details).
- Keys not in **tokenPropertyPermissions** list

#### Returns

This method returns `DeleteTokenPropertiesResult`

```typescript
  type DeleteTokenPropertiesResult = {
    properties: Array<{
      collectionId: number;
      tokenId: number;
      propertyKey: string;
    }>;
  }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
  const args: DeleteTokenPropertiesArguments = {
    address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
    collectionId: 1,
    tokenId: 1,
    propertyKeys: ['foo', 'bar'],
  };
  
  const result = await sdk.tokens.deleteProperties.submitWaitResult(args);
  
  console.log(result.parsed);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'DELETE' \
    'http://rest.unique.network/opal/token/properties?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
    "collectionId": 1,
    "tokenId": 1,
    "propertyKeys": ['\''foo'\'', '\''bar'\'']
  }'
  
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const { parsed: { properties } } = await sdk.tokens.deleteProperties.submitWaitResult({
      "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
      "collectionId": 1,
      "tokenId": 1,
      "propertyKeys": [
        "foo",
        "bar"
      ]
    });
    
    console.log(`removed properties  ${properties.map(t => t.propertyKey).join()}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Set token properties

</template><template v-slot:body>

#### Overview

Sets (creates or overwrites) [**properties**](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/token-properties) for token.

#### Brief example

```typescript
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

#### Arguments

`address: string` - Signer, the address of the **Collection Owner**, **Collection Admin** or **Token Owner**

`collectionId: number` - Collection id

`tokenId: number` - Token id

`properties: Array<{
  key: string;
  value: string;
  }>` - Array of properties

#### Behaviour and errors

Throw errors:

- Collection or token not found
- Signer is **Collection Admin** or **Token Owner** and does not have permission to call the method (see [Set token property permissions](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../collection/set-token-property-permissions) for details).
- Keys not in **tokenPropertyPermissions** list

#### Returns

This method returns `SetTokenPropertiesResult`

```typescript
  type SetTokenPropertiesResult = {
    properties: Array<{
      collectionId: number;
      tokenId: number;
      propertyKey: string;
    }>;
  };
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
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

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.unique.network/opal/token/properties?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
      "collectionId": 1,
      "tokenId": 1,
      "properties": [
        {
          "key": "foo",
          "value": "bar"
        }
      ]
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

    const { parsed: { properties } } = await sdk.tokens.setProperties.submitWaitResult({
      "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
      "collectionId": 1,
      "tokenId": 1,
      "properties": [
        {
          "key": "foo",
          "value": "bar"
        }
      ]
    });

    console.log(`the values of the keys ${properties.map(t => t.propertyKey).join()} are set`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Get token

</template><template v-slot:body>

#### Overview

Returns information about the NFT of a specific collection.

#### Brief example

```typescript
const token = await sdk.tokens.get({
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

#### Arguments

`collectionId: number` — collection id

`tokenId: number` — token id

#### Behaviour and errors

Throw errors:

- Collection not found (not created or destroyed)
- Token not found (not created or burned)
- Check path chain (CHAIN_WS_URL)

#### Returns

This method returns `TokenByIdResult`

```typescript
type TokenByIdResult = Omit<UniqueTokenDecoded, 'owner'> & {
  owner: Address;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
const token = await sdk.tokens.get({
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
  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.unique.network/opal/token?collectionId=2&tokenId=1' \
  -H 'accept: application/json'
```
  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

    const result = await sdk.tokens.get({
      collectionId: 2,
      tokenId: 1,
    });
    
    const { tokenId, owner } = result;
    
    console.log(`token ${tokenId} is owned by address ${owner}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Get token owner

</template><template v-slot:body>

#### Overview

This method allows you to get the current NFT **owner**.

The initial owner of the token is set to the address that signed the token creation extrinsic.

You can change the owner of the token using the [transfer token](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/transfer) method.

#### Brief example

```typescript
import {
  TokenOwnerArguments,
  TokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TokenOwnerResult = await sdk.tokens.tokenOwner(
  args,
);
```

#### Arguments

`collectionId: number` — collection ID

`tokenId: number` — token ID

`blockHashAt?: string` — hash of execution block


#### Behaviour and errors

Throw errors:

- Collection not found (not created or destroyed)
- Token not found (not created or burned)
- Check path chain (CHAIN_WS_URL)

#### Returns

The method returns `TokenOwnerResult`

```typescript
type TokenOwnerResult = { owner: Address }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import {
  TokenOwnerArguments,
  TokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TokenOwnerResult = await sdk.tokens.tokenOwner(
  args,
);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'GET' \
  'https://rest.unique.network/opal/token/owner?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const { owner } = await sdk.tokens.owner({
      collectionId: 1,
      tokenId: 1,
    });
    
    console.log(`token owner ${owner}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Token properties

</template><template v-slot:body>

#### Overview

Gets an array of token **properties**. Property keys must be in the **tokenPropertyPermissions** list (see [Set token property permissions](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../collection/set-token-property-permissions)).

#### Brief example

```typescript
import {
  TokenPropertiesArguments,
  TokenPropertiesResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenPropertiesArguments = {
  collectionId: 1,
  tokenId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: TokenPropertiesResult = await sdk.tokens.properties(args);
```

#### Arguments

`collectionId: number` - Collection ID

`tokenId: number` - Token ID

Additional arguments

`propertyKeys?: string[]` - Array of property keys

#### Behaviour and errors

Throw errors:

- Collection or token not found

#### Returns

This method returns `TokenPropertiesResult`

```typescript
type TokenPropertiesResult = {
  properties: Array<{
    key: string;
    value: string;
  }>;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import {
  TokenPropertiesArguments,
  TokenPropertiesResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenPropertiesArguments = {
  collectionId: 1,
  tokenId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: TokenPropertiesResult = await sdk.tokens.properties(args);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
  curl -X 'GET' \
    'https://rest.unique.network/opal/token/properties?collectionId=1&tokenId=1' \
    -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

    const { properties } = await sdk.tokens.properties({
      collectionId: 1,
      tokenId: 1,
    });
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Transfer token

</template><template v-slot:body>

#### Overview

This method changes the ownership of the token.

Only the **Collection Owner**, **Collection Admin**, or **Current NFT owner** has permission to call this method.

The **Current NFT owner** can be found using [Get token owner](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/token-owner) method.

#### Brief example

```typescript
import { TransferArguments } from '@unique-nft/substrate-client/tokens';

const args: TransferArguments = {
  address: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
```

#### Arguments

`address: string` - Signer address

`to: string` - Address of token recipient

`collectionId: number` - Collection id

`tokenId: number` - Token id

Optional Arguments

`from: string` - Address that owns token (default is signer address)

`value: number` - Amount to transfer (default is 1):
  - Non-Fungible Mode: Ignored
  - Fungible Mode: Must specify transferred amount
  - Re-Fungible Mode: Must specify transferred portion (between 0 and 1)

#### Behaviour and errors

Throw errors:

- Collection or token not found
- Signer is not a **Collection Owner**, **Collection Admin**, or **Current NFT owner**
- The restrictions set by the **transfersEnabled** or **ownerCanTransfer** flags apply. Check the set limits using the method [effectiveCollectionLimits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../effective-collection-limits)
- Insufficient balance

#### Returns

This method returns `TransferResult`

```typescript
interface TransferResult {
  collectionId: number;
  tokenId: number;
  from: Address;
  to: Address;
  value: number;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="JS">

```typescript
import { TransferArguments } from '@unique-nft/substrate-client/tokens';

const args: TransferArguments = {
  address: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'PATCH' \
    'http://rest.unique.network/opal/token/transfer?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "collectionId": 183,
    "tokenId": 1,
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "to": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"
  }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Substrate Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.tokens.transfer.submitWaitResult({
      "collectionId": 183,
      "tokenId": 1,
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "to": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"
    });
    
    const { parsed: { collectionId, tokenId, to } } = result;
    
    console.log(`${to} is the new owner of token ${tokenId} from collection ${collectionId}`);
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

## Other

<Details><template v-slot:header>

### Approve

</template><template v-slot:body>

#### Overview

Set, change, or remove approved address to transfer the ownership of the token.

#### Brief example

```typescript
import { ApproveArguments } from '@unique-nft/substrate-client/tokens/types';

const approveArgs: ApproveArguments = {
    address: '<Signer address>',
    spender: '<Account address for whom token will be approved>',
    collectionId: '<ID of the collection>',
    tokenId: '<ID of the token>',
    isApprove: true
};

const result = await sdk.tokens.approve.submitWaitResult(approveArgs);
const { collectionId, tokenId } = result.parsed;
```

#### Arguments

`address: string` - **Signer** address

`spender: string` - Address that is approved to transfer this token

`collectionId: number` - Collection id

`tokenId: number` - Token id

`isApprove: boolean` - Must be true (for approval) or false (for disapproval)

#### Behaviour and errors

Throw errors:

- Collection ot token not found
- **Signer** is not **Collection Owner**, **Collection Admin** or **Token Owner**

#### Returns

This method returns `ApproveResult`

```typescript
interface ApproveResult {
    collectionId: number;
    tokenId: number;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { ApproveArguments } from '@unique-nft/substrate-client/tokens/types';

const approveArgs: ApproveArguments = {
    address: '<Signer address>',
    spender: '<Account address for whom token will be approved>',
    collectionId: '<ID of the collection>',
    tokenId: '<ID of the token>',
    isApprove: true
};

const result = await sdk.tokens.approve.submitWaitResult(approveArgs);
const { collectionId, tokenId } = result.parsed;
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'POST' \
      'http://localhost:3000/v1/tokens/approve?use=Build&withFee=false&verify=false' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "spender": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      "collectionId": 1,
      "tokenId": 1,
      "isApprove": true
    }'

    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.unique.network/opal/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
    const result = await sdk.tokens.approve.submitWaitResult({
        address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        spender: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        collectionId: 1,
        tokenId: 1,
        isApprove: true
    });
    
    const { collectionId, tokenId } = result.parsed;
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>

<Details><template v-slot:header>

### Token exists

</template><template v-slot:body>

#### Overview

Checks if token exists in collection. Returns true or false.

#### Brief example

```typescript
const { isExists } = await sdk.tokens.exists({ collectionId: 1, tokenId: 1 });
```

#### Arguments

`collectionId: number` - ID of collection

`tokenId: number` - ID of token

`at: string` - _optional_ - Hash of execution block

#### Behaviour and errors

Throw errors:

- Collection or token not found

#### Returns

This method returns `TokenExistsResult`

```typescript
type TokenExistsResult = {
    isExists: boolean;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
const { isExists } = await sdk.tokens.exists({ collectionId: 1, tokenId: 1 });
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
      'https://rest.unique.network/opal/v1/tokens/exists?collectionId=1&tokenId=1' \
      -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { isExists } = await sdk.tokens.exists({
    collectionId: 1,
    tokenId: 1
});
```

  </CodeGroupItem>

</CodeGroup>

</template></Details>


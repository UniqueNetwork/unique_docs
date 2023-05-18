# How to work with collections

[[toc]]

## Intro 

NFTs have become much easier to issue, and we’re seeing increasing amounts minted daily, mostly through NFT collections. This article will dive into NFT collection meaning, and some popular examples of how to work with NFT collections in Unique Network.

As the name implies, an NFT collection is basically a unique collection of NFTs. NFT artworks are generally created on a smaller scale with the involvement of concerned content creators or digital artists. In addition, you would also notice that individual NFT artworks are available for sale on different NFT marketplaces.

In Unique Network, the collection has the following entities: 

- **name** - a collection name that defines it in the global scope; 
- **description** - some additional details about the collection;
- **token prefix** - short string value that will be added to token Ids. As a result, a token will have id equals `DEM-31`, where is `DEM` is a token prefix; 
- **properties** - a unique set of keys and values which defines collection specifics; 
- **limits** - a set that defines the rules for a collection, e.g. whether it can be transferred, or how much tokens you can mint in it; 
- **owner** - an address that created a collection (or if the collection was transferred, the address that owns the collection at the moment);  
- **admins** - a collection can be controlled by multiple admin addresses. Admins can issue and burn NFTs, as well as add and remove other admins, but they cannot change NFT or collection ownership; 
- **allow list** - a list of addresses collected that allow certain community members a guaranteed spot for minting a new NFT. 

## Prerequisites

We'll need a Substrate address to use in this example. If you do not have it yet, please check [Create an account](../tutorials/how-to-accounts.md#create-an-account-via-code).

And, since some Opal tokens are required to pay for the transaction fees as well (around 2 to 2.5 OPL), please make sure that your balance has some tokens. These can be obtained via the [Telegram faucet bot](https://t.me/unique2faucet_opal_bot).

We will use SDK and some other packages in this section. To learn how to install SDK, please refer to [SDK Installation](../sdk/installation.md).

## Collection creation

### Create a collection

Please find below a full sample code that creates an account from a mnemonic phrase, initializes SDK, and then creates a collection on the Opal testnet.

:warning: Please note that you need to use your mnemonic phrase, or even use another way to initialize your account
(see [Create an account](../tutorials/how-to-account.md#create-an-account-via-code)).

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
import Sdk from '@unique-nft/sdk';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

const baseUrl = 'https://rest.unique.network/opal/v1';
const mnemonic = 'bus ahead nation nice damp recall place dance guide media clap language';

// Creating an SDK client
function createSdk(account) {
  const options = {
    baseUrl,
    signer: account,
  }
  return new Sdk(options);
}

// Creating a sample collection
// The signer specified in the SDK constructor is used to sign an extrinsic
export async function createCollection(sdk, address) {
  const { parsed, error } = await sdk.collections.creation.submitWaitResult({
    address,
    name: 'Test collection',
    description: 'My test collection',
    tokenPrefix: 'TST',
  });

  if (error) {
    console.log('The error occurred while creating a collection. ', error);
    process.exit();
  }

  const { collectionId } = parsed;

  return sdk.collections.get({ collectionId });
}

// Entrypoint
async function main() {
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.instance.address;

  const sdk = createSdk(signer);

  const collection = await createCollection(sdk, address);
  console.log('The collection was create. ID: ', collection);
}

main();
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/collections?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{  
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "name": "Sample",
    "description": "Creating a simple collection with a minimal set of arguments",
    "tokenPrefix": "TEST"
  }'

# then we sign and call

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
</CodeGroup>

### Create a collection using schemas

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

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
import Sdk from "@unique-nft/sdk"
import {KeyringProvider} from "@unique-nft/accounts/keyring"
import {
  AttributeType,
  COLLECTION_SCHEMA_NAME,
  UniqueCollectionSchemaToCreate,
} from '@unique-nft/schemas'

const account = await KeyringProvider.fromMnemonic('bonus rubber price teach initial finger robust century scorpion pioneer require blade')

const sdk = new Sdk({
  baseUrl: 'https://rest.unique.network/opal/v1',
  signer: account,
})

const collectionSchema: UniqueCollectionSchemaToCreate = {
  schemaName: COLLECTION_SCHEMA_NAME.unique,
  schemaVersion: '1.0.0',
  image: {
    urlTemplate: 'https://gateway.pinata.cloud/ipfs/{infix}'
  },
  coverPicture: {
    ipfsCid: 'QmNiBHiAhsjBXj5cXShDUc5q1dX23CJYrqGGPBNjQCCSXQ',
  },

  attributesSchemaVersion: '1.0.0',
  attributesSchema: {
    0: {
      name: {_: 'attr num one'},
      type: AttributeType.string,
      optional: true,
      isArray: false,
    },
    1: {
      name: {_: 'attr num two'},
      type: AttributeType.string,
      optional: false,
      isArray: false,
      enumValues: {
        0: {_: 'value 1'},
        1: {_: 'value 2'},
      }
    },
    2: {
      name: {_: 'attr num three'},
      type: AttributeType.string,
      optional: true,
      isArray: true,
      enumValues: {
        0: {_: 'value 1'},
        1: {_: 'value 2'},
        2: {_: 'value 3'}
      }
    }
  },
}

const collectionResult = await sdk.collections.creation.submitWaitResult({
  address: account.getAddress(),
  name: 'sdk demo collection',
  description: 'test collection for sdk demo',
  tokenPrefix: 'DEM',
  schema: collectionSchema,
  tokenPropertyPermissions: [
    {
      key: 'a.0',
      permission: {
        mutable: true,
        tokenOwner: true,
        collectionAdmin: true,
      }
    }
  ]
})

console.log(collectionResult.parsed)
```

</CodeGroupItem>
<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/collections' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "mode": "Nft",
    "name": "Sample collection name",
    "description": "sample collection description",
    "tokenPrefix": "TEST",
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "schema": {
      schemaName: COLLECTION_SCHEMA_NAME.unique,
      schemaVersion: '1.0.0',
      image: { urlTemplate: 'some_url/{infix}.extension' },
      coverPicture: {
        ipfsCid: '<valid_ipfs_cid>',
      },
    }
  }'

# then we sign and call

curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'
```

</CodeGroupItem>
</CodeGroup>

## Get a collection 

Quite often, you may need to get a collection by its id. You can easily do this by the code below. 

<CodeGroup>

<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from "@unique-nft/sdk";

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const collection = await sdk.collections.get({ collectionId: 1 });
```

</CodeGroupItem>

<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'GET' \
  'https://rest.unique.network/opal/collection?collectionId=1' \
  -H 'accept: application/json'
```

</CodeGroupItem>

</CodeGroup>


## Collection settings

### Set collection limits

Your NFT collection have a bunch of various properties such as limits, permissions, token attributes and some others. Some of them you can set only while collection creation, but others you can set up later, when your collection is already created.

You can find the list of SDK methods, that you can use to adjust your collection [here](../sdk/methods.md#collection).

For example, let's update the collection limits using `sdk.collections.setLimits` method. The method sets some collection limits and starts enforcing them immediately. By the way, only the collection owner has the permission to call this method.

<CodeGroup>
<CodeGroupItem title = "SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });
    
const result = await sdk.collections.setLimits.submitWaitResult({
  limits: {
    accountTokenOwnershipLimit: 1000,
    sponsoredDataSize: 1024,
    sponsoredDataRateLimit: 30,
    tokenLimit: 1000000,
    sponsorTransferTimeout: 6,
    sponsorApproveTimeout: 6,
    ownerCanTransfer: false,
    ownerCanDestroy: false,
    transfersEnabled: false
  },
  address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  collectionId: 1,
});

const { parsed: { collectionId, limits } } = result;
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
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

# then we sign and call

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
</CodeGroup>


The full list of the `sdk.collections` module you can check right [in the sources](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/collection) of the `@unique/substrate-client` package.

### Change the owner of the collection

Each collection has an owner. It is defined when collection is created. However, it is possible to set a new collection owner if needed. However, you can do this **only on behalf of the collection owner** . Please check the samples below to learn how to do this. 

<CodeGroup>

<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from 'unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.collections.transfer.submitWaitResult({
  collectionId: 1,
  from: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
  to: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
});

const { parsed: { collectionId, owner } } = result;

console.log(`The new owner of collection # ${collectionId} has the ${owner} address.`);
```

</CodeGroupItem>
<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'PATCH' \
  'https://rest.unique.network/opal/collection/transfer?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collectionId": 1,
    "from": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    "to": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'

# then we sign and call

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
</CodeGroup>

## Properties

### Get collection properties 

The collections has properties. You can get the collection properties programmatically to check them. Please refer to the samples below to learn how to do this. 

<CodeGroup>

<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { properties } = await sdk.collections.properties({ collectionId: 1 });
```

</CodeGroupItem>
<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'GET' \
  'https://rest.unique.network/opal/collection/properties?collectionId=1' \
  -H 'accept: application/json'
```

</CodeGroupItem>
</CodeGroup>

### Set collection properties

Collection properties are a unique set of keys and values. The maximum number of keys is 64. The maximum size of a parameter data block (keys and values) is 40 kB.

Only the **collection owner** and **collection admin** can modify the collection properties.

Property keys can only be added and cannot be removed.

The keys names are restricted to a limited set of the following characters: latin letter (both uppercase and lowercase), number, dot, hyphen and underscore (here is regex that defines the described rules: `^[0-9a-zA-Z.-_]`).


<CodeGroup>

<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.collections.setProperties.submitWaitResult({
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  properties: [
    {
      "key": "foo",
      "value": "bar"
    }
  ]
});

const { parsed: { properties } } = result;

console.log(`Properties ${properties.map(t => t.propertyKey).join()} are set for the collection.`);
```

</CodeGroupItem>
<CodeGroupItem title="REST">

```bash:no-line-numbers
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

# then we sign and call

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
</CodeGroup>

## Admins

### Get admin list 

An NFT collection can be managed by multiple **admin** addresses. 
You can get an array of **collection admins**, for example to make sure that the needed address exists in this list. 
Please keep in mind that the admin list may be empty. 

Collection admins can mint and burn NFTs, and also add or remove other admins. However, admins cannot change NFT or collection ownership.

Please check the samples below to learn how to get admin list. 

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.collections.admins({ collectionId: 1 });

const { admins } = result;

console.log(`Collection admins: ${admins.join()}`);
```

</CodeGroupItem>
<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'GET' \
  'https://rest.unique.network/opal/collection/admins?collectionId=1' \
  -H 'accept: application/json'
```

</CodeGroupItem>
</CodeGroup>

### Add a collection admin 

Each collection has administrators. These addresses has permissions to perform all operations with the collection. When the collection already exists, you can add a new administrator to the list. Please check the code below to learn how to do this. 

:warning: Only collection owner or current collection admin has permission to do this.

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.collections.addAdmin.submitWaitResult({
	address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
	collectionId: 1,
	newAdmin: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
});

const { parsed: { collectionId, newAdmin } } = result;

console.log(`collection ${collectionId} has admin ${newAdmin}`);
```

</CodeGroupItem>
<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'POST' \
  'https://rest.unique.network/opal/collection/admins?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    "collectionId": 1,
    "newAdmin": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'

# then we sign and call

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
</CodeGroup>

### Remove a collection admin

It is possible to removes an admin address from the admin list. An admin can even remove himself/herself.
Only the collection Owner or collection Admin has permission to do this operation. 

The admin list become empty at some point. In this case, only **the collection owner** will be able to add a new admin.

Please check the samples below to learn how to remove a collection admin. 

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = await sdk.collections.removeAdmin.submitWaitResult({
  address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
  collectionId: 1,
  admin: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
});

const { parsed: { collectionId, admin } } = result;

console.log(`Admin ${admin} was removed from collection # ${collectionId}.`);
```

</CodeGroupItem>
<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'DELETE' \
  'https://rest.unique.network/opal/collection/admins?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    "collectionId": 1,
    "admin": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'
    
# then we sign and we call

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
</CodeGroup>


## Allow list 

### Add to allow list 

Adds an address to the allow list of a collection. 

Please check the samples below to learn how to add an address to the allow list. 

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { parsed } = await sdk.collections.addToAllowList.submitWaitResult({
  address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
  collectionId: 1,
  newAdmin: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
});

const { address, collectionId } = parsed;

console.log(`Address ${address} is allowed in collection # ${collectionId}.`);
```

</CodeGroupItem>

<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'POST' \
  'https://rest.unique.network/opal/collection/add-to-allow-list' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    "collectionId": 1,
    "newAdminId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'
```
</CodeGroupItem>
</CodeGroup>


### Get the allow list 

You can get the allow list of the specified collection.

Please check the samples below to learn how to get the allow list. 

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { addresses } = await sdk.collections.allowList({ collectionId: 1 });

console.log(`The addresses in the collection allow  list: ${addresses}`);
```

</CodeGroupItem>
<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'GET' \
  'https://rest.unique.network/opal/collection/allow-list?collectionId=1'
```
</CodeGroupItem>
</CodeGroup>


### Remove from the allow list 

You can get the allow list of the specified collection.

Please check the samples below to learn how to get the allow list. 

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript:no-line-numbers
import Sdk from '@unique-nft/sdk'

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const { parsed } = await sdk.collections.removeFromAllowList.submitWaitResult({
  address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
  collectionId: 1,
  addressToDelete: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
});

const { collectionId, address } = parsed;

console.log(`Address ${address} removed from allow list in collection ${collectionId}.`);
```

</CodeGroupItem>

<CodeGroupItem title="REST">

```bash:no-line-numbers
curl -X 'POST' \
  'https://rest.unique.network/opal/collection/remove-from-allow-list' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    "collectionId": 1,
    "addressToDelete": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'
```
</CodeGroupItem>
</CodeGroup>

## Destroy a collection

#### Limitations

There are some scenarios when it is impossible to destroy a collection:

- a collection is not found.
- not enough balance to destroy a collection.
- a collection contains tokens.
- your address is not the collection owner.
- the corresponding permission is specified when the collection is created.

##### Sample code

The samples below demonstrate how you can destroy the collection.

<CodeGroup>
<CodeGroupItem title = "SDK">

```typescript:no-line-numbers
import Sdk from "@unique-nft/sdk";

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

const result = sdk.collections.destroy.submitWaitResult({
	address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
	collectionId: 1,
});

const { success } = result.parsed;
```

</CodeGroupItem>
<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'DELETE' \
  'https://rest.unique.network/opal/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "collectionId": 1
  }'

# then we sign and call

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
</CodeGroup>
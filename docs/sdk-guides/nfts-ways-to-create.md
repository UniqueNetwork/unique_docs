# NFTs. Ways of creation

In this guide, we will go through the entire process of creating token using the Unique Network SDK.

To create tokens and collections, we need the following packages:

1) [@unique-nft/substrate-client](https://www.npmjs.com/package/@unique-nft/substrate-client)
2) [@unique-nft/accounts](https://www.npmjs.com/package/@unique-nft/accounts)


_**Ways of creation**_
- [Initialize SDK with signer](#initialize-sdk)
- [Upload file(optional)](#upload-file)
- [Create new collection](#create-collection)
- [Create new token](#create-token)

## Initialize sdk
To get signer we need to install NPM package [@unique-nft/accounts](https://www.npmjs.com/package/@unique-nft/accounts)
An easy way to get signer is to use the `KeyringProvider` function from the `@unique-nft/accounts/keyring` package:

### Get signer

```typescript
// signer.ts
import {KeyringProvider} from '@unique-nft/accounts/keyring';

export const getSigner = async (seed = '//Alice') => {
  const provider = new KeyringProvider({type: 'sr25519'});
  await provider.init();
  provider.addSeed(seed);
  const account = await provider.first();
  const signer = account?.getSigner();

  return signer;
}
```

### Initialize SDK

```typescript
// sdk.servicce.ts
const { Sdk } = require('@unique-nft/substrate-client');
import { getSigner } from './signer';

export const sdk = await Sdk.create({
  chainWsUrl: 'wss://ws-opal.unique.network',
  signer: await getSigner('//Alice'),
});
```

## Upload file

You can upload files in the following ways: upload to ipfs or use our [rest method](https://rest.opal.uniquenetwork.dev/swagger/#/ipfs/IpfsController_uploadFile)

Response example:

```json
{
  "cid": "QmUDXW8FbHQ1GGhJbj9kiPeCeTH5SX7QPHJFQGtEp9QeEm",
  "fileUrl": "https://ipfs.uniquenetwork.dev/ipfs/QmUDXW8FbHQ1GGhJbj9kiPeCeTH5SX7QPHJFQGtEp9QeEm"
}
```

And then use those response entities to create collections/tokens.

## Create collection

```typescript
import { CreateCollectionArguments } from '@unique-nft/substrate-client/types';
import '@unique-nft/substrate-client/tokens';
import { sdk } from './sdk.servicce.ts';

const myCollection: CreateCollectionArguments = {
  address: 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx',
  description: 'Just sample collection',
  name: 'Sample',
  tokenPrefix: 'SMPL',
  properties: {},
  shema: {
    coverPicture: {
      urlInfix: 'string',
      hash: 'string'
    },
    image: {
      urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext'
    },
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    coverPicturePreview: {
      urlInfix: 'string',
      hash: 'string'
    },
    imagePreview: {
      urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext'
    },
    audio: {
      urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext',
      format: 'string',
      isLossless: true
    },
  },
};

const result = await sdk.collections.creation.submitWaitResult(myCollection);
const collectionId = result.parsed.collectionId;
const collection = await sdk.collections.get({ collectionId });
```

#### Other ways to create collections
```typescript
/**
 * returns unsigned extrinsic
 */
const unsignedExtrinsic = await sdk.collections.creation.build(myCollection);

/**
 * return signed extrinsic (unsigned extrinsic + signature + signature type)
 */
const signedExtrinsic = await sdk.collections.creation.sign(myCollection);

/**
 * submitting extrinsic and returns extrinsic hash
 */
const { hash } = await sdk.collections.creation.submit(myCollection);

/**
 * submitting extrinsic and returns Observable of extrinsic progress
 */
const newCollection$ = sdk.collections.creation.submitWatch(myCollection);
```

#### Collection settings methods

1) setLimits
2) setProperties
3) deleteProperties
4) setPropertyPermissions
5) setSponsorship
6) confirmSponsorship
7) removeSponsorship
8) setPermissions
9) destroy
10) setTransfersEnabled
11) transfer
12) addAdmin
13) removeAdmin
14) addToAllowList
15) removeFromAllowList

## Create token

```typescript
import '@unique-nft/substrate-client/tokens';
import { sdk } from './sdk.servicce.ts';

const tokenData =   {
    "image": {
      "urlInfix": "string",
      "hash": "string"
    },
    "attributes": {
      "gender": "Male",
      "traits": [
        "Black Lipstick",
        "Red Lipstick"
      ]
    },
    "encodedAttributes": {
      "0": 0,
      "1": [
        0,
        1
      ]
    },
    "name": {
      "_": "Hello!",
      "en": "Hello!",
      "fr": "Bonjour!"
    },
    "audio": {
      "urlInfix": "string",
      "hash": "string"
    },
    "description": {
      "_": "Hello!",
      "en": "Hello!",
      "fr": "Bonjour!"
    },
    "imagePreview": {
      "urlInfix": "string",
      "hash": "string"
    },
    "spatialObject": {
      "urlInfix": "string",
      "hash": "string"
    },
    "video": {
      "urlInfix": "string",
      "hash": "string"
    }
}

const createTokensArgs = {
  owner,
  data: tokenData,
  properties: [{key: 'a', value: 'b'}],
  address,
  collectionId,
};

const result = await sdk.tokens.create.submitWaitResult(createTokensArgs);
const tokenId = result.parsed;

const token = await this.sdk.tokens.get({ collectionId, tokenId })
```

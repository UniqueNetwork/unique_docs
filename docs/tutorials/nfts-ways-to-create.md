# (Duplicate) Substrate Client. Different approaches to create a collection

In this guide, we will go through the entire process of creating token using the Unique Network SDK.

To create tokens and collections, we need the following packages:

[@unique-nft/substrate-client](https://www.npmjs.com/package/@unique-nft/substrate-client)

[@unique-nft/accounts](https://www.npmjs.com/package/@unique-nft/accounts)


## Initialization

To get signer we need to install the [@unique-nft/accounts](https://www.npmjs.com/package/@unique-nft/accounts) package. 
An easy way to get signer is to use the `KeyringProvider` function from the `@unique-nft/accounts/keyring` package:

#### Get a signer

```typescript:no-line-numbers
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

#### Initialize SDK

```typescript:no-line-numbers
// sdk.servicce.ts
import { Sdk } from '@unique-nft/substrate-client';
import { getSigner } from './signer';

export const sdk = await Sdk.create({
  chainWsUrl: 'wss://ws-opal.unique.network',
  signer: await getSigner('//Alice'),
});
```

## Upload a file

You can upload files in the following ways: upload to IPFS, or use our [Rest method](https://rest.opal.uniquenetwork.dev/swagger/#/ipfs/IpfsController_uploadFile).

Response example:

```json:no-line-numbers
{
  "cid": "QmUDXW8FbHQ1GGhJbj9kiPeCeTH5SX7QPHJFQGtEp9QeEm",
  "fileUrl": "https://ipfs.uniquenetwork.dev/ipfs/QmUDXW8FbHQ1GGhJbj9kiPeCeTH5SX7QPHJFQGtEp9QeEm"
}
```

And then, you can use those response entities to create collections/tokens.

## Create a collection

```typescript:no-line-numbers
import '@unique-nft/substrate-client/tokens';
import { sdk } from './sdk.servicce.ts';

const myCollection = {
  address: 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx',
  description: 'Just sample collection',
  name: 'Sample',
  tokenPrefix: 'SMPL',
  schema: {
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    image: { urlTemplate: 'https://ipfs.uniquenetwork.dev/ipfs/{infix}.ext' },
    coverPicture: {
      ipfsCid: 'QmZ6J9dVMa7B1Xd8PWXALyV8pQUSX5TNNSTpxxWuGH4ZRi',
    },
  },
};

const result = await sdk.collections.creation.submitWaitResult(myCollection);
const collectionId = result.parsed.collectionId;
const collection = await sdk.collections.get({ collectionId });
```

#### Other ways to create a collection

```typescript:no-line-numbers
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

`setLimits` - sets collection limits.

`setProperties` - sets collection properties.

`deleteProperties` - deletes collection properties. 

`setPropertyPermissions` - sets permissions for collection properties. 

`setSponsorship` - set sponsor of collection.

`confirmSponsorship` - confirms sponsorship of a collection.

`removeSponsorship` - deletes the collection sponsor. 

`setPermissions`- sets onchain permissions for a collection.

`destroy` - destroys collection if no tokens within this collection.

`setTransfersEnabled` - enables or disables transfers in a collection.

`transfer` - сhanges the owner of the collection.

`addAdmin` - adds an administrator of a collection.

`removeAdmin` - removes administrator of a collection.

`addToAllowList` - adds an address to the allow list. 

`removeFromAllowList` - removes an address from the allow list.

## Create a token

```typescript:no-line-numbers
import '@unique-nft/substrate-client/tokens';
import { sdk } from './sdk.servicce.ts';

// example ot token arguments
const createTokensArgs = {
  owner,
  data: {
    image: {
      ipfsCid: '<valid_ipfs_cid>',
    },
  },
  address,
  collectionId,
};

const result = await sdk.tokens.create.submitWaitResult(createTokensArgs);
const tokenId = result.parsed;

const token = await this.sdk.tokens.get({ collectionId, tokenId })
```

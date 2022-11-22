# NFTS. How to mint NFTs

## Preparation

Before to start creating tokens we should have:

1. [Substrate account](/sdk-guides/accounts/ways-to-create)
2. [Link to image in IPFS](#upload-images-to-ipfs)
3. [Collection ID](#create-collection)

## SDK

Install packages.

```bash
npm i @unique-nft/substrate-client --save
npm i @unique-nft/accounts --save
```

Like for previous steps you should have [SDK](/sdk-guides/examplesSDK.html) object with specified account for execute creating method.

```typescript
import { Sdk } from '@unique-nft/substrate-client';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

const mnemonic = 'bus ahead nation nice damp recall place dance guide media clap language';
const chainWsUrl = 'wss://ws-opal.unique.network';

const signer = await KeyringProvider.fromMnemonic(mnemonic);

const sdk = new Sdk({
  chainWsUrl,
  signer,
});
```

## Upload images to IPFS

If we have collection cover image or nft image we can upload these files by this script:

```typescript
import { createReadStream } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import mime from 'mime-types';

const filename = process.argv[process.argv.length - 1];

if (
  !filename ||
  filename === __filename
) {
  process.exit();
}

const URL = 'https://rest.unique.network/opal/v1/ipfs/upload-file';

const form = new FormData();
form.append(
  'file',
  createReadStream(filename),
  {
    contentType: mime.lookup(filename) as string,
    filename,
  },
);

const result = fetch(URL, { method: 'POST', body: form });
result.then((res) => {
  if (res.ok) {
    res.json().then(console.log);
  }
});
```

After uploading file we are getting response from server with IPFS Cid:

```json
{
  cid: 'Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1',
  fileUrl: 'https://ipfs.unique.network/ipfs/Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1'
}
```

## Create collection

For create awesome collection with cats(all love cats) we should set name, description, tokenPrefix and add some information about future tokens to attributes scheme.

Cover picture and url template we can take from previous step.

```typescript
  const { parsed: { collectionId } } = await sdk.collections.creation.submitWaitResult({
    address,
    name: 'Crazy cats',
    description: 'Crazy cats from village',
    tokenPrefix: 'CRC',
    schema: {
      schemaName: COLLECTION_SCHEMA_NAME.unique,
      schemaVersion: '1.0.0',
      coverPicture: {
        ipfsCid: 'Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1',
      },
      image: {
        urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}',
      },
      attributesSchemaVersion: '1.0.0',
      attributesSchema: {
        0: {
          name: { '_': 'sex' },
          type: AttributeType.string,
          optional: true,
          isArray: false,
          enumValues: {
            0: { '_': 'male' },
            1: { '_': 'female' }
          }
        },
        1: {
          name: { '_': 'name' },
          isArray: false,
          optional: false,
          type: AttributeType.string,
        },
        2: {
          name: { '_': 'color' },
          isArray: true,
          type: AttributeType.string,
          optional: true,
          enumValues: {
            0: { '_': 'black' },
            1: { '_': 'white' },
            2: { '_': 'gray' },
            3: { '_': 'brown' },
          },
        }
      }
    }
  });

  console.log('Collection ID: ', collectionId);
```

AttributesSchema should contain description of token fields like types, possible values, requirement flag and array with list of values.

## Create NFT token

In this moment we have all what we need to create NFT token.

```typescript
const { parsed: { tokenId } } = await sdk.tokens.create.submitWaitResult({
  address,
  collectionId,
  data: {
    image: {
      ipfsCid: 'QmQuDVCPqkQhXw37Tbi35Ue4xUXYgBsyifoWR69aCngn82',
    },
    encodedAttributes: {
      0: 0,
      1: { '_': 'Murzik' },
      2: [1, 2, 3],
    },
  }
});
```

How you can see, for creating token we should have account address.

We should pass CollectionID created from previous step and IPFS Cid.

If we have collection with specified schema attributes like that:

```typescript
{
  schemaName: COLLECTION_SCHEMA_NAME.unique,
  schemaVersion: '1.0.0',
  attributesSchemaVersion: '1.0.0',
  attributesSchema: {
    0: {
      name: { '_': 'sex' },
      type: AttributeType.string,
      optional: true,
      isArray: false,
      enumValues: {
        0: { '_': 'male' },
        1: { '_': 'female' }
      }
    },
    1: {
      name: { '_': 'name' },
      isArray: false,
      optional: false,
      type: AttributeType.string,
    },
    2: {
      name: { '_': 'color' },
      isArray: true,
      type: AttributeType.string,
      optional: true,
      enumValues: {
        0: { '_': 'black' },
        1: { '_': 'white' },
        2: { '_': 'gray' },
        3: { '_': 'brown' },
      },
    }
  }
}
```

We can define attributes for token in accordance with collection attributes schema:

```typescript
encodedAttributes: {
  0: 0,
  1: { '_': 'Murzik' },
  2: [1, 2, 3],
}
```

First attribute have 0 index and it means what cat sex is 'male' according enum with values.

Second attribute is mean what cat's name is 'Murzik' and that attribute can contain any text value.

Third attribute is color of cat and it can contains array of colors specified in enum with colors.

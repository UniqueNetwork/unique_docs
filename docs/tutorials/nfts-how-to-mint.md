# Substrate Client. Mint an NFT using schemas

### Create an account

Install the the needed packages.

<CodeGroup>
  <CodeGroupItem title="NPM" active>

```bash:no-line-numbers
npm i @unique-nft/substrate-client --save-dev
npm i @unique-nft/accounts --save-dev
```

  </CodeGroupItem>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/substrate-client --dev
yarn add @unique-nft/accounts --dev
```

  </CodeGroupItem>
</CodeGroup>


Import the required objects and initialize the account using the Substrate Client.

```typescript:no-line-numbers
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

### Upload images to IPFS

When we have a collection cover image or an NFT image, we can upload these files to IPFS by the following script:

```typescript:no-line-numbers
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

After uploading a file, we get a response from a server with an IPFS Cid:

```json:no-line-numbers
{
  cid: 'Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1',
  fileUrl: 'https://ipfs.unique.network/ipfs/Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1'
}
```

### Create a collection

For create a brand-new collection with cats, we should set a name, a description, a token prefix and add some information about future tokens. In other words, we should define a attributes scheme.

We can take the cover picture and the URL template from previous step.

```typescript:no-line-numbers
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

The `attributesSchema` object should contain a token description fields like types, possible values, requirement flag and an array with a list of values.

### Create an NFT token

When you perform all previos steps, you have all what is needed to create a new NFT token.

```typescript:no-line-numbers
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

console.log('Token was minted. ID: ', tokenId)
```

As you can see, for creating a token we should have an account address. Also, we should pass `CollectionID` created on the previous step and the IPFS Cid. 

If we have collection with specified schema attributes (see the collection schema [above](#create-a-collection)), we can define the token attributes in accordance with collection attributes schema:

```typescript:no-line-numbers
encodedAttributes: {
  0: 0,
  1: { '_': 'Jack' },
  2: [1, 2, 3],
}
```

First attribute have 0 index and it means what cat sex is 'male' according the enum values.

Second attribute means that cat name is 'Murzik' and that this attribute can contain any text value.

Third attribute is a cat color and it can contain the array of colors specified in the enum with colors.
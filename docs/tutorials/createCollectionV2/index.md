# Substrate Client. Mint an NFT using schema 2.0.0

Below is an example of creating a collection and generating a token. Upon executing this script, you will obtain a collection and token similar to the following:
 [Collection](https://market2.uniquenetwork.dev/opal/collection/2943)
 [Token](https://market2.uniquenetwork.dev/opal/token/2943/1).

 [Metadata description](/reference/schemas/2.0.0.html)

```typescript
import { Sr25519Account } from '@unique-nft/utils/sr25519';
import Sdk from '@unique-nft/sdk';
import * as dotenv from 'dotenv';

const SUBSTRATE_MNEMONIC = PUT_YOUR_MNEMONIC_HERE;

dotenv.config();

const getLinkToCollection = (sdk: Sdk, collectionId: number) => {
  return `${sdk.options.baseUrl}/collections?collectionId=${collectionId}`;
};

const getLinkToToken = (sdk: Sdk, collectionId: number, tokenId: number) => {
  return `${sdk.options.baseUrl}/tokens?collectionId=${collectionId}&tokenId=${tokenId}`;
};

const createCollectionV2 = async (sdk: Sdk): Promise<number> => {
  const collectionCreationV2Result = await sdk.collection.createV2({
    address: PUT_YOUR_ADDRESS_HERE,
    name: 'Collection V2',
    description: 'Test description Collection V2',
    tokenPrefix: 'DEMO',
    symbol: "TCD",
    cover_image: {
      "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
    },
    potential_attributes: [
        {
          "trait_type": "color",
          "values": [
            "red",
            "green",
            "blue"
          ]
        },
        {
          "trait_type": "shape",
          "values": [
            "Circle",
          ]
        },
        {
          "trait_type": "rarity",
          "values": [
            "10", "20", "30"
          ]
        }
    ],
    permissions: {nesting: {collectionAdmin: true}},
    limits: {ownerCanTransfer: true, ownerCanDestroy: true},
  });

  if (!collectionCreationV2Result.parsed) {
    throw collectionCreationV2Result.error;
  }
  const collectionId = collectionCreationV2Result.parsed.collectionId;
  console.log(`Collection created, id ${collectionId}. ${getLinkToCollection(sdk, collectionId)}`);
  return collectionId;
};

const mintTokensV2 = async (sdk: Sdk, collectionId: number) => {
  const tokensMintingResult = await sdk.token.createMultipleV2({
    collectionId,
    tokens: [
      {
        owner: sdk.options.account?.address,
        schemaName: "unique",
        schemaVersion: "2.0.0",
        image: "https://stage-ipfs.unique.network/ipfs/QmRcrfQfJsZxzgFt4aqvwAt9S662F6ym7zMGSLXYfkXhYC",
        name: "Demo Token",
        description: "Demo Token Description",
        background_color: "#00BFFF",
        image_details: {
          name: "test image details",
          type: "image",
        },
        attributes: [
          {
            "trait_type": "Color",
            "value": "Red"
          },
          {
            "trait_type": "Shape",
            "value": "Circle"
          },
          {
            "trait_type": "Rarity",
            "value": "20"
          }
        ],
        media: {
          image: {
            type: "image",
            url: "https://stage-ipfs.unique.network/ipfs/QmRcrfQfJsZxzgFt4aqvwAt9S662F6ym7zMGSLXYfkXhYC",
          },
          video: {
            type: "video",
            url: "https://stage-ipfs.unique.network/ipfs/QmcDMcdhp23fRe6aAZKwkJVsHzvSh5i3EdK2LPFhJPZjgb",
          },
          audio22: {
            type: "audio",
            url: "https://stage-ipfs.unique.network/ipfs/QmVniYM43KfoNahTM8Mg9UStG7LmC5rVAHYBKj9WnDjuRX",
          },
        },
        youtube_url: "https://www.youtube.com/embed/Ws5jIo4NMDc?si=ZtDRJwqoqdu1VQhU",
      },
    ],
  });

  if (!tokensMintingResult.parsed) {
    throw tokensMintingResult.error;
  }
  const tokenIds = tokensMintingResult.parsed.map(({ tokenId }) => tokenId);

  console.log(
    `Tokens minted in collection ${collectionId}, ids ${tokenIds.join(", ")}`
  );
  for (const tokenId of tokenIds) {
    console.log(`${getLinkToToken(sdk, collectionId, tokenId)}`);
  }

  return tokenIds;
};

const main = async () => {
  // init substrate account and sdk
  const mnemonic = SUBSTRATE_MNEMONIC
  if (!mnemonic) throw new Error('SUBSTRATE_MNEMONIC env variable is not set')
  const account = Sr25519Account.fromUri(mnemonic)
  const sdk = new Sdk({baseUrl: 'https://rest.uniquenetwork.dev/opal/v1', account})

  try {
    const collectionId = await createCollectionV2(sdk);
    await mintTokensV2(sdk, collectionId);
  } catch (e) {
    console.log(e);
  }
};


main()
  .catch((error) => {
    if (typeof error === 'object' && error !== null) {
      if (error.isAxiosError === true) {
        const url = error.response.request.res.responseUrl || error.config.url
        console.log({...error.response.data, url})
        if (error.details) {
          console.dir(error.details, {depth: 100})
        }
      } else {
        if (error.details) {
          console.log(error.toString())
          console.dir(error.details, {depth: 100})
        } else {
          console.error(error)
        }
      }
    } else {
      console.error(error)
    }
  }).finally(() => process.exit());
```

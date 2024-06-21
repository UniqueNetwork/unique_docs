# Mint an NFT using schema 2.0.0

Below is an example of creating a collection and generating a token. Upon executing this script, you will obtain a collection and token similar to the following:
 [Collection](https://unqnft.io/collection/654?filterState=)
 [Token](https://unqnft.io/unique/token/654/4).

 [Metadata description](/reference/schemas/2.0.0.html)

```typescript
import { Sr25519Account } from '@unique-nft/utils/sr25519';
import Sdk from '@unique-nft/sdk';
import * as dotenv from 'dotenv';

const SUBSTRATE_MNEMONIC = PUT_YOUR_MNEMONIC_HERE;

const getLinkToCollection = (sdk: Sdk, collectionId: number) => {
  return `${sdk.options.baseUrl}/collections?collectionId=${collectionId}`;
};

const getLinkToToken = (sdk: Sdk, collectionId: number, tokenId: number) => {
  return `${sdk.options.baseUrl}/tokens?collectionId=${collectionId}&tokenId=${tokenId}`;
};

const createCollectionV2 = async (sdk: Sdk): Promise<number> => {
  const collectionCreationV2Result = await sdk.collection.createV2({
    address: PUT_YOUR_ADDRESS_HERE,
    name: 'Winter Wonders: Husky Adventures',
    description: 'NFT collection of huskies in winter sports and snowy landscapes, capturing their adventurous spirit and joyful energy.',
    tokenPrefix: 'WWW',
    symbol: "WWW",
    cover_image: {
      "url": "https://stage-ipfs.unique.network/ipfs/QmXQs4AEdREu4ecyuVPJaNRYZCavwj75CAkjszDn84cPqP"
    },
    potential_attributes: [
      {
        "trait_type": "Fur Color",
      },
      {
        "trait_type": "Eye Color",
      },
      {
        "trait_type": "Winter Sport",
        "values": ["Skiing", "Snowboarding", "Sledding", "Ice Skating", "Snowshoeing"]
      },
      {
        "trait_type": "Accessory",
        "values": ["Scarf", "Hat", "Goggles", "Boots", "Jacket"]
      },
      {
        "trait_type": "Background",
        "values": ["Snowy Mountain", "Frozen Lake", "Snow-Covered Forest", "Cozy Cabin", "Snowfall"]
      },
      {
        "trait_type": "Rarity",
        "values": ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
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
        image: "https://stage-ipfs.unique.network/ipfs/QmPT3F16h5jPuELwBqHiApM7iWkQtJdSrok1Z4JDMhnze3",
        name: "Demo Hasky",
        description: "Demo Hasky Description",
        background_color: "#00BFFF",
        image_details: {
          name: "test image details",
          type: "image",
        },
        attributes: [
          {
            "trait_type": "Fur Color",
            "value": 'test string attribute 1'
          },
          {
            "trait_type": "Eye Color",
            "value": 'test string attribute 2'
          },
          {
            "trait_type": "Winter Sport",
            "value": "Snowboarding",
          },
          {
            "trait_type": "Accessory",
            "value": "Boots",
          },
          {
            "trait_type": "Background",
            "value": "Jacket",
          },
          {
            "trait_type": "Rarity",
            "value": "Legendary",
          }
        ],
        media: {
          image_1: {
            type: "image",
            url: "https://stage-ipfs.unique.network/ipfs/QmPT3F16h5jPuELwBqHiApM7iWkQtJdSrok1Z4JDMhnze3",
          },
          image_2: {
            type: "image",
            url: "https://stage-ipfs.unique.network/ipfs/QmScKMbkUBQWADSrZusc7SUPVTCtdadAaFQ1eb7nN5Ysff",
          },
          video_1: {
            type: "video",
            url: "https://stage-ipfs.unique.network/ipfs/QmcDMcdhp23fRe6aAZKwkJVsHzvSh5i3EdK2LPFhJPZjgb",
          },
          audio_1: {
            type: "audio",
            url: "https://stage-ipfs.unique.network/ipfs/QmVniYM43KfoNahTM8Mg9UStG7LmC5rVAHYBKj9WnDjuRX",
          },
        },
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
  const account = Sr25519Account.fromUri(mnemonic);

  const sdk = new Sdk({baseUrl: 'https://rest.unique.network/opal/v1', account})

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

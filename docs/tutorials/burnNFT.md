# Burn an NFT

In this guide, we will go through the entire process on how to burn an NFT using the Unique Network SDK.

### Prerequisites

To get started, you need to have a [Substrate address](../tutorials/accounts/create-account.md) and an existing collection (see [create a collection](../tutorials/create-collection-token.md). Also, you should have an NFT (see [create an NFT](../tutorials/create-collection-token.md)) that we are going to burn.

### Burn NFT, RFT or bundle

The method, that we are going to use, allows destroying an instance of NFT, amount of Fungible tokens, an RFT, or even a bundle.

If the `from` parameter is not specified, then the token is destroyed on behalf of the owner of the item. Only the collection owner, collection admin, or current NFT owner has permission to call this method. 

Here are some specifics for different modes: 

- Non-Fungible Mode: the default mode, nothing to handle.
- Fungible Mode: you must specify the transferred amount.
- Re-Fungible Mode: you must specify transferred portion (between 0 and 1).
- Bundle: you can burn only those tokens in the bundle that do not contain other tokens. If you want to burn such the token, then you must pull out all the tokens from it first.

### Sample code

```typescript:no-line-numbers
import '@unique-nft/substrate-client/tokens';
import { BurnTokenArguments } from '@unique-nft/substrate-client/tokens/types';

const burnItemArgs: BurnTokenArguments = {
  tokenId: 1,
  collectionId: 1,
};

const setResult = await sdk.tokens.burn.submitWaitResult(burnItemArgs);
const { collectionId, tokenId, address, value } = setResult.parsed;
```

### Examples


<CodeGroup>
<CodeGroupItem title = "SDK" active>

```typescript:no-line-numbers
import { Sdk } from "@unique-nft/sdk";

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
<CodeGroupItem title="Substrate Client">

```typescript:no-line-numbers
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
<CodeGroupItem title ="REST">

```bash:no-line-numbers
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
</CodeGroup>










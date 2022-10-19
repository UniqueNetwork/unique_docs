# NFS. Burn NFS

In this guide, we will go through the entire process of burn NFS using the Unique Network SDK.

## Preparation

To get started, you need to have:

1. [Substrate account](/docs/sdk-guides/createAccount.md)
2. [Collection ID](https://github.com/UniqueNetwork/unique_docs/blob/feature/how-to-mint-nfts/docs/sdk-guides/nfts-ways-to-create.md)
3. [NFS](/docs/sdk-guides/nfts-ways-to-create.md)

## Burn NFS,RFT,Bundle

This method destroys a concrete instance of NFT or amount of Fungible token, RFT, Bundle.

If the from parameter is specified, then the token is destroyed on behalf of the owner of the item.

Only the Collection Owner, Collection Admin, or Current NFT owner has permission to call this method.

- Non-Fungible Mode: Ignored
- Fungible Mode: Must specify the transferred amount
- Re-Fungible Mode: Must specify transferred portion (between 0 and 1)
- Bundle: You can fire only those tokens in the bundle that do not contain other tokens. If you still really want to burn the token, then you must first pull out    all the tokens from it.

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

Arguments
`address: string` - Signer address

`collectionId: number` - ID of the collection

`tokenId: number` - ID of NFT to burn

Optional Arguments

`from?: string` - The owner of the item on whose behalf the token is destroyed

`value?: number` - Amount to burn

## Returns

This method returns BurnTokenResult

```typescript
interface BurnTokenResult {
    collectionId: number;
    tokenId: number;
    address: Address;
    value: number;
  }
```
## Examples

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










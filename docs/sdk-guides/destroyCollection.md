# Destroy collection

In this guide, we will go through the entire process of destroy collection using the Unique Network SDK.

## Preparation

To get started, you need to have:

1. [Substrate account](/sdk-guides/createAccount.html)
2. [Collection ID](/sdk-guides/nfts-ways-to-create.html#create-collection)

## Destroy collection

There are limits to deleting a collection:


- collection not found
- enough balance to destroy the collection
- collection must not contain tokens
- your address is the owner of the collection
- collection can't be destroyed it is specified when the collection is created

## Brief example

```typescript
import { DestroyCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
const { success } = result.parsed;
```
## Arguments

`address` - string

`collectionId` - number

```typescript
Returns
interface DestroyCollectionResult {
    success: boolean;
}
```
## Examples

```typescript
import { DestroyCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
const { success } = result.parsed;
```

```bash
curl -X 'DELETE' \
  'https://rest.unique.network/opal/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
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

```typescript
const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

client.collections.destroy.submitWaitResult({
    address: '<your address>',
    collectionId: 1,
});
```
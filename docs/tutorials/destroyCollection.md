# Destroy a collection

In this guide, we will go through the entire process on how to destroy a collection using the Unique Network SDK.

### Prerequisites

To get started, you need to have a [Substrate address](../tutorials/accounts/create-account.md) and an existing collection (see [create a collection](../tutorials/create-collection-token.md).

### Limitations

There are some scenarios when it is impossible to destroy a collection:

- a collection is not found. 
- not enough balance to destroy a collection.
- a collection contains tokens.
- your address is not the collection owner.
- the corresponding permission is specified when the collection is created.

### Sample code 

```typescript:no-line-numbers
import { DestroyCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
const { success } = result.parsed;
```

### Examples

<CodeGroup>
<CodeGroupItem title = "SDK" active>

```typescript:no-line-numbers
import { Sdk } from "@unique-nft/sdk";

const sdk = new Sdk({ baseUrl: 'https://rest.unique.network/opal' });

client.collections.destroy.submitWaitResult({
    address: '<your address>',
    collectionId: 1,
});
```

</CodeGroupItem>
<CodeGroupItem title="Substrate Client">

```typescript:no-line-numbers
import { DestroyCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
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


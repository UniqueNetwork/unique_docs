# SDK Methods - version 2

## Table of Contents 
[[toc]]

## Overview

Main groups of methods:
- Collections
- Tokens
- Sponsoring
- Nesting


## Collection methods

### Add collection admin

Adds an [admin]() to the specified [collection]().

#### Brief example

```ts
import { AddCollectionAdminArguments } from '@unique-nft/sdk/tokens'

const result = await sdk.collections.addAdmin.submitWaitResult({
  address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
  collectionId: 1,
  newAdmin: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp', // or '0x55e0C5f1026518a91CE060E9b9dE73BffE05EFBa'
})

console.log(result.parsed) // {ok: true, collectionId: 1}
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

The method takes the `newAdmin` address and appends it to the collection [admins]() field. 

When the address already an admin, DOIN SOMETHING.

When the collection has reached [max limit]() of admin addresses, DOIN ANOTHER SOMETHING.

And also throws [common errors]() on insufficient balance and so on. 

#### Returns

The method returns an `CollectionAdminAdded` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [CrossAccountId]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
import { AddCollectionAdminArguments } from '@unique-nft/sdk/tokens';

const args: AddCollectionAdminArguments = {
  address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
  collectionId: 1,
  newAdmin: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp', // or '0x55e0C5f1026518a91CE060E9b9dE73BffE05EFBa'
};

const result = await sdk.collections.addAdmin.submitWaitResult(args);

console.log(result.parsed);
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
import { AddCollectionAdminArguments } from '@unique-nft/client/tokens';

const args: AddCollectionAdminArguments = {
  address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
  collectionId: 1,
  newAdmin: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp', // or '0x55e0C5f1026518a91CE060E9b9dE73BffE05EFBa'
};

const result = await sdk.collections.addAdmin.submitWaitResult(args);

console.log(result.parsed);
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
import { AddCollectionAdminArguments } from '@unique-nft/client/tokens';

const args: AddCollectionAdminArguments = {
  address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
  collectionId: 1,
  newAdmin: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp', // or '0x55e0C5f1026518a91CE060E9b9dE73BffE05EFBa'
};

const result = await sdk.collections.addAdmin.submitWaitResult(args);

console.log(result.parsed);
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
curl https://web.unique.network/v1/ \
  -X POST \
  --data "{"address":"5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ","collectionId":1,"newAdmin":"5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp"}"

#then we sign, then we call


curl https://web.unique.network/v1/ \
  -X POST \
  --data "{"address":"5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ","collectionId":1,"newAdmin":"5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp"}'
```

  </CodeGroupItem>

</CodeGroup>


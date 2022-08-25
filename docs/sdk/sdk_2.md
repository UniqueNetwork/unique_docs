# Methods

# Table of Contents 
[[toc]]

## Overview

Main groups of methods:
- Collections - описание
- Tokens - описание
- Sponsoring - описание
- Nesting - описание


## Collection methods

### Add collection admin

<details>
<summary> Описание Add collection admin </summary>

#### Overview

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

</details>

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>

## Token methods 

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>

## Sponsoring methods

### Set collection sponsor

<details>
<summary> Описание Set collection sponsor </summary>

#### Overview

Collection **owner** can use this method to set **sponsor** of the collection.

After that **sponsor** should [confirm sponsorship](../confirm-sponsorship) and the sponsoring mechanism will be enabled.

Collection **owner** can also [remove collection sponsor](../remove-collection-sponsor).

#### Brief example

```typescript
    import { SetCollectionSponsorArguments } from '@unique-nft/sdk/tokens/types';
    
    const setSponsorArgs: SetCollectionSponsorArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
        newSponsor: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
    };
    
    await sdk.collections.setCollectionSponsor.submitWaitResult(setSponsorArgs);

    const { sponsorship } = await sdk.collections.get_new({ collectionId: 1 });

    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - false`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

#### Arguments

`address: string` — collection owner address

`collectionId: number` — collection id

`newSponsor: string` — address of new sponsor


#### Behaviour and errors

The method takes an address and set as collection sponsor.

Signer must be admin of the collection.

Be aware that if address is already a sponsor of given collection no exception will be thrown, but fee will be charged.

And also throws common errors on insufficient balance and so on.

#### Returns

This method returns `SetSponsorshipResult`

```typescript
    interface SetSponsorshipResult {
        /**
         * id of the collection
         */
        collectionId: number;
    
        /**
         * address of the sponsor (Substrate)
         */
        sponsor: Address;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
    import { SetCollectionSponsorArguments } from '@unique-nft/sdk/tokens/types';
    
    const setSponsorArgs: SetCollectionSponsorArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
        newSponsor: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
    };
    
    await sdk.collections.setCollectionSponsor.submitWaitResult(setSponsorArgs);
    
    const { sponsorship } = await sdk.collections.get_new({ collectionId: 1 });
    
    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - false`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/collection/sponsorship' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ",
    "collectionId": 1,
    "newSponsor": "5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp"
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from prevous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const result = await client.collections.setSponsorship.submitWaitResult({
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
        newSponsor: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
    });
    
    const { parsed: { sponsor, collectionId } } = result;
    
    console.log(`${sponsor} should now approve sponsorship of ${collectionId} collection`);
```

  </CodeGroupItem>

</CodeGroup>

</details>

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>

## Nesting methods

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>

### Method name

<details>
<summary> Описание Method name </summary>

#### Overview
Adds an [что-то]() to the specified [куда-то]().

#### Brief example

```ts
краткий пример
```

#### Arguments

`address: string` — signer address

`collectionId: number` — collection id

`newAdmin: string` — address to assign as admin, may be Substrate or ethereum address

#### Behaviour and errors

Делает то-то

Возвращает то-то

Ошибается тут-то

#### Returns

The method returns an `что-то возвращается` event:

```ts:no-line-numbers
type CollectionAdminAdded = {
  a: number
  b: string // substrate address or ethereum address
  c: CrossAccountId
}
```

Used types: [какой-то тип]()


#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```ts
сдк
```
  </CodeGroupItem>


<CodeGroupItem title="iOS" active>


```ts
иос
```

  </CodeGroupItem>

<CodeGroupItem title="Android">


```ts
андроид
```

</CodeGroupItem>

<CodeGroupItem title="REST">


```bash
рест ин пис
```

  </CodeGroupItem>

</CodeGroup>

</details>
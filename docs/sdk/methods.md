# Methods

## Nesting

### Get bundle
<details><summary>Get bundle description</summary>

#### Overview

Returns full tree of a nested tokens. You can request it with any token from the bundle, result will be the same for all.

#### Brief example

```typescript
import { NestedToken } from '@unique-nft/substrate-client/types';

const result: NestedToken = await sdk.tokens.getBundle({
  collectionId: 2,
  tokenId: 5,
});

console.log(result);

/*
{
    tokenId: 1,
    collectionId: 1,
    nestingChildTokens: [
    {tokenId: 2, collectionId 1, childs: []},
    ...
    {tokenId: 5, collectionId 1, childs: []},       <------- this is the requested token
    ]
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Behaviour and errors

Throw errors:

- If topmost token of a bundle has no nested tokens
- Recursion depth exceeded
- Token not found during search for nested childs

#### Returns

This method returns `NestedToken`

```typescript
type NestedToken = Omit<TokenByIdResult, 'nestingChildTokens'> & {
  nestingChildTokens: NestedToken[];
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { GetBundleArguments } from '@unique-nft/substrate-client/tokens';

const args: GetBundleArguments = {
  collectionId: 2,
  tokenId: 5,
};

const bundle = await sdk.tokens.getBundle(args);

console.log(bundle);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.opal.uniquenetwork.dev/token/get-bundle?collectionId=2&tokenId=5' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });

const bundle = await client.tokens.getBundle({
  collectionId: 2,
  tokenId: 5,
});

console.log(bundle);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Is Bundle
<details><summary>Is Bundle description</summary>

#### Overview

Returns whether token in part of the bundle or not.

#### Brief example

```typescript
const isBundle = await sdk.tokens.isBundle({
  collectionId: 2,
  tokenId: 1,
});

console.log(isBundle);

// false
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Returns

This method returns `IsBundleResult`

```typescript
type IsBundleResult = boolean;
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { IsBundleArguments } from '@unique-nft/substrate-client/tokens';

const args: IsBundleArguments = {
  collectionId: 2,
  tokenId: 1,
};

const bundle = await sdk.tokens.isBundle(args);

console.log(bundle);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.opal.uniquenetwork.dev/token/is-bundle?collectionId=2&tokenId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });

const result = await client.tokens.isBundle({
  collectionId: 2,
  tokenId: 1,
});

console.log(result.isBundle);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Nest token
<details><summary>Nest token description</summary>

#### Overview

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

#### Brief example

```typescript
import { NestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

const args: NestTokenArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
};

const result = await sdk.tokens.nestToken.submitWaitResult(args);

const { tokenId, collectionId } = result.parsed;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully nested`,
);
```

#### Arguments

`address: string` - Token owner address

`parent: { collectionId: number, tokenId: number }` - Parent token object

`nested: { collectionId: number, tokenId: number }` - Nested token object

#### Behaviour and errors

Nesting can be applied only if token collection has a permission for nesting. If collection has no permission for nesting - "UserIsNotAllowedToNest" Error will be thrown.

```typescript
await sdk.collections.creation.submitWaitResult({
  // ...
  permissions: {
    nesting: {
      tokenOwner: true,
      collectionAdmin: true,
    },
  },
```

#### Returns

The method returns `NestTokenResult`

```typescript
type NestTokenResult = {
  /**
   * id of the collection
   */
  collectionId: number;
  /**
   * id of the token
   */
  tokenId: number;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { NestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

const args: NestTokenArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
};

const result = await sdk.tokens.nestToken.submitWaitResult(args);

const { tokenId, collectionId } = result.parsed;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully nested`,
);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.opal.uniquenetwork.dev/token/nest' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
      "parent": {
        "collectionId": 1,
        "tokenId": 1
      },
      "nested": {
        "collectionId": 1,
        "tokenId": 2
      }
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

const result = await client.tokens.nest.submitWaitResult({
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
});

const {
  parsed: { sponsor, collectionId },
} = result;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully nested`,
);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Token children
<details><summary>Token children description</summary>

#### Overview

Get array of nested tokens. If token has no children return empty array.

#### Brief example

```typescript
import {
  TokenChildrenArguments,
  TokenChildrenResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenChildrenArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenChildrenResult = await sdk.tokens.children(args);

console.log(result);

/*
{
  children: [
    {
      collectionId: 1,
      token: 2
    },
    {
      collection: 1,
      token: 3
    }
  ]
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Returns

This method returns `TokenChildrenResult`

```typescript
type TokenChildrenArguments = {
  collectionId: number;
  tokenId: number;
};

type TokenChildrenResult = {
  children: TokenChildrenArguments[];
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import {
  TokenChildrenArguments,
  TokenChildrenResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenChildrenArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenChildrenResult = await sdk.tokens.children(args);

console.log(result);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.opal.uniquenetwork.dev/token/children?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });

const result = await client.tokens.children({
  collectionId: 1,
  tokenId: 1,
});

console.log(result.children);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Token parent
<details><summary>Token parent description</summary>

#### Overview

Return info about token parent. Call the `tokenOwner` method. If the owner is not a nesting token return `null`.

#### Brief example

```typescript
import {
  TokenParentArguments,
  TokenParentResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenParentArguments = {
  collectionId: 1,
  tokenId: 2,
};

const result: TokenParentResult = await sdk.tokens.parent(args);

console.log(result);

/*
{
  collectionId: 1;
  tokenId: 1;
  address: "5HpZHYXjV23eEdVzhvYD2D3H6g1kM3aRGYwrmuGe9zaod6od";
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

#### Returns

This method returns `TokenParentResult`

```typescript
type TokenParentResult = {
  collectionId: number;
  tokenId: number;
  address: Address;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import {
  TokenParentArguments,
  TokenParentResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenParentArguments = {
  collectionId: 1,
  tokenId: 2,
};

const result: TokenParentResult = await sdk.tokens.parent(args);

console.log(result);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.opal.uniquenetwork.dev/token/parent?collectionId=1&tokenId=2' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });

const result = await client.tokens.parent({
  collectionId: 1,
  tokenId: 2,
});

console.log(result);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Topmost token owner
<details><summary>Topmost token owner description</summary>

#### Overview

Return substrate address of topmost token owner.

#### Brief example

```typescript
import {
  TokenOwnerArguments,
  TopmostTokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TopmostTokenOwnerResult = await sdk.tokens.topmostOwner(args);

console.log(result);

/*
{
  topmostOwner: "5HpZHYXjV23eEdVzhvYD2D3H6g1kM3aRGYwrmuGe9zaod6od"
}
*/
```

#### Arguments

`collectionId: number` - collection id

`tokenId: number` - token id

`blockHashAt: string` - _optional_ - hash of execution block

#### Returns

This method returns `TopmostTokenOwnerResult`

```typescript
type TopmostTokenOwnerResult = { topmostOwner: Address };
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import {
  TokenOwnerArguments,
  TopmostTokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TopmostTokenOwnerResult = await sdk.tokens.topmostOwner(args);

console.log(result);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.opal.uniquenetwork.dev/token/topmost-owner?collectionId=1&tokenId=2' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });

const result = await client.tokens.topmostOwner({
  collectionId: 1,
  tokenId: 2,
});

console.log(result.topmostOwner);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Unnest token
<details><summary>Unnest token description</summary>

#### Overview

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

#### Brief example

```typescript
import { UnnestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

const args: UnnestTokenArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
};

const result = await sdk.tokens.unnestToken.submitWaitResult(args);

const { tokenId, collectionId } = result.parsed;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully unnested`,
);
```

#### Arguments

`address: string` - Token owner address

`parent: { collectionId: number, tokenId: number }` - Parent token object

`nested: { collectionId: number, tokenId: number }` - Nested token object

#### Behaviour and errors

Сan only be executed if the token already nested.

#### Returns

The method returns `UnnestTokenResult`

```typescript
type UnnestTokenResult = {
  /**
   * id of the collection
   */
  collectionId: number;
  /**
   * id of the token
   */
  tokenId: number;
};
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { UnnestTokenArguments } from '@unique-nft/substrate-client/tokens/types';

const args: UnnestTokenArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
};

const result = await sdk.tokens.unnestToken.submitWaitResult(args);

const { tokenId, collectionId } = result.parsed;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully unnested`,
);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
      'https://rest.opal.uniquenetwork.dev/token/unnest' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
      "parent": {
        "collectionId": 1,
        "tokenId": 1
      },
      "nested": {
        "collectionId": 1,
        "tokenId": 2
      }
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

const result = await client.tokens.unnest.submitWaitResult({
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
});

const {
  parsed: { sponsor, collectionId },
} = result;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully unnested`,
);
```

  </CodeGroupItem>

</CodeGroup>8
</details>

## Sponsorship

### Confirm sponsorship
<details><summary>Confirm sponsorship description</summary>

#### Overview

**Sponsor** should use this method to confirm sponsorship after the collection **owner** called [set collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-sponsor) method.

#### Brief example

```typescript
    import { ConfirmSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const confirmSponsorshipArgs: ConfirmSponsorshipArguments = {
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    };
    
    await sdk.collections.confirmSponsorship.submitWaitResult(confirmSponsorshipArgs);

    const { sponsorship } = await sdk.collections.get_new({ collectionId: 1 });

    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - true`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

#### Arguments

`address: string` — sponsor address

`collectionId: number` — collection id

#### Behaviour and errors

This method takes collection id and confirms signer to be a collection sponsor.

Collection **owner** should call [set collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-sponsor) with **sponsor** address, otherwise an error will be thrown.

Only unconfirmed **sponsor** of the collection should call and sign this method.

Throws common errors on insufficient balance and so on.

#### Returns

This method returns `ConfirmSponsorshipResult`

```typescript
    interface ConfirmSponsorshipResult {
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
    import { ConfirmSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const confirmSponsorshipArgs: ConfirmSponsorshipArguments = {
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    };
    
    await sdk.collections.confirmSponsorship.submitWaitResult(confirmSponsorshipArgs);
    
    const { sponsorship } = await sdk.collections.get_new({ collectionId: 1 });
    
    // `5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp - true`
    console.log(`${sponsorship?.address} - ${sponsorship?.isConfirmed}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/collection/sponsorship/confirm' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp",
    "collectionId": 1
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const result = await client.collections.confirmSponsorship.submitWaitResult({
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    });
    
    const { parsed: { sponsor, collectionId } } = result;
    
    console.log(`${sponsor} approved sponsorship of ${collectionId} collection`);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Remove collection sponsor
<details><summary>Remove collection sponsor description</summary>

#### Overview

Collection **owner** can use this method to remove **sponsor** added by [set collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-sponsor) method.

#### Brief example

```typescript
    import { RemoveSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const removeSponsorshipArgs: RemoveSponsorshipArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
    };
    
    await sdk.collections.removeSponsorship.submitWaitResult(removeSponsorshipArgs);

    const { sponsorship } = await sdk.collections.get_new({ collectionId: 1 });

    // `null`
    console.log(sponsorship);
```

#### Arguments

`address: string` — collection owner address

`collectionId: number` — collection id

#### Behaviour and errors

This method takes collection id and removes collection sponsor.

Only collection **owner** allowed to call this method.

Throws common errors on insufficient balance and so on.

#### Returns

This method returns `RemoveSponsorshipResult`

```typescript
    interface RemoveSponsorshipResult {
        /**
         * id of the collection
         */
        collectionId: number;
    }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
    import { RemoveSponsorshipArguments } from '@unique-nft/substrate-client/tokens';

    const removeSponsorshipArgs: RemoveSponsorshipArguments = {
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
    };
    
    await sdk.collections.removeSponsorship.submitWaitResult(removeSponsorshipArgs);
    
    const { sponsorship } = await sdk.collections.get_new({ collectionId: 1 });
    
    // `null`
    console.log(sponsorship);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'DELETE' \
    'https://rest.opal.uniquenetwork.dev/collection/sponsorship' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ",
    "collectionId": 1
    }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const result = await client.collections.removeSponsorship.submitWaitResult({
        address: '5HgvUDiRm5yjRSrrG9B6q6km7KLzkXMxvFLHPZpA13pmwCJQ',
        collectionId: 1,
    });
    
    const { parsed: { collectionId } } = result;
    
    console.log(`${collectionId} now works without sponsoring`);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Set collection sponsor
<details><summary>Set collection sponsor description</summary>

#### Overview

Collection **owner** can use this method to set **sponsor** of the collection.

After that **sponsor** should [confirm sponsorship](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/confirm-sponsorship) and the sponsoring mechanism will be enabled.

Collection **owner** can also [remove collection sponsor](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/remove-collection-sponsor).

#### Brief example

```typescript
    import { SetCollectionSponsorArguments } from '@unique-nft/substrate-client/tokens/types';
    
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
    import { SetCollectionSponsorArguments } from '@unique-nft/substrate-client/tokens';
    
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
    "signerPayloadJSON": { *from previous response* },
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

## Statistics

### Get account tokens of the collection
<details><summary>Get account tokens of the collection description</summary>

#### Overview
Returns array of tokens, owned by address

#### Brief example

```typescript
import { AccountTokensResult } from '@unique-nft/substrate-client/tokens';

const tokensResult: AccountTokensResult = await sdk.tokens.getAccountTokens({
  collectionId: 1,
  address: '<address>',
});

const token = tokensResult.tokens[0];
const { collectionId, tokenId } = token;
```

#### Arguments

`collectionId: number` - ID of collection 

`address: string` - address of tokens owner

#### Behaviour and errors

#### Returns

This method returns `AccountTokensResult`

```typescript
import { TokenIdArguments } from '@unique-nft/substrate-client/tokens';

interface AccountTokensResult {
  tokens: TokenIdArguments[];
}
```

#### Examples


<CodeGroup>
  <CodeGroupItem title="SDK">

```typescript
  import { AccountTokensArguments, AccountTokensResult } from '@unique-nft/substrate-client/tokens';
  
  const accountTokensArguments: AccountTokensArguments = {
      address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
      collectionId: 1,
  };
  
  const tokensResult: AccountTokensResult = await sdk.tokens.getAccountTokens(accountTokensArguments);
  
  const token = tokensResult.tokens[0];
  const { collectionId, tokenId } = token;
  
  console.log(`${collectionId} - ${tokenId}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.opal.uniquenetwork.dev/token-new/account-tokens?address=5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp&collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const tokensResult = await client.tokens.accountTokens({
        address: '5DZGhQtBRyZpRgKX3VffhyBCSQD1KwU2yY1eAs99Soh7Dpwp',
        collectionId: 1,
    });

    const token = tokensResult.tokens[0];
    const { collectionId, tokenId } = token;
    
    console.log(`${collectionId} - ${tokenId}`);
```

  </CodeGroupItem>

</CodeGroup>
</details>

# Get collection tokens

#### Overview

Get tokens contained within a collection

#### Brief example

```typescript
import { CollectionTokensResult } from '@unique-nft/substrate-client/tokens/types';

const result: CollectionTokensResult = await sdk.collections.tokens({
  collectionId: 1,
});
```

#### Arguments

`collectionId: number` - Collection ID

#### Behaviour and errors

#### Returns

This method returns `CollectionTokensResult`

```typescript
interface CollectionTokensResult {
  ids: number[];
}
```

Method returns array of tokenIds contained within passed collection.

#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```typescript
  import { CollectionTokensResult } from '@unique-nft/substrate-client/tokens';

  const tokensResult: CollectionTokensResult = await sdk.collections.tokens({
    collectionId: 1,
  });
  
  const { ids } = tokensResult;
  
  console.log(`ids - ${ids}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.opal.uniquenetwork.dev/collection/tokens?collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const tokensResult = await client.collections.tokens({
        collectionId: 1,
    });

    const { ids } = tokensResult;
    
    console.log(`ids - ${ids}`);
```

  </CodeGroupItem>

</CodeGroup>


# Get collection stats

#### Overview

Returns blockchain collection statistics:
 - The number of total collections created
 - The number of destroyed collections
 - The number of collections that are still alive

#### Brief example

```typescript
import { GetStatsResult } from '@unique-nft/substrate-client/types';

const stats: GetStatsResult = await sdk.collections.getStats();

console.log(`stats: ${stats.created}, ${stats.destroyed}, ${stats.alive}`);
```


#### Arguments

No arguments required.

#### Returns

This method returns `GetStatsResult`
```typescript
interface GetStatsResult {
  created: number;
  destroyed: number;
  alive: number;
}
```

#### Examples

<CodeGroup>
  <CodeGroupItem title="SDK">

```typescript
  import { CollectionTokensResult } from '@unique-nft/substrate-client/tokens';

  const stats: GetStatsResult = await sdk.collections.getStats();
  
  const { created, destroyed, alive } = stats;
  
  console.log(`stats - ${created}, ${destroyed}, ${alive}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.opal.uniquenetwork.dev/collection/stats'
```
  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const stats = await client.collections.stats();

    const { created, destroyed, alive } = stats;

    console.log(`stats - ${created}, ${destroyed}, ${alive}`);
```

  </CodeGroupItem>

</CodeGroup>

## Last token id

#### Overview

Get last generated token id

#### Brief example

```typescript
import { LastTokenIdResult } from '@unique-nft/substrate-client/types';

const lastTokenIdResult: LastTokenIdResult = await sdk.collections.lastTokenId({
  collectionId: 1,
});

const { tokenId } = lastTokenIdResult;

console.log(`tokenId - ${tokenId}`);
```

#### Arguments

`collectionId: number` - ID of collection

#### Returns

This method returns `LastTokenIdResult`
```typescript
interface LastTokenIdResult {
  tokenId: number;
};
```

#### Examples


<CodeGroup>
  <CodeGroupItem title="SDK">

```typescript
  import { LastTokenIdResult } from '@unique-nft/substrate-client/types';

  const lastTokenIdResult: LastTokenIdResult = await sdk.collections.lastTokenId({
    collectionId: 1,
  });
  
  const { tokenId } = lastTokenIdResult;
  
  console.log(`tokenId - ${tokenId}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.opal.uniquenetwork.dev/collection/last-token-id?collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const lastTokenId = await client.collections.lastTokenId();

    const { tokenId } = lastTokenId;

    console.log(`lastTokenId - ${tokenId}`);
```

  </CodeGroupItem>

</CodeGroup>


## Total supply

#### Overview

Returns the number of tokens in the collection

#### Brief example

```typescript
import {
  TotalSupplyResult,
} from '@unique-nft/substrate-client/tokens/types';

const result: TotalSupplyResult = await sdk.collections.totalSupply({
  collectionId: 1
});
const { totalSupply } = result;

console.log(`totalSupply - ${totalSupply}`);
```


#### Arguments

`collectionId: number` - ID of collection
`blockHashAt?: number` - hash of execution block, is optional

#### Returns

This method returns `LastTokenIdResult`

```typescript
interface TotalSupplyResult {
  totalSupply: number;
}
```

#### Examples


<CodeGroup>
  <CodeGroupItem title="SDK">

```typescript
  import {
    TotalSupplyResult,
  } from '@unique-nft/substrate-client/tokens/types';
  
  const result: TotalSupplyResult = await sdk.collections.totalSupply({
    collectionId: 1
  });
  const { totalSupply } = result;
  
  console.log(`totalSupply - ${totalSupply}`);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
    curl -X 'GET' \
    'https://rest.opal.uniquenetwork.dev/collection/total-supply?collectionId=1'
```
  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const result = await client.collections.totalSupply();

    const { totalSupply } = result;

    console.log(`totalSupply - ${totalSupply}`);
```

  </CodeGroupItem>

</CodeGroup>

## Token

### Burn token
<details><summary>Burn token description</summary>

#### Overview

This method destroys a concrete instance of NFT or amount of Fungible token.

If the **from** parameter is specified, then the token is destroyed on behalf of **the owner of item**.

Only **Collection Owner**, **Collection Admin**, or **Current NFT owner** has permission to call this method.

#### Brief example

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

#### Arguments

`address: string` - Signer address

`collectionId: number` - ID of the collection

`tokenId: number` - ID of NFT to burn

Optional Arguments

`from?: string` - The owner of item on whose behalf the token is destroyed

`value?: number` - Amount to burn
  - Non-Fungible Mode: Ignored
  - Fungible Mode: Must specify transferred amount
  - Re-Fungible Mode: Must specify transferred portion (between 0 and 1)

#### Behaviour and errors

Throw errors:

- Collection or token not found
- The **Signer** or **from** addresses do not have permission to call this method
- If **the owner of the collection** (but not the owner of the token) wants to burn the token and the **ownerCanDestroy** flag is set to false. Check the set limits using the method [effectiveCollectionLimits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../effective-collection-limits)
- Insufficient balance

#### Returns

This method returns `BurnTokenResult`

```typescript
  interface BurnTokenResult {
    collectionId: number;
    tokenId: number;
    address: Address;
    value: number;
  }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

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

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'DELETE' \
    'http://rest.opal.uniquenetwork.dev/token-new?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "collectionId": 183,
    "tokenId": 5,
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const result = await client.tokens.burn.submitWaitResult({
      "collectionId": 1,
      "tokenId": 1,
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    });
    
    const { parsed: { collectionId, tokenId } } = result;
    
    console.log(`burned token ${tokenId} collection ${collectionId}`);

```

  </CodeGroupItem>

</CodeGroup>
</details>

### Create multiple tokens
<details><summary>Create multiple tokens description</summary>

#### Overview

This method creates multiple items in a collection.

Only the **Collection Owner**, **Collection admin**, addresses from the **Allow List** (if **Allow List** is enabled and **MintPermission** is enabled) can mint tokens.

#### Brief example

```typescript
import { CreateMultipleTokensArguments } from '@unique-nft/substrate-client/tokens';

import {
  UniqueCollectionSchemaToCreate,
  COLLECTION_SCHEMA_NAME,
  AttributeType,
} from '@unique-nft/substrate-client/tokens';

const createTokenArgs: CreateTokenNewArguments = {
  address: '<your account address>',
  collectionId: 123,
  data: [{
    encodedAttributes: {
      '0': 0,
      '1': [0],
      '2': 'foo_bar',
    },
    image: {
      ipfsCid: '<valid_ipfs_cid>',
    },
  }],
};

const result = await sdk.tokens.createMultiple.submitWaitResult(createArgs);
const [{ collectionId, tokenId }] = result.parsed;

const token = await sdk.tokens.get({ collectionId, tokenId });
```

#### Arguments

`address: Address` - The address of collection owner

`collectionId: number` - Collection id

`data: Array<UniqueTokenToCreate & { owner?: string} >` - The content of the tokens:

- Description **UniqueTokenToCreate** available in [Create token](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/create-token)

- `owner?: string` - The address of token owner (optional)

#### Behaviour and errors

Throw errors:

- Collection not found
- Signer must be **Collection Owner** or **Collection admin** or in **Allow List** of the collection
- Collection is set **TokenLimit** and creating a new token will exceed the token limit
- Insufficient balance

#### Returns

This method returns `TokenIdArguments[]`

```typescript
interface TokenIdArguments {
  collectionId: number;
  tokenId: number;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { CreateMultipleTokensArguments } from '@unique-nft/substrate-client/tokens';

import {
  UniqueCollectionSchemaToCreate,
  COLLECTION_SCHEMA_NAME,
  AttributeType,
} from '@unique-nft/substrate-client/tokens';

const createTokenArgs: CreateTokenNewArguments = {
  address: '<your account address>',
  collectionId: 123,
  data: [{
    encodedAttributes: {
      '0': 0,
      '1': [0],
      '2': 'foo_bar',
    },
    image: {
      ipfsCid: '<valid_ipfs_cid>',
    },
  }],
};

const result = await sdk.tokens.createMultiple.submitWaitResult(createArgs);
const [{ collectionId, tokenId }] = result.parsed;

const token = await sdk.tokens.get({ collectionId, tokenId });
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'POST' \
    'http://rest.opal.uniquenetwork.dev/token-new/create-multiple?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "collectionId": 183,
    "data": [
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
        }
      },
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image2.png"
        }    
      }
    ]
  }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
  const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
  
  const result = await client.tokens.createMultiple.submitWaitResult({
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "collectionId": 183,
    "data": [
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
        }
      },
      {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image2.png"
        }
      }
    ]
  });
  
  const { parsed } = result;
  
  console.log(`minted ${parsed.length} tokens`);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Create token (mint)
<details><summary>Create token (mint) description</summary>

#### Overview

This method creates a concrete instance of NFT collection.

Collection can be created with [Create collection](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../create-collection-ex-new) method.

Only the **Collection Owner**, **Collection admin**, addresses from the **Allow List** (if **Allow List** is enabled and **MintPermission** is enabled) can mint token.

The **owner** of the token is specified in the **owner** field. If the owner field is not set, then the **Signer** becomes the owner of the token.

#### Brief example

```typescript
import { CreateTokenNewArguments } from '@unique-nft/substrate-client/tokens/types';

import {
  UniqueCollectionSchemaToCreate,
  COLLECTION_SCHEMA_NAME,
  AttributeType,
} from '@unique-nft/substrate-client/tokens';

const createTokenArgs: CreateTokenNewArguments = {
  address: '<your account address>',
  collectionId: 123,
  data: {
    encodedAttributes: {
      '0': 0,
      '1': [0],
      '2': 'foo_bar',
    },
    image: {
      ipfsCid: '<valid_ipfs_cid>',
    },
  },
};

const result = await sdk.tokens.create.submitWaitResult(createArgs);
const { collectionId, tokenId } = result.parsed;

const token = await sdk.tokens.get({ collectionId, tokenId });   
```

#### Arguments

`address: string` - The address of collection owner

`collectionId: number` - Collection id

`owner?: string` - The address of token owner (optional)

`data: UniqueTokenToCreate` - The content of the token is stored in the fields of the object:

- `name?: LocalizedStringWithDefault*`
  
- `description?: LocalizedStringWithDefault*`

- `image: GenericInfixUrlOrCidWithHash**` - Token image (`url`, `urlInfix` or `ipfsCid`)

- `imagePreview?: GenericInfixUrlOrCidWithHash**`

- `video?: GenericInfixUrlOrCidWithHash**`

- `audio?: GenericInfixUrlOrCidWithHash**`

- `spatialObject?: GenericInfixUrlOrCidWithHash**`

- `encodedAttributes?: EncodedTokenAttributes` - Token attributes

&ast; Type **LocalizedStringWithDefault**

```typescript
{
  _: string;
  [K: string]: string;
}
```

&ast; Type **GenericInfixUrlOrCidWithHash**
```typescript
  { urlInfix?: string; hash?: string | null }
  | { url?: string; hash?: string | null }
  | { ipfsCid?: string; hash?: string | null };
```

#### Behaviour and errors

Throw errors:

- Collection not found
- Signer must be **Collection Owner** or **Collection admin** or in **Allow List** of the collection
- Collection is set **TokenLimit** and creating a new token will exceed the token limit
- Insufficient balance

#### Returns

This method returns `TokenIdArguments`

```typescript
  interface TokenIdArguments extends CollectionIdArguments {
    tokenId: number;
  }   
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { CreateTokenNewArguments } from '@unique-nft/substrate-client/tokens/types';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
} from '@unique-nft/substrate-client/tokens';

const createTokenArgs: CreateTokenNewArguments = {
    address: '<your account address>',
    collectionId: 123,
    data: {
        encodedAttributes: {
            '0': 0,
            '1': [0],
            '2': 'foo_bar',
        },
        image: {
            ipfsCid: '<valid_ipfs_cid>',
        },
    },
};

const result = await sdk.tokens.create.submitWaitResult(createArgs);
const { collectionId, tokenId } = result.parsed;

const token = await sdk.tokens.get({ collectionId, tokenId });
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'POST' \
    'http://rest.opal.uniquenetwork.dev/token-new?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "collectionId": 183,
    "data": {
      "image": {
        "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
      },
      "name": {
        "_": "Hello!"
      },
      "description": {
        "_": "Hello!"
      }
    }
  }'

# then we sign, then we call

    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const result = await client.tokens.create.submitWaitResult({
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "collectionId": 183,
      "data": {
        "image": {
          "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
        },
        "name": {
          "_": "Hello!"
        },
        "description": {
          "_": "Hello!"
        }
      }
    });
    
    const { parsed: { collectionId, tokenId } } = result;
    
    console.log(`created token ${tokenId} in collection ${collectionId}`);
```

  </CodeGroupItem>

</CodeGroup>

</details>

### Delete token properties
<details><summary>Delete token properties description</summary>

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **tokenId** - Token id
- **propertyKeys** - Array of properties keys

#### Returns

The method returns an array of `TokenPropertyDeleted` events.

```ts
const args: DeleteTokenPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  tokenId: 1,
  propertyKeys: ['foo', 'bar'],
};

const result = await sdk.tokens.deleteProperties.submitWaitResult(args);

console.log(result.parsed);
```
</details>

### Set token properties
<details><summary>Set token properties description</summary>

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **tokenId** - Token id
- **properties** - Array of properties `{ key: string, value: string }`

#### Returns

The method returns an array of `TokenPropertySet` events.

#### Examples

```ts
const args: SetTokenPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  tokenId: 1,
  properties: [
    {
      key: 'foo',
      value: 'bar',
    },
  ],
};

const result = await sdk.tokens.setProperties.submitWaitResult(args);

console.log(result.parsed);
```
</details>

### Set token property permissions
<details><summary>Set token property permissions description</summary>

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **propertyPermissions** - Array of property permissions `{ key: string, permission: { mutable: boolean, collectionAdmin: boolean, tokenOwner: boolean } }`

#### Returns

The method returns an array of `PropertyPermissionSet` events.

#### Examples

```ts
const args: SetTokenPropertyPermissionsArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  propertyPermissions: [
    {
      key: 'foo',
      permission: {
        mutable: true,
        collectionAdmin: true,
        tokenOwner: true,
      },
    },
  ],
};

const result =
  await sdk.collections.setTokenPropertyPermissions.submitWaitResult(args);

console.log(result.parsed);
```
</details>

### Get token
<details><summary>Get token description</summary>

#### Overview

Returns information about the NFT token of a specific collection.

#### Brief example

```typescript
const token = await sdk.tokens.get({
  collectionId: 2,
  tokenId: 1,
});
    
const {
    collectionId,
    tokenId,
    owner,
    image,
    attributes,
} = token;
```

#### Arguments

`collectionId: number` — collection id

`tokenId: number` — token id

#### Behaviour and errors

Throw errors:

- Collection not found (not created or destroyed)
- Token not found (not created or burned)
- Check path chain (CHAIN_WS_URL)

## Returns

This method returns `TokenByIdResult`

```typescript
type TokenByIdResult = Omit<UniqueTokenDecoded, 'owner'> & {
  owner: Address;
};
```

## Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
const token = await sdk.tokens.get({
  collectionId: 2,
  tokenId: 1,
});
    
const {
    collectionId,
    tokenId,
    owner,
    image,
    attributes,
} = token;
```
  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash
curl -X 'GET' \
  'https://rest.opal.uniquenetwork.dev/token-new?collectionId=2&tokenId=1' \
  -H 'accept: application/json'
```
  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });

    const result = await client.tokens.get({
      collectionId: 2,
      tokenId: 1,
    });
    
    const { tokenId, owner } = result;
    
    console.log(`token ${tokenId} is owned by address ${owner}`);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Get token owner
<details><summary>Get token owner description</summary>

#### Overview

This method allows you to get the current NFT **owner**.

The initial owner of the token are set to the address that signed the token creation extrinsic.

You can change the owner of the token using [transfer token](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/transfer) method.

#### Brief example

```typescript
import {
  TokenOwnerArguments,
  TokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TokenOwnerResult = await sdk.tokens.tokenOwner(
  args,
);
```

#### Arguments

`collectionId: number` — collection ID

`tokenId: number` — token ID

`blockHashAt?: string` — hash of execution block


#### Behaviour and errors

Throw errors:

- Collection not found (not created or destroyed)
- Token not found (not created or burned)
- Check path chain (CHAIN_WS_URL)

#### Returns

The method returns `TokenOwnerResult`

```typescript
type TokenOwnerResult = { owner: Address }
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import {
  TokenOwnerArguments,
  TokenOwnerResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TokenOwnerResult = await sdk.tokens.tokenOwner(
  args,
);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

    curl -X 'GET' \
  'https://rest.opal.uniquenetwork.dev/token-new/owner?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const { owner } = await client.tokens.owner({
      collectionId: 1,
      tokenId: 1,
    });
    
    console.log(`token owner ${owner}`);
```

  </CodeGroupItem>

</CodeGroup>
</details>

### Token properties
<details><summary>Token properties description</summary>

Get array of token properties

#### Arguments

- **collectionId** - Collection ID
- **tokenId** - Token ID
- **propertyKeys** _optional_ - Array of property keys

#### Returns

Method return an array of properties `{ key: string, value: string }`

#### Examples

```ts
import {
  TokenPropertiesArguments,
  TokenPropertiesResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: TokenPropertiesArguments = {
  collectionId: 1,
  tokenId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: TokenPropertiesResult = await sdk.tokens.properties(args);
```
</details>

### Transfer token
<details><summary>Transfer token description</summary>

#### Overview

Change ownership of the token.

Only **Collection Owner**, **Collection Admin**, or **Current NFT owner** has permission to call this method.

The **Current NFT owner** can be found using [Get token owner](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/token-owner) method.

#### Brief example

```typescript
import { TransferArguments } from '@unique-nft/substrate-client/tokens';

const args: TransferArguments = {
  address: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
```

#### Arguments

`address: string` - Signer address

`to: string` - Address of token recipient

`collectionId: number` - Collection id

`tokenId: number` - Token id

Optional Arguments

`from: string` - Address that owns token (default is signer address)

`value: number` - Amount to transfer (default is 1):
  - Non-Fungible Mode: Ignored
  - Fungible Mode: Must specify transferred amount
  - Re-Fungible Mode: Must specify transferred portion (between 0 and 1)

#### Behaviour and errors

Throw errors:

- Collection or token not found
- Signer is not a **Collection Owner**, **Collection Admin**, or **Current NFT owner**
- The restrictions set by the **transfersEnabled** or **ownerCanTransfer** flags apply. Check the set limits using the method [effectiveCollectionLimits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/../effective-collection-limits)
- Insufficient balance

#### Returns

This method returns `TransferResult`

```typescript
interface TransferResult {
  collectionId: number;
  tokenId: number;
  from: Address;
  to: Address;
  value: number;
}
```

#### Examples

<CodeGroup>

  <CodeGroupItem title="SDK">

```typescript
import { TransferArguments } from '@unique-nft/substrate-client/tokens';

const args: TransferArguments = {
  address: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
```

  </CodeGroupItem>

  <CodeGroupItem title="REST">

```bash

  curl -X 'PATCH' \
    'http://rest.opal.uniquenetwork.dev/token-new/transfer?use=Build&withFee=false&verify=false' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "collectionId": 183,
    "tokenId": 1,
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "to": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"
  }'
    
    # then we sign, then we call
    
    curl -X 'POST' \
    'https://rest.opal.uniquenetwork.dev/extrinsic/submit' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
    }'
```

  </CodeGroupItem>

  <CodeGroupItem title="Client">

```typescript
    const client = new Client({ baseUrl: 'https://rest.opal.uniquenetwork.dev' });
    
    const result = await client.tokens.transfer.submitWaitResult({
      "collectionId": 183,
      "tokenId": 1,
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "to": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"
    });
    
    const { parsed: { collectionId, tokenId, to } } = result;
    
    console.log(`${to} is the new owner of token ${tokenId} from collection ${collectionId}`);
```

  </CodeGroupItem>

</CodeGroup>
</details>

## Other

### Add collection admin
<details><summary>Add collection admin description</summary>

#### Arguments

- **address** - Signer address
- **collectionId** - Collection id
- **newAdmin** - New admin address

#### Returns

The method returns an `CollectionAdminAdded` event.

#### Examples

```ts
import { AddCollectionAdminArguments } from '@unique-nft/substrate-client/tokens';

const args: AddCollectionAdminArguments = {
  address: '<address>',
  collectionId: 1,
  newAdmin: '<address>',
};

const result = await sdk.collections.addAdmin.submitWaitResult(args);

console.log(result.parsed);
```
</details>

### Add To Allow List
<details><summary>Add To Allow List description</summary>

Adds an address to allow list of a collection.

#### Arguments

- **address** - Sender address
- **collectionId** - an ID of the collection which will be affected
- **newAdminId** - the address to be added to the allow list

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, address: string`.

#### Examples

```typescript
import { AddToAllowListArguments } from '@unique-nft/substrate-client/tokens/types';

const addToAllowListArgs: AddToAllowListArguments = {
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    newAdminId: '<valid address>'
};

const { parsed } = await sdk.collections.addToAllowList.submitWaitResult(addToAllowListArgs);
const { collectionId, address } = parsed;
```
</details>

### Adminlist
<details><summary>Adminlist description</summary>

Get array of collection admins

#### Arguments

- **collectionId** - ID of token collection

#### Returns

Method return an array of accounts

#### Examples

```ts
import {
  AdminlistArguments,
  AdminlistResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: AdminlistArguments = {
  collectionId: 1,
};

const result: AdminlistResult = await sdk.collections.admins(args);
```
</details>

### Allow list
<details><summary>Allow list description</summary>

Gets the addresses that are in to allow list for the specified collection.

#### Arguments

- **collectionId** - an ID of the collection which will be checked
- **hash** _optional_ - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

#### Returns

The method returns an object containing array string addresses.

#### Examples

```typescript
import { AllowListArguments } from '@unique-nft/substrate-client/tokens/types';

const allowListArgs: AllowListArguments = {
    collectionId: '<ID of the collection>', 
    hash: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const addresses = await sdk.collections.allowList(allowListArgs);
```
</details>

### Get allowance
<details><summary>Get allowance description</summary>

Get the amount of token pieces approved to transfer

#### Arguments

- **from** - address from
- **to** - address to
- **collectionId** - ID of collection
- **tokenId** - ID of token

#### Returns

Method returns object:

- **isAllowed** - boolean

#### Examples

```typescript
const { isAllowed } = await sdk.tokens.allowance({
  from: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
});
```
</details>

### Check is allowed
<details><summary>Check is allowed description</summary>

Check if a user is allowed to use a collection. Returns true or false.

#### Arguments

- **collectionId** - ID of collection
- **account** - Account address
- **blockHashAt** _optional_ - hash of execution block

#### Returns

Method returns object:

- **isAllowed** - boolean

#### Examples

```typescript
const { isAllowed } = await sdk.collection.allowed({
  collectionId: 1,
  account: '<address>',
});
```
</details>

### Approve
<details><summary>Approve description</summary>

Set, change, or remove approved address to transfer the ownership of the token. The Amount value must be between 0 and owned amount or 1 for NFT.

#### Arguments

- **spender** - Address that is approved to transfer this token
- **collectionId** - Collection id
- **tokenId** - Token id
- **amount** - Must be true (for approval) or false (for disapproval)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, tokenId: number`.

#### Examples

```typescript
import { ApproveArguments } from '@unique-nft/substrate-client/tokens/types';

const approveArgs: ApproveArguments = {
    spender: '<Account address for whom token will be approved>',
    collectionId: '<ID of the collection>',
    tokenId: '<ID of the token>',
    amount: true
};

const result = await sdk.tokens.approve.submitWaitResult(approveArgs);
const { collectionId, tokenId } = result.parsed;
```
</details>

### Get collection by Id
<details><summary>Get collection by Id description</summary>

Returns collection info in human format.

#### Arguments

- **collectionId** - ID of collection

#### Returns

Method return collection info:

- **id** - Collection id
- **owner** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **properties** - [Collection properties](#todo)
- **permissions** - [Collection permissions](#todo)
- **tokenPropertyPermissions** - [Collection tokens permissions](#todo)

#### Examples

```typescript
import { CollectionIdArguments, CollectionInfo } from '@unique-nft/substrate-client/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };
const collection: CollectionInfo = await sdk.collections.get(getCollectionArgs);
```
</details>

### Get collection by Id (new)
<details><summary>Get collection by Id (new) description</summary>

Returns collection info (with Unique schema)

#### Arguments

- **collectionId** - Id of collection

#### Returns

Method return collection info:

- **id** - Collection id
- **owner** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **readOnly** - collection is read only
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **permissions** - [Collection permissions](#todo)
- **schema** - [Collection schema](#todo)
- **properties** - [Collection properties](#todo)

#### Examples

```typescript
const collection = await sdk.collections.get_new({ collectionId: 2 });

const { id, owner, name, description, mode, tokenPrefix, schema } = collection;
```
</details>

### Collection properties
<details><summary>Collection properties description</summary>

Get array of collection properties

#### Arguments

- **collectionId** - Collection ID
- **propertyKeys** _optional_ - Array of property keys

#### Returns

Method return an array of properties `{ key: string, value: string }`

#### Examples

```ts
import {
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: CollectionPropertiesArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: CollectionPropertiesResult = await sdk.collections.properties(
  args,
);
```
</details>

### Create collection
<details><summary>Create collection description</summary>

#### Arguments

- **address** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **properties** - [Collection properties](#todo)
- **permissions** - [Collection permissions](#todo)
- **tokenPropertyPermissions** - [Collection tokens permissions](#todo)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number`.

#### Examples

```typescript
import { CreateCollectionArguments } from '@unique-nft/substrate-client/types';
const createArgs: CreateCollectionArguments = {
  address: '<your account address>',
  name: `FOO`,
  description: 'BAR',
  tokenPrefix: 'BAZ',
  properties: {},
};
const createResult = await sdk.collections.creation.submitWaitResult(createArgs);
const { collectionId } = createResult.parsed;
const collection = await sdk.collections.get({ collectionId });
```
</details>

### Create collection (new)
<details><summary>Create collection (new) description</summary>

#### Arguments

- **address** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **permissions** - [Collection permissions](#todo)
- **schema** - [Collection schema](#todo)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number`.

#### Examples

```typescript
import {
    UniqueCollectionSchemaToCreate,
    CollectionSchemaName,
    AttributeType,
    AttributeKind,
    CreateCollectionNewArguments,
} from '@unique-nft/substrate-client/tokens';

const collectionSchema: UniqueCollectionSchemaToCreate = {
    schemaName: COLLECTION_SCHEMA_NAME.unique,
    schemaVersion: '1.0.0',
    attributesSchemaVersion: '1.0.0',
    attributesSchema: {
        image: { urlTemplate: 'some_url/{infix}.extension' },
        '0': {
            name: 'just_string_attribute',
            type: AttributeType.string,
            kind: AttributeKind.freeValue,
        },
    },
    coverPicture: {
        ipfsCid: '<valid_ipfs_cid>',
    },
};

const createArgs: CreateCollectionArguments = {
  address: '<your account address>',
  name: `FOO`,
  description: 'BAR',
  tokenPrefix: 'BAZ', 
  schema: collectionSchema,
};

const createResult = await sdk.collections.creation_new.submitWaitResult(createArgs);
const { collectionId } = createResult.parsed;

const collection = await sdk.collections.get({ collectionId });
```
</details>

### Delete collection properties
<details><summary>Delete collection properties description</summary>

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **propertyKeys** - Array of properties keys

#### Returns

The method returns an array of `CollectionPropertyDeleted` events.

#### Examples

```ts
const args: DeleteCollectionPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  propertyKeys: ['foo', 'bar'],
};

const result = await sdk.collections.deleteProperties.submitWaitResult(args);

console.log(result.parsed);
```
</details>

### Destroy collection
<details><summary>Destroy collection description</summary>

Destroys collection if no tokens within this collection

#### Arguments

- **address** - Owner of collection
- **collectionId** - Collection id

#### Returns

The method returns a `parsed` object that contains the `success: boolean`.

#### Examples

```typescript
import { DestroyCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const destroyArgs: DestroyCollectionArguments = {
    address: '<Account address>',
    collectionId: '<ID of the collection>'
};

const result = await sdk.collections.destroy.submitWaitResult(destroyArgs);
const { success } = result.parsed;
```
</details>

### Get effective limits by collection ID
<details><summary>Get effective limits by collection ID description</summary>

By default, the collection limit is not set (their value is null).
This limit value can be seen when requesting a collection using [Get collection by ID](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/collection-by-id) method.
If the limit is not set by the user, then the default limit is actually applied to the collection.
The values of the limits actually applied to the collection (default and user-set) can be obtained using `Get effective limits` by collection ID.

#### Arguments

- **collectionId** - ID of collection

#### Returns

Method return collection info:

- **id** - Collection id
- **limits** - [Collection limits](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/set-collection-limits#arguments)
#### Examples

```typescript
import { CollectionIdArguments, GetCollectionLimitsResult } from '@unique-nft/substrate-client/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };
const collection: CollectionInfo = await sdk.collections.getLimits(getCollectionArgs);
```
</details>

### Get number of blocks when sponsored transaction is available
<details><summary>Get number of blocks when sponsored transaction is available description</summary>

Returns number of block or none string.

#### Arguments

- **address** - Substrate or Ethereum address
- **collectionId** - ID of collection
- **tokenId** - ID of token

#### Returns

Method return number of blocks or none string.

- **blockNumber** - Number of token

#### Examples

```typescript
import { NextSponsoredArguments, NextSponsoredResult } from '@unique-nft/substrate-client/types';
const getSponsoredArgs: NextSponsoredArguments = {
  address: '<your address>',
  collectionId: 1,
  tokenId: 1,
};
const nextSponsoredResult: NextSponsoredResult = await sdk.collections.nextSponsored(getSponsoredArgs);
```
</details>

### Property permissions
<details><summary>Property permissions description</summary>

Get array of collection property permissions

#### Arguments

- **collectionId** - Collection ID
- **propertyKeys** _optional_ - Array of property keys

#### Returns

Method return an array of property permissions `{ key: string, permission: { mutable: boolean, collectionAdmin: boolean, tokenOwner: boolean } }`

#### Examples

```ts
import {
  PropertyPermissionsArguments,
  PropertyPermissionsResult,
} from '@unique-nft/substrate-client/tokens/types';

const args: PropertyPermissionsArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: PropertyPermissionsResult =
  await sdk.collections.propertyPermissions(args);
```
</details>

### Remove collection admin
<details><summary>Remove collection admin description</summary>

#### Arguments

- **address** - Signer address
- **collectionId** - Collection id
- **accountId** - Admin address

#### Returns

The method returns an `CollectionAdminRemoved` event.

#### Examples

```ts
import { RemoveCollectionAdminArguments } from '@unique-nft/substrate-client/tokens';

const args: RemoveCollectionAdminArguments = {
  address: '<address>',
  collectionId: 1,
  accountId: '<address>',
};

const result = await sdk.collections.removeAdmin.submitWaitResult(args);

console.log(result.parsed);
```
</details>

### Remove an address from allow list
<details><summary>Remove an address from allow list description</summary>

#### Arguments

- **address** - Sender address
- **collectionId** - an ID of the collection which will be affected
- **addressToDelete** - the address to be removed from the allow list

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, address: string`.

#### Examples

```typescript
import { RemoveFromAllowListArguments } from '@unique-nft/substrate-client/tokens/types';

const removeFromAllowListArgs: RemoveFromAllowListArguments = {
    address: '<your account address>',
    collectionId: '<ID of the collection>',
    addressToDelete: '<valid address>'
};

const { parsed } = await sdk.collections.removeFromAllowList.submitWaitResult(removeFromAllowListArgs);
const { collectionId, address } = parsed;
```
</details>

### Set collection limits
<details><summary>Set collection limits description</summary>

#### Arguments

- **address** - The address of collection owner
- **collectionId** - ID of the collection to set limits for
- **limits** - [the effective limits of the collection](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client/tokens/methods/effective-collection-limits). List of optional fields:
  - **accountTokenOwnershipLimit** - Maximum number of tokens that one address can own
  - **sponsoredDataSize** - Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode
  - **sponsoredDataRateLimit** - Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored
  - **tokenLimit** - Total amount of tokens that can be minted in this collection
  - **sponsorTransferTimeout** - Time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored
  - **sponsorApproveTimeout** - Time interval in blocks that defines once per how long a non-privileged user approve transaction can be sponsored
  - **ownerCanTransfer** - Boolean value that tells if collection owner or admins can transfer or burn tokens owned by other non-privileged users
  - **ownerCanDestroy** - Boolean value that tells if collection owner can destroy it
  - **transfersEnabled** - Flag that defines whether token transfers between users are currently enabled 

#### Returns

The method returns a `parsed` object that contains the `collectionId: number`.

#### Examples

```typescript
import '@unique-nft/substrate-client/tokens';
import { SetCollectionLimitsArguments } from '@unique-nft/substrate-client/tokens/types';
const limitsArgs: SetCollectionLimitsArguments = {
  address: '<your account address>',
  collectionId: '<ID of the collection>',
  limits: {
      accountTokenOwnershipLimit: 1000,
      sponsoredDataSize: 1024,
      sponsoredDataRateLimit: 30,
      tokenLimit: 1000000,
      sponsorTransferTimeout: 6,
      sponsorApproveTimeout: 6,
      ownerCanTransfer: false,
      ownerCanDestroy: false,
      transfersEnabled: false,
  }
};
const setResult = await sdk.collections.setLimits.submitWaitResult(limitsArgs);
const { collectionId, limits } = setResult.parsed;
```
</details>

### Set collection permissions
<details><summary>Set collection permissions description</summary>

Sets onchain permissions for collection

#### Arguments

- **address** - Owner address
- **collectionId** - Collection id
- **permissions** - Struct that contains the permissions for a collection
  - **access**
  - **mintMode**
  - **nesting**
    - **tokenOwner**
    - **collectionAdmin**
    - **restricted**

#### Returns

The method returns a `parsed` object that contains the `{ collectionId: number }`.

#### Examples

```ts
import {
  SetCollectionPermissionsArguments,
  CollectionAccess,
} from '@unique-nft/substrate-client/tokens';

const args: SetCollectionPermissionsArguments = {
  address: account.address,
  collectionId,
  permissions: {
    access: CollectionAccess.Normal,
    mintMode: true,
    nesting: {
      collectionAdmin: true,
      tokenOwner: true,
    },
  },
};

const result = await sdk.collections.setPermissions.submitWaitResult(args);

console.log(
  `Collection #${result.parsed.collectionId} permissions successfully updated`,
);
```
</details>

### Set collection properties
<details><summary>Set collection properties description</summary>

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **properties** - Array of properties `{ key: string, value: string }`

#### Returns

The method returns an array of `CollectionPropertySet` events.

#### Examples

```ts
const args: SetCollectionPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  properties: [
    {
      key: 'foo',
      value: 'bar',
    },
  ],
};

const result = await sdk.collections.setProperties.submitWaitResult(args);

console.log(result.parsed);
```
</details>

### Set transfers enabled flag
<details><summary>Set transfers enabled flag description</summary>

#### Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **isEnabled** - New flag value

#### Permission

- Collection Owner

#### Returns

Enable / disable transfers for particular collection

#### Examples

```ts
import { SetTransfersEnabledArguments } from '@unique-nft/substrate-client/tokens/types';
 
const args: SetTransfersEnabledArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  isEnabled: true,
};

const result = await sdk.collections.setTransfersEnabled.submitWaitResult(args);

console.log(result.parsed.success);
```
</details>

### Checks if token exists in collection
<details><summary>Checks if token exists in collection description</summary>

Returns true or false

#### Arguments

- **collectionId** - ID of collection
- **tokenId** - ID of token

#### Returns

Method returns object:
- **isExists** - boolean

#### Examples

```typescript
const { isExists } = await sdk.tokens.exists({ collectionId: 123, tokenId: 321 });
```
</details>

### Change the owner of the collection
<details><summary>Change the owner of the collection description</summary>

#### Arguments

- **collectionId** - ID of the collection to change owner for
- **from** - The address of collection owner
- **to** - New collection owner (Substrate address)

#### Returns

The method returns a `parsed` object that contains the `collectionId: number, newOnwer: string`.

#### Examples

```typescript
import { TransferCollectionArguments } from '@unique-nft/substrate-client/tokens/types';

const args: TransferCollectionArguments = {
    collectionId: '<ID of the collection>',
    from: '<collection owner>',
    to: '<new collection owner>'
};

const result = await sdk.collections.transfer.submitWaitResult(args);
const { collectionId, newOnwer } = result.parsed;
```
</details>


# SDK npm

# Be aware, this is ALPHA version, package is under construction.

# Table of Contents

- [@unique-nft/sdk](#@unique-nft/sdk)
- [Installation](#Installation)
- [Initialize](#Initialize-SDK)
- [Design](#design)
  - [Modules](#modules)
  - [Mutation and Query method](#mutation-and-query-methods)

## @unique-nft/sdk

SDK is a JavaScript/TypeScript library that helps to interact with UniqueNetwork using simple methods instead of low-level API. With SDK you can mint collections and tokens, manage account balance, etc.
At the moment, the library is a pre-alpha version. We will be grateful for the feedback and ideas for improvement.

## Installation

### npm

```shell
npm install @unique-nft/sdk
```

### yarn

```shell
yarn add @unique-nft/sdk
```

### git

```shell
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:sdk
```

---

## Initialize SDK

```typescript
import { createSigner } from '@unique-nft/sdk/sign';
import { Sdk } from '@unique-nft/sdk';

(async () => {
  const sdk = await Sdk.create({
    chainWsUrl: 'wss://quartz.unique.network',
    signer: await createSigner({
      seed: '//Alice', // Signer seed phrase if you want to sign extrinsics
    }),
  });
})();
```

---

## Design

Unique SDK was developed as an add-on of
<a href="https://polkadot.js.org/docs/api/start" target="_blank">Polkadot{.js} ApiPromise</a>,
extending it with simple methods to work with the Unique Network blockchains
(Opal, Quartz, Unique).
However, Unique SDK can be used with any network based on the
<a href="https://substrate.io" target="_blank">Substrate framework</a> - main modules (extrinsics, balance, query, sign, etc.) will work with them.

---

### Modules

By default, the SDK implements only a connection to the blockchain network, and modules expand its capabilities. Modules are implemented as secondary endpoints of npm package, this allows you to flexibly manage dependencies, not include unnecessary modules into the application bundle assembly and expand the SDK with your own modules.

```typescript
import { Sdk } from '@unique-nft/sdk';

// ...

import '@unique-nft/sdk/extrinsics'; // Augment SDK with the `extrinsic` property

// ...

import { addFeature } from '@unique-nft/sdk';

class MyOwnSdkModule {
  constructor(private sdk: Sdk) {}

  public hello() {
    return 'world!';
  }
}

declare module '@unique-nft/sdk' {
  export interface Sdk {
    myOwnFeature: MyOwnSdkModule;
  }
}

addFeature('myOwnFeature', MyOwnSdkModule);

console.log(sdk.myOwnFeature.hello());
```

Currently, the SDK includes 5 modules

- [Extrinsics](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/extrinsics) - for building, signing, and submitting extrinsics
- [State Queries](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/state-queries) - blockchain queries storage
- [Sign](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/sign) - account management: sign, addresses
- [Balance](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/balance) - get and transfers native substrate token
- [Tokens](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/tokens) - operations with NFT of Unique Network blockchains (Opal, Unique, Quartz)

Modules can be dependent on each other. For example, the Balance Module depends on the Extrinsic Module because it generates transfer extrinsic and submits them to the blockchain.

---

### Mutation and Query methods

We have classified all SDK methods into two types

1. [Query](#query-methods) methods for reading blockchain storage
   (e.g. balance, or token properties)

```typescript
import '@unique-nft/sdk/tokens';

const collectionId = 1;
const tokenId = 3456;
const token = await sdk.tokens.get({ collectionId, tokenId });
```

2. [Mutation](#mutation-methods) methods for updating the state of the blockchain

```typescript
const transferArgs = {
  tokenId,
  collectionId,
  from: addressFrom,
  to: addressTo,
};
const unsignedExtrinsic = await sdk.tokens.transfer(transferArgs);
```

---

#### Query methods

Queries to blockchain storage that return data in a human-readable format

```typescript
const address = 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx';
/**
 * returns
 * {
 *  "raw": "0",
 *  "amount": 0,
 *  "amountWithUnit": "0",
 *  "formatted": "0",
 *  "unit": "UNQ"
 * }
 */
const { raw, amount, amountWithUnit, formatted, unit } = await sdk.balance.get({
  address,
});
```

---

#### Mutation methods

By default, they return an unsigned extension.
To apply this change in the blockchain state, you must sign it

```typescript
import { createSigner } from '@unique-nft/sdk/sign';
const signer: SdkSigner = await createSigner(signerOptions);
const unsignedExtrinsic = await sdk.tokens.transfer(transferArgs);
const { signature, signatureType } = await signer.sign(unsignedExtrinsic);
```

And send the extrinsic and the signature in the blockchain

```typescript
const hash = await sdk.extrinsics.submit({
  signature,
  signerPayloadJSON: unsignedExtrinsic.signerPayloadJSON,
});
```

For more convenience, we have implemented a [complex method](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk/extrinsics#complex):
if you initialize the SDK with a signer, you can sign and send extrinsics
seamlessly, without separate actions

```typescript
import { CreateCollectionArguments } from '@unique-nft/sdk/types';
import { createSigner } from '@unique-nft/sdk/sign';
import { Sdk } from '@unique-nft/sdk';
import '@unique-nft/sdk/tokens';

const sdk = await Sdk.create({
  chainWsUrl: 'wss://quartz.unique.network',
  signer: await createSigner({
    seed: '//Alice', // Signer seed phrase
  }),
});

const myCollection: CreateCollectionArguments = {
  address: 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx',
  description: 'Just sample collection',
  name: 'Sample',
  tokenPrefix: 'SMPL',
  properties: {},
};

/**
 * returns unsigned extrinsic
 */
const unsignedExtrinsic = await sdk.collections.creation.build(myCollection);

/**
 * return signed extrinsic (unsigned extrinsic + signature + signature type)
 */
const signedExtrinsic = await sdk.collections.creation.sign(myCollection);

/**
 * submitting extrinsic and returns extrinsic hash
 */
const { hash } = await sdk.collections.creation.submit(myCollection);

/**
 * submitting extrinsic and returns Observable of extrinsic progress
 */
const newCollection$ = sdk.collections.creation.submitWatch(myCollection);

newCollection$.subscribe({
  next: (next) =>
    console.log(next.parsed?.collectionId || next.submittableResult.status),
});

/**
 * submitting extrinsic, returns final extrinsic result (status, events, other human info) and parsed data
 */
const result = await sdk.collections.creation.submitWaitResult(myCollection);

console.log(`Created collection with id ${result.parsed.collectionId}`);

/**
 * Signer may be provided as option
 */

const signer = new SeedSigner({ seed: '//Bob' });
await sdk.collections.creation.submitWaitResult(myCollection, { signer });
```
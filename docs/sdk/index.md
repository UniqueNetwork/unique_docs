# Connection tools

## Overview

Unique Network provides various blockchain connection tools in order to simplify the features implementation in your project.

Depending on the project characteristics and the development team capabilities, you can choose the most suitable tool for you: SDK, Substrate REST or Substrate Client.

## Packages

### SDK

Our SDK allows integrating all Unique Network features into your web3 application without interacting with low-level API. Using SDK, you can mint collections and tokens, manage account balance, etc.
Technically, it is a REST add-on that allows you to use the same methods in a simplified form.

### Substrate REST

You can use a proxy HTTP service (Substrate REST) to implement server logic.
It is designed to interact with the blockchain using simple HTTP requests.
In general, this package is pretty close to SDK, but it provides you with more freedom to work with extrinsic on your side, such as:

1. Build an unsigned extrinsic.
2. Sign and verify the extrinsic using service 
   (these functions should be implemented on a client for safety).
3. Submit the extrinsic.

With Substrate REST, you can use public or self-hosted endpoints, which provides some flexibility in project and security settings.

### Substrate Client

Substrate Client is a JavaScript/TypeScript library that helps to interact with Unique Network directly. This approach is recommended only for experienced developers which have already worked with blockchains. This is the most low-level package that we provide. 

Substrate Client was developed as an add-on of the [Polkadot{.js} ApiPromise](https://polkadot.js.org/docs/api/start/), 
extending it with simple methods to work with the Unique Network.

However, Substrate Client can also be used with any network based on the [Substrate framework](https://substrate.io) - main modules (extrinsics, balance, query, sign, etc.) will work with them.

Substrate Client is a low-lower connection tool that is easier than the WSS connection, but it requires more development and infrastructure support than SDK or Substrate REST.

## How to install

### SDK

#### Installation

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/sdk
```

  </CodeGroupItem>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/sdk
```

  </CodeGroupItem>
</CodeGroup>

#### Initialization

```typescript:no-line-numbers
import Sdk, {Options} from "@unique-nft/sdk";
const options: Options = {
    baseUrl: '<REST API URL>'
};
const sdk = new Sdk(options);
```
In the `baseUrl` parameter, you must pass one of the paths to [our networks](../networks/index.md):

**Opal** : ``https://rest.unique.network/opal/v1``

**Quartz** : ``https://rest.unique.network/quartz/v1``

**Unique** : ``https://rest.unique.network/unique/v1``

#### Set a signer

To be able to sign extrinsics, you need to install the [`Accounts`](https://www.npmjs.com/package/@unique-nft/accounts) package.

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/accounts
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/accounts
```

</CodeGroupItem>
</CodeGroup>

Pass the `signer` in the parameters when creating the `Client` object.

```typescript:no-line-numbers
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { KeyringOptions } from '@polkadot/keyring/types';
import Sdk, { Options } from "@unique-nft/sdk";

const options: KeyringOptions = {
  type: 'sr25519',
};
const provider = new KeyringProvider(options);
await provider.init();

const signer = provider.addSeed('<seed of account>');

const clientOptions: Options = {
  baseUrl: 'REST API URL',
  signer,
};
const sdk = new Sdk(clientOptions);
```

### Substrate REST

#### Installation
Choose install approach: [Docker](#docker) or [Public endpoints](#public-endpoints).

##### Docker

```bash:no-line-numbers
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://ws-opal.unique.network uniquenetwork/web:latest
```

See the [hub.docker.com](https://hub.docker.com/r/uniquenetwork/web) page for more details.

#### Public endpoints

You can use public endpoints for access Unique Web:

**Opal** : ``https://web-opal.unique.network``

**Quartz** : ``https://web-quartz.unique.network``

**Unique** : ``https://web-unique.unique.network/``


### Environment variables

##### CHAIN_WS_URL (required)

```ts:no-line-numbers
// Opal
CHAIN_WS_URL = 'wss://ws-opal.unique.network'
// Quartz
CHAIN_WS_URL = 'wss://ws-quartz.unique.network'
// Unique
CHAIN_WS_URL = 'wss://ws.unique.network'
```

##### SIGNER_SEED (optional)

The `SIGNER_SEED` value is used for the signing the transactions.

```ts:no-line-numbers
// type mnemonic here
SIGNER_SEED = 'nest have have have brave have nest nest nest body have amazing'
```

##### Port (optional, default value is 3000)
```ts:no-line-numbers
PORT = 3000
```

##### IPFS Gateway (optional)
```ts:no-line-numbers
IPFS_GATEWAY_URL = 'https://ipfs.unique.network/ipfs/'
```

##### IPFS upload URL (optional)

IPFS_UPLOAD_URL allows you to specify a setting for uploading files via IPFS.
```ts:no-line-numbers
IPFS_UPLOAD_URL = 'http://192.168.100.183:5001/api/v0'
```

##### Cache manager (optional)

Extrinsics results cache time

```ts:no-line-numbers
CACHE_TTL = 600
```

To set up the Redis store to cache extrinsics
```ts:no-line-numbers
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0
```

##### Prefix (optional)

PREFIX allows you to add a global prefix to API.
By default, the prefix is empty.

### Secondary endpoints

You can also use a secondary connection for substrate, which allows you to use secondary endpoints.

Substrate endpoints

```ts:no-line-numbers
// Unique
https://web-unique.unique.network/swagger/dot/
// Quartz
https://web-quartz.unique.network/swagger/ksm/
```

#### Secondary environment variables

```ts:no-line-numbers
SECONDARY_CHAIN_WS_URL = 'wss://kusama-rpc.polkadot.io'
SECONDARY_CHAIN_NAME = 'ksm'

// or

SECONDARY_CHAIN_WS_URL = 'wss://rpc.polkadot.io'
SECONDARY_CHAIN_NAME = 'ksm'
```

## Substrate Client

#### Installation

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/substrate-client
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/substrate-client
```

</CodeGroupItem>
</CodeGroup>

#### Initialization

```typescript:no-line-numbers
import { createSigner } from '@unique-nft/substrate-client/sign';
import { Client } from '@unique-nft/substrate-client';
import fetch from 'node-fetch';

(async () => {
  const client = await Client.create({
    chainWsUrl: 'wss://quartz.unique.network',
    signer: await createSigner({
      seed: '//Alice', // Signer seed phrase if you want to sign extrinsics
      }),
    erc721: { // enable this option to parse ERC721 tokens
      fetch: async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        try {
          return await response.json();
        } catch (e) {
          return true;
        }
      },
      ipfsGateways: ['https://ipfs.io', 'https://gateway.ipfs.io'],
    },
  });
})();
```


## Comparison of connection tools

Every connection tool has several advantages and disadvantages compared to each others.

#### SDK

As the most user-friendly tool, the SDK has no obvious disadvantages compared to other tools.

| Advantages                                                                 |
|----------------------------------------------------------------------------|
| It is a very small package (58 kB only)                                    |
| There is no need to use the WSS connection, that means no connection delay |
| The highest possible level of backward compatibility                       |
| No need for infrastructure support (in the case of using public endpoints) |
| No need to implement the transaction signature logic                       |


### Substrate REST


| Advantages                                                                                                                  | Disadvantages                                                                                                             |
|-----------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| This package can be used with any programming language (SDK and Substrate Client are available only for specific platforms) | Substrate REST provides fewer use cases than Substrate Client                                                             |
| Using public endpoints allows you to use public IPFS nodes                                                                  | Unlike SDK, Substrate REST supposes that you have your own infrastructure                                                 |
| Using private endpoints allows you to increase the level of security for transaction signing and to use your IPFS nodes     | Public endpoints don't allow you to implement safe transaction signing without JS (it is compatible only with browsers)   |
|                                                                                                                             | Private endpoints don't allow you to use public IPFS and require that you build transaction signing logic in your project |


### Substrate client


| Advantages                                                                                                                                        | Disadvantages                                                                       |
|---------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| Compared to Substrate REST, Substrate Client already contains all the dependencies                                                                | New features are implemented in this package later, then in Substrate REST          |
| The package contains all core blockchain features and methods                                                                                     | Relatively large package (0,5 MB), which could be critical for browser applications |
| Contains verification of the sufficiency of funds in the account for a specific transaction or confirmation of ownership of the transferred token | Doesn't contain IPFS, which means you have to upload images on your own             |
|                                                                                                                                                   | Releases come out more often, but have less backward compatibility                  |
|                                                                                                                                                   | Contains an inner WSS connection, which means that connection delays could occur    |

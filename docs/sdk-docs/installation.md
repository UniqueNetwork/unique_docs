



# How to install

# Table of Contents

- [SDK](#sdk)
- [Substrate REST](#substrate-rest)
- [Substrate Client](#substrate-client)


## SDK

### npm
```shell
npm install @unique-nft/sdk
```

### Initialization

#### Node.js
```typescript
import { Sdk, Options } from '@unique-nft/sdk';
const options: Options = {
  baseUrl: '<REST API URL>'
};
const sdk = new Sdk(options);
```
In the `baseUrl` parameter, you must pass one of the paths to the [`Unique Network`](../web)

#### Opal
```shell
https://rest.unique.network/opal/v1
```

#### Quartz
```shell
https://rest.unique.network/quartz/v1
```

#### Unique
```shell
https://rest.unique.network/unique/v1
```

#### Set a signer

To be able to sign extrinsics, you need to install the [`Accounts`](../accounts) package
```shell
npm install @unique-nft/accounts
```
Pass the `singer` in the parameters when creating the `Client` object
```typescript
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { KeyringOptions } from '@polkadot/keyring/types';
import { Sdk, Options } from "@unique-nft/sdk";

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


## Substrate REST

Substrate REST Deployment - Getting Started Guide

- [How to install](#install)
- [How to configure – environment variables](#environment-variables)
- [How to configure – secondary environment variables](#secondary-environment-variables)


### Install
Choose install approach: [Docker](#docker), [Source code](#git) or [Public endpoints](#public-endpoints)

#### Docker

```bash
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://ws-opal.unique.network uniquenetwork/web:latest
```

<a href="https://hub.docker.com/r/uniquenetwork/web" target="_blank">See hub.docker.com page</a>

#### Git

```git
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:web
npm start
```

#### Public endpoints

You can use public endpoints for access Unique Web:

#### Opal
```
https://web-opal.unique.network
```

#### Quartz
```
https://web-quartz.unique.network
```

#### Unique
```
https://web-unique.unique.network/
```


### Environment Variables

#### Required

#### Opal
```bash
CHAIN_WS_URL=wss://ws-opal.unique.network
```

#### Quartz
```bash
CHAIN_WS_URL=wss://ws-quartz.unique.network
```

#### Unique
```bash
CHAIN_WS_URL=wss://ws.unique.network
```

#### Optional

##### Use `SIGNER_SEED` for [sign](#sign-an-extrinsic) method
```bash
SIGNER_SEED=type mnemonic here
SIGNER_SEED=//Alice
```

##### Port (default 3000)
```bash
PORT=3000
```

##### IPFS Gateway
```bash
IPFS_GATEWAY_URL=https://ipfs.unique.network/ipfs/
```

##### IPFS upload URL

IPFS_UPLOAD_URL allows you to specify a setting for uploading files via IPFS.
```bash
IPFS_UPLOAD_URL=http://192.168.100.183:5001/api/v0
```

##### Cache manager
Extrinsics results cache time:
```bash
CACHE_TTL=600
```

To set up the Redis store to cache extrinsics:
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

##### Prefix

PREFIX allows you to add a global prefix to API.
By default, the prefix is empty.

### Secondary endpoints

You can also use a secondary connection for substrate, which allows you to use secondary endpoints.

Substrate endpoints
```
https://web-unique.unique.network/swagger/dot/
https://web-quartz.unique.network/swagger/ksm/
```

#### Secondary environment variables

```bash
SECONDARY_CHAIN_WS_URL=wss://kusama-rpc.polkadot.io
SECONDARY_CHAIN_NAME=ksm
```
or

```bash
SECONDARY_CHAIN_WS_URL=wss://rpc.polkadot.io
SECONDARY_CHAIN_NAME=ksm
```


## Substrate Client

#### npm

```shell
npm install @unique-nft/sdk
```

#### yarn

```shell
yarn add @unique-nft/sdk
```

#### git

```shell
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:sdk
```

### Initialize Substrate Client

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

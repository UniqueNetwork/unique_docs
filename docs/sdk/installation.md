# How to install

[[toc]]

## SDK

### Installation

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

### Initialization

```typescript:no-line-numbers
import { Sdk, Options } from '@unique-nft/sdk';
const options: Options = {ву
    baseUrl: '<REST API URL>'
};
const sdk = new Sdk(options);
```
In the `baseUrl` parameter, you must pass one of the paths to [our networks](../networks/index.md):

**Opal** : ``https://rest.unique.network/opal/v1``

**Quartz** : ``https://rest.unique.network/quartz/v1``

**Unique** : ``https://rest.unique.network/unique/v1``

### Set a signer

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

### Installation
Choose install approach: [Docker](#docker), [Source code](#git) or [Public endpoints](#public-endpoints).

#### Docker

```bash:no-line-numbers
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://ws-opal.unique.network uniquenetwork/web:latest
```

See the [hub.docker.com](https://hub.docker.com/r/uniquenetwork/web) page for more details.

#### Git

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:web
npm start
```

  </CodeGroupItem>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
yarn
yarn run build:web
yarn start
```

  </CodeGroupItem>
</CodeGroup>


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

### Installation

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

**via Git:**

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:substrate-client
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
yarn
yarn build:substrate-client
```

</CodeGroupItem>
</CodeGroup>

### Initialization

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

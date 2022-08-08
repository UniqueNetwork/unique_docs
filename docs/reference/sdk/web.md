

# Web Readme

# Table of Contents

- [Intro](#intro)
- [Getting started](#sdk-deployment---getting-started-guide)
  - [Install](#install)
  - [Environment Variables](#environment-variables)
  - [Secondary endpoints](#secondary-endpoints)
- [Swagger](#swagger)
- [Mutation methods](#mutation-methods)
- [Query methods](#query-methods)
- [IPFS](#using-ipfs-for-uploading-files)


## Intro

WEB package is a REST API that allows you to connect and make changes to the chain without installing the whole SDK or using ApiPromise. By that, you can ease your work with chain and be as close to Web3 as it's possible in Web2.

The main object you will work on in this package is an extrinsic. Extrinsic is a request to change data in the blockchain.

https://docs.substrate.io/v3/concepts/extrinsics/

https://polkadot.js.org/docs/substrate/extrinsics/

To make changes to the blockchain, it is necessary to form a request (extrinsic) with certain parameters, which consists of 3 parts:
1) Blockchain section
2) Method section
3) Array of arguments

Once an extrinsic has been generated, it must be signed in order for the chain to complete the requested changes.


## SDK Deployment - Getting Started Guide


- [How to install](#install)
- [How to configure – environment variables](#environment-variables)
- [How to configure – secondary environment variables](#secondary-environment-variables)
- [Where to try - Swagger](#swagger)

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

<a href="https://docs.unique.network/unique-and-quartz-wiki/build/get-started/testnet-and-mainnet" target="_blank">See official Unique Network documentation</a>

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
By default, prefix is empty.

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


## Swagger

```
https://web-unique.unique.network/swagger/
```

## Mutation methods

Unique SDK allows using mutation methods for updating the state of the blockchain. By default, they return an unsigned extension. To apply this change in the blockchain state, you must sign it and send the extrinsic and the signature in the blockchain.
By doing that you can complete the entire sequence of actions for extrinsic:
  - Building an extrinsic
  - Signing an extrinsic
  - Signing verification
  - Submitting an extrinsic

After that you can use extrinsic hash received as a response for checking the extrinsic status.

For more convenience, we have implemented a complex method: if you initialize the SDK with a signer, you can sign and send extrinsics seamlessly, without separate actions.

Read more about mutation methods in <a href="../packages/sdk#mutation-and-query-methods">SDK documentation</a>.

## Query methods

Unique SDK allows using Query methods for reading blockchain storage (e.g. balance, or token properties) in human-readable format.

Read more about mutation methods in <a href="../packages/sdk#mutation-and-query-methods">SDK documentation</a>.


## Using IPFS for uploading files

You can use IPFS nodes (your private nodes or [public gateway](#ipfs-gateway)) for uploading files to the blockchain.


### Uploading files via IPFS
```
POST /ipfs/upoad-file
```
This method uploads a chosen file as a single file.

<a href="https://web-quartz.unique.network/swagger/#/ipfs/IpfsController_uploadFile">Upload file on Swagger</a>

### Upload zip via IPFS
```
POST /ipfs/upoad-zip
```

This method uploads a zip archive as a folder containing files.

<a href="https://web-quartz.unique.network/swagger/#/ipfs/IpfsController_uploadZip">Upload zip file on Swagger</a>


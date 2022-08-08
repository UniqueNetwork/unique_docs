

# SDK Readme

# Table of Contents

- [Intro](#intro)
- [Getting started](#how-to-start)
- [Packages](#packages)
  - [SDK](#sdk)
  - [Accounts](#accounts)
  - [Web](#web)
- [Recipes](#recipes)

## Intro

The SDK is intended for developers whose goal is to implement Unique Network functions avoiding working with a low-level blockchain API.
This SDK may be used as an npm package or REST API.

## How to start

Add SDK to your JavaScript/TypeScript project with

```
npm install @unique-nft/sdk
```
or deploy your own SDK as HTTP REST Service with

```
docker run uniquenetwork/web:latest
```


You can also use [Public endpoints](./web.md#public-endpoints).
To learn more read [SDK Deployment guide](./web.md#sdk-deployment---getting-started-guide): [Docker](./web.md#docker), [Git](./web.md#git).

## Packages

### SDK

[SDK package](./sdk.md) contains npm package of SDK itself.

### Accounts

[Accounts package](./accounts.md)

### Web

As an alternative to the whole SDK, you can use proxy http serviсe for SDK to implement server logic - [HTTP API Service](./web.md).
It is created to interact with the blockchain using simple HTTP requests.
In general, this service provides the following functions:

1.  [Building an unsigned extrinsic](./web.md#build-unsigned-extrinsic)
2.  [Extrinsic signing and verification using service (These functions should be implemented on client for safety)](./web.md#sign-an-extrinsic)
3.  [Submitting an extrinsic](./web.md#Submit-extrinsic)

HTTP API Service also allows to upload images using IPFS, can be used with existing public nodes or with your own private nodes.
Use [service documentation](./web.md#readme) to learn its methods.

## Recipes

[Here](./recipes.md) you can find some useful hints or life hacks that will ease using of SDK.

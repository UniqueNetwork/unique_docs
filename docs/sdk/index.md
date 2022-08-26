
# Unique Network connection tools

# Table of Contents

- [Intro](#intro)
- [Packages](#packages)
  - [SDK](#sdk)
  - [Substrate REST](#substrate-rest)
  - [Substrate Client](#substrate-client)

## Intro

Unique Network provides you with a various blockchain connection tools in order to ease the implementation of blockchain features into your project.

Depending on the characteristics of your project and the capabilities of the development team, you can choose the most suitable tool for you: SDK, Substrate REST or Substrate Client.

## Packages

### SDK

Our SDK allows you to integrate all UniqueNetwork Chain features into your web3 application without interacting with low-level API. With SDK you can mint collections and tokens, manage account balance, etc.
Technically, it is a REST add-on that allows you to use the same methods in a simplified form.

SDK package has several advantages compared to other connection tools:

- It is a very small package (58 kB only).
- There is no need for the WSS connection, which means no connection delay.
- The highest possible level of backward compatibility.
- No need for infrastructure support (in case of using public endpoints).
- No need to implement the transaction signature logic.

Use [how to install chapter](../doc/installation.md) to learn how to add SDK to your project.

On our [repository page](../packages/client/README.md) you can learn more about SDK.

[The methods list chapter](../packages/sdk/tokens/methods) contains a description for all methods you can use with SDK.

### Substrate REST

As an alternative to other connection tools, you can use a proxy HTTP service (Substrate REST) to implement server logic.
It is created to interact with the blockchain using simple HTTP requests.
In general, this package is pretty close to the SDK, but it gives you more freedom to work with extrisics on your side, such as:

1. [Building an unsigned extrinsic](../packages/web#build-unsigned-extrinsic)
2. [Extrinsic signing and verification using service (These functions should be implemented on a client for safety)](../packages/web#sign-an-extrinsic)
3. [Submitting an extrinsic](../packages/web#Submit-extrinsic)

With Substrate REST you can use public or self-hosted endpoints, which gives you some flexibility in project and security settings.

Substrate REST has both some advantages and disadvantages compared to other connection tools.

Advantages:
- This package can be used with any programming language (SDK and Substrate Client are supporting only JS for now).
- Using public endpoints allows you to use public IPFS nodes.
- Using private endpoints allows you to increase the level of security for transaction signing and to use your IPFS nodes.

Disadvantages:
- Substrate REST contains fewer use cases than Substrate client.
- Unlike SDK, Substrate REST means you have to have your  infrastructure.
- Public endpoints don't allow you to implement safe transaction signing without JS (it is compatible only with browsers).
- Private endpoints don't allow you to use public IPFS and require you to build transaction signing logic in your project.

Use [how to install chapter](../doc/installation.md) to learn how to add SDK to your project.

On our [repository page](../packages/web/README.md) you can learn more about SDK.

### Substrate Client

Substrate Client is a JavaScript/TypeScript library (npm) that helps to interact with UniqueNetwork using simple methods instead of low-level API. With SDK you can mint collections and tokens, manage account balance, etc. At the moment, the library is a pre-alpha version. We will be grateful for the feedback and ideas for improvement.

Substrate Client was developed as an add-on of
<a href="https://polkadot.js.org/docs/api/start" target="_blank">Polkadot{.js} ApiPromise</a>,
extending it with simple methods to work with the Unique Network blockchains
(Opal, Quartz, Unique).
However, Substrate Client can be used with any network based on the
<a href="https://substrate.io" target="_blank">Substrate framework</a> - main modules (extrinsics, balance, query, sign, etc.) will work with them.

Substrate Client is a low-lower connection tool that is easier than WSS connection but requires more development and infrastructure support, than SDK or Substrate REST.

Advantages:
- Compared to WSS, Substrate Client already contains all the dependencies.
- The package contains all core blockchain features and methods.
- Contains verification of the sufficiency of money on the account for a specific transaction or verification of ownership of the transferred token.

Disadvantages:
- New features are implemented in this package later, then in WSS.
- Relatively large package (0,5 MB), which could be critical for browser applications.
- Doesn't contain IPFS, which means you have to upload images by yourself.
- Releases come out more often and have less backward compatibility.
- Contains an inner WSS connection, which means connection delays are possible.

Use [how to install chapter](../doc/installation.md) to learn how to add SDK to your project.

On our [repository page](../packages/sdk/README.md) you can learn more about SDK.

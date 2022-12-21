# Connection tools

[[toc]]

## Overview

Unique Network provides various blockchain connection tools in order to simplify the features implementation in your project.

Depending on the project characteristics and the development team capabilities, you can choose the most suitable tool for you: SDK, Substrate REST or Substrate Client.

## Packages

### SDK

Our SDK allows integrating all Unique Network features into your web3 application without interacting with low-level API. Using SDK, you can mint collections and tokens, manage account balance, etc.
Technically, it is a REST add-on that allows you to use the same methods in a simplified form.

SDK has several advantages compared to other connection tools:

- It is a very small package (58 kB only).
  
- There is no need to use the WSS connection, that means no connection delay.
- The highest possible level of backward compatibility.
- No need for infrastructure support (in the case of using public endpoints).
- No need to implement the transaction signature logic.

To learn how to add SDK to your project, please refer to the [How to install](./installation.md#sdk) section.

You can learn SDK deeply by reviewing its [repository](https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/sdk/).

The [Methods](./methods.md) section contains the description of all available SDK methods.

### Substrate REST

You can use a proxy HTTP service (Substrate REST) to implement server logic.
It is designed to interact with the blockchain using simple HTTP requests.
In general, this package is pretty close to SDK, but it provides you with more freedom to work with extrinsic on your side, such as:

1. Build an unsigned extrinsic.
2. Sign and verify the extrinsic using service 
   (these functions should be implemented on a client for safety).
3. Submit the extrinsic.

With Substrate REST, you can use public or self-hosted endpoints, which provides some flexibility in project and security settings.

Substrate REST has advantages and disadvantages compared to other connection tools.

**Advantages:**

- This package can be used with any programming language (SDK and Substrate Client are available only for specific platforms).
- Using public endpoints allows you to use public IPFS nodes.
- Using private endpoints allows you to increase the level of security for transaction signing and to use your IPFS nodes.

**Disadvantages:**

- Substrate REST provides fewer use cases than Substrate Client.
- Unlike SDK, Substrate REST supposes that you have your own infrastructure.
- Public endpoints don't allow you to implement safe transaction signing without JS (it is compatible only with browsers).
- Private endpoints don't allow you to use public IPFS and require that you build transaction signing logic in your project.

To learn how to use Substrate REST in your project, please refer to the [How to install](./installation.md#substrate-rest) section.

### Substrate Client

Substrate Client is a JavaScript/TypeScript library that helps to interact with Unique Network directly. This approach is recommended only for experienced developers which have already worked with blockchains. This is the most low-level package that we provide. 

Substrate Client was developed as an add-on of the [Polkadot{.js} ApiPromise](https://polkadot.js.org/docs/api/start/), 
extending it with simple methods to work with the Unique Network.

However, Substrate Client can also be used with any network based on the [Substrate framework](https://substrate.io) - main modules (extrinsics, balance, query, sign, etc.) will work with them.

Substrate Client is a low-lower connection tool that is easier than the WSS connection, but it requires more development and infrastructure support than SDK or Substrate REST.

**Advantages:**

- Compared to Substrate REST, Substrate Client already contains all the dependencies.
- The package contains all core blockchain features and methods.
- Contains verification of the sufficiency of funds in the account for a specific transaction or confirmation of ownership of the transferred token.

**Disadvantages:**

- New features are implemented in this package later, then in Substrate REST.
- Relatively large package (0,5 MB), which could be critical for browser applications.
- Doesn't contain IPFS, which means you have to upload images on your own.
- Releases come out more often, but have less backward compatibility.
- Contains an inner WSS connection, which means that connection delays could occur.

To learn how to add Substrate Client to your project, please refer to the [How to install](./installation.md#substrate-client) section.

You can review the Substrate Client deeper in its [repository](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/substrate-client).
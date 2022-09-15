# The SDK (Unique Network connection tools)

Every developer needs a handy tool for the job to be efficient at building stuff. A well built tool optimized for the task not only speeds up the development but makes it more robust and helps avoid the snags of frequent bugs and unnecessary complexity.

Before we dive into the SDK details, a recap of the ways a developer can approach the task of building a dApp on Unique network is in order.

If you're pressed for time jump over to the [TL;DR](#tldr)

## Substrate-first / Ethereum-first

Unique network, being built on the Polkadot and Kusama relay chains is at it's core a Substrate-based parachain. This implies a Rust-based development platform as Substrate itself is a Rust-based framework.

On the other hand we also have a fully capable EVM integrated with the Unique blockchain. And EVM offers access via an Ethereum's Solidity-based platform/framework to the Unique blockchain.

Hence, looking at it from the most general perspective a developer has the option of choosing an Substrate-first or an Ethereum-first path of development.

Although Ethereum-first path may seem a convenient approach (wider developer base) the true nature of this option is portability; a migration path; a means to quickly adapt and build upon the existing work.

The Substrate-path on the other hand accesses all the functionality, versatility, speed and features of the blockchain at a core level providing the peak efficiency and utility for which it was designed.

The only issue so far is, Rust devs are spread far and wide in this moment in time and this is a limiting factor for a fast adoption path and ecosystem growth.

This is where the SDK comes into play.

## A Software Development Kit to the rescue

Unique Network SDK is a platform specific application development toolset which provides a framework for rapid dApp development on the Unique Network blockchain.

The priority in developing the SDK was to provide such a tool for most abundant developer base. Hence, it is built as a Javascript/Typescript (JS/TS) library.

The SDK uses a REST API to make calls to a publicly accessible node invoking calls that access methods that operate directly on the blockchain. In other words, it operates via a thin client.

This method of providing a high-level abstraction to the Substrate level core blockchain operations has the following benefits:

- avoids the need to keep track of library versioning and dependencies,
- is guaranteed to provide the highest availability as the servers are maintained by the core team that is actively developing the blockchain core and
- provides a low-maintenance solution.

This approach also provides a way to maintain a high level of operational stability and to some extent a way to future-proof current dApp development efforts in a rapidly evolving underlying technology. This is a crucial benefit in the context of an ecosystem in which both the relay chain and parachain have a very fast development cycle with aggressive minor/major update schedule.

This solution is not a best fit-for-all though. Since it involves transfer of data via an established interconnection with a remote server, the issue of data security is a legitimate concern for maximum-security setups considering that signing extrinsics entails sending of sensitive authorization data across the network. For the cases where  the provided default encryption of the session channel is not security enough, a thick-client (within an isolated network) is the most convenient option. In this setup, the task of maintaining availability and keeping the service up to date is delegated to the maintainers of the thick client. However, the thick client implements a Substrate Client solution and thus does not benefit from the high-level abstraction and thus the convenience that the SDK and the REST API provides.

## What's planned for the nearest future

The JS/TS SDK is just the first in the series of platform-specific SDKs Unique team intends to provide for the developer community. Versions for the following platforms are planned in the nearest future:

- Android mobile devices
- iOS
- C#

## TL;DR

- An SDK just got published that provides devs with a way to rapidly develop dApps and utilities  for the Unique Network blockchains
- The SDK is a library that uses convenient high-level calls to perform complex operations on the blockchain. It uses a REST API to invoke these calls.
- The SDK forms a stack of technologies:
  - SDK (a JS/TS Library; uses the Rest API) 
  - Rest API (uses the Substrate Client under the hood)
  - Substrate Client (a JS/TS library; uses the Polkadot.JS API under the hood)
- SDK Libraries for the following platforms soon to follow:
  - Android
  - iOS
  - C#

## Links to dev tools

- [SDK Documentation](https://docs.unique.network/sdk)
- [Swagger](https://rest.unique.network/quartz/swagger)

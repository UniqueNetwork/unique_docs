# What is the SDK (or Unique Network connection tools)

## The SDK is out! Meet the amazing new developer tool

Every developer needs a handy tool for the job to be efficient at building stuff. A well built tool optimized for the task not only speeds up the development but makes it more robust and helps avoid the snags of frequent bugs and unnecessary complexity.

Before we dive into the SDK details, a recap of the ways a developer can approach the task of building a dApp on Unique network is in order.

If you're pressed for time jump over to the [TL;DR](#tldr)

## Substrate-first / Ethereum-first

Unique network, being built on the Polkadot and Kusama relay chains is at it's core a Substrate-based parachain. This implies a Rust-based development platform as Substrate itself is a Rust-based framework.

On the other hand we also have a fully capable EVM integrated with the Unique blockchain. And EVM offers access via an Ethereum's Solidity-based platform/framework to the Unique blockchain.

Hence, looking at it from the most general perspective a developer has the option of choosing an Substrate-first or an Ethereum-first path of development.

Although Ethereum-first path may seem a convenient approach due to a possibility of familiarity with the Ethereum dev platform due to the wider adoption at this moment in time, the true nature of this option is portability. A migration path, a convenient way to retain work already accomplished in the Ethereum development phase of a migrating NFT collection or dApp.

The Substrate-path on the other hand accesses all the functionality, versatility, speed and features of the blockchain at a core level providing the peak efficiency and utility for which it was designed.

The only issue so far is, Rust devs are spread far and wide and this is a limiting factor for a fast adoption path and ecosystem growth.

This is where the SDK comes into play.

## A Software Development Kit to the rescue

Unique Network SDK is a platform specific application development toolset which provides a framework for rapid dApp development on the Unique Network blockchain.

Our priority in developing the SDK was to provide the front-end and back-end developers for dApps such a tool. A savvy dev would, at this point, rightly conclude that the SDK must then be a Javascript/Typescript library. And that is in fact so, as such a library does exist, but there is a more general approach which provides a unique (pun intended) set of benefits: **a thin client SDK providing a remote procedure call server (RPC) accessible via an API.**

Calls to the blockchain methods (which allow a high-level abstraction to the core blockchain operations at the Substrate level) via the API to the thin-client:

- avoid the need to keep track of library versioning and dependencies,
- are guaranteed to provide the highest availability as the servers are maintained by the core team that is actively developing the blockchain core and
- provide a low-maintenance solution.

This approach provides a way to maintain a high level of operational stability and to some extent a way to future-proof current dApp development efforts in a rapidly evolving underlying technology. This is a crucial benefit in the context of an ecosystem in which both the relay chain and parachain have a very fast development cycle with aggressive minor/major update schedule.

This solution is not a best fit for all though. Since it involves transfer of data via an established interconnection with a remote server, the issue of data security is a legitimate concern for maximum-security setups considering that signing extrinsics entails sending of sensitive authorization data across the network. For these cases a thick-client (within an isolated network) is the most convenient option. In this setup, the task of maintaining availability and keeping the service up to date is delegated to the maintainers of the thick client.

And finally, as mentioned initially, there is an option to utilize the SDK by importing a library and use it in the classical development context within a development environment. It goes without saying that the maintenance of the library version and dependencies is upon the maintainer of the dev environment.

## What's planned for the nearest future

The JavaScript/TypeScript SDK is just the first in the series of platform-specific SDKs Unique team intends to provide for the developer community. Versions for these platforms are planned in the nearest future:

- Android mobile devices
- iOS
- C#

## TL;DR

- An SDK just got published that provides devs with a way to develop dApps and utilities rapidly for the Unique Network blockchains
- It can be used in three 'flavors':
  - thin client (REST API)
  - thick client (REST API)
  - Javascript/Typescript library
- SDK Libraries for the following platforms soon to follow:
  - Android
  - iOS
  - C#


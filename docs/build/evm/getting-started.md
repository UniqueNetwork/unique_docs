# Getting started

We prepared this document in the hopes that it will answer most of your questions regarding the matter of implementing native NFTs in the context of your Solidity-centric application.

The premise of this document is as follows (for whom this document is intended):

- your non-native NFT project has been principally developed on and for an Ethereum-based, general-contract, ERC-721 concept NFT environment
- you wish to transform your ERC-721 collection to a native version of the NFT because you desire to implement the advanced features provided to the NFTs in the Unique network in you application
- you wish to have access to the methods that provide these features in your Solidity contracts if necessary
- you do not want to write complex code to use the new features
- you need to retain any already created Solidity contracts that provide crucial application functionality and you do not want to make radical changes to your contracts to be able to adapt your existing code
- you need access to both Ethereum and Substrate address spaces so your existing Solidity contracts can interact in both spaces
- you wish to be able to provide access to your app to wallets in both address spaces (Metamask, Subwallet, Talisman, Wallet Connect wallets, etc) without a complex recoding of your contracts

Since your core functionality is provided via Solidity contracts, we have taken care to provide you with as much examples and instructions as possible to help you navigate the transition from the existing ERC-721 tokens to the Unique native model.

:::tip
One note to be mindful of is: the most efficient way of accomplishing this goal is by using the Unique SDK 2.0. It will provide you with the framework, the tools and the methods to make this fast and easy, so do brush up on your Typescript if you have been away from it for a while. It will save you an enormous amount of time. To make it as real-world as possible, we have implemented our SDK calls in a [React framework](https://github.com/UniqueNetwork/unique-react-template) so you can gauge how the SDK functions in a UI context and you can see it all in the video listed below.
:::

That said...

Once you read through this document, we propose that you attempt to replicate the following steps to master your challenge:

1. Create a wallet selector that uses any of {Polkadot.js wallet, Subwallet, Talisman, Metamask, Wallet Connect} wallet to connect to your app.
2. Create a collection using the SDK
3. Mint a token using the SDK
4. Write a Solidity contract in the EVM to use with the native NFT to change some NFT attribute, for example
5. Call that contract from the SDK
6. Nest a token

ALL the examples for this except point 6 are shown in [this video](https://youtu.be/Cid_Ui5e0rk).

To nest, you just send a native token to a native token address as though it is a wallet using a simple send call via the SDK. That's all. Nesting doesn't even have a dedicated method. It is a simple send of a token to another tokens address.

Read on...

## EVM and Substrate

There are two types of accounts – Substrate (5Grw...) and EVM (0x...)
In terms of calling contracts:

- EVM accounts operate the same way as in Ethereum
- Substrate accounts cannot call EVM contracts directly because EVM works only with EVM accounts. But they can do it through the `evm.call` extrinsic (in SDK - `sdk.evm.send` method). For contract, `msg.sender` will be Substrate's account mirror – EVM account. To calculate the Substrate account mirror, use the `Address` utility from `@unique-nft/utils`

```ts
import { Address } from "@unique-nft/utils";

const ethMirror = Address.mirror.SubstrateToEthereum(
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
);
// 0xd43593c715Fdd31c61141ABd04a99FD6822c8558
```

or play with the [converter](https://docs.unique.network/reference/tools.html) in the documentation.

It is essential to understand that mirror calculation is a one-way operation. You cannot calculate the origin address from its mirror.

```ts
import { Address } from "@unique-nft/utils";

const ethMirror = Address.mirror.SubstrateToEthereum(
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
);
// 0xd43593c715Fdd31c61141ABd04a99FD6822c8558

const subMirrorBack = Address.mirror.EthereumToSubstrate(
  "0xd43593c715Fdd31c61141ABd04a99FD6822c8558"
);
// !!! different address 5FrLxJsyJ5x9n2rmxFwosFraxFCKcXZDngRLNectCn64UjtZ != 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

It is also worth noting that the EVM mirror cannot be controlled directly (e.g., it cannot be added to MetaMask).

### `CrossAddress` struct

To make direct interaction between contracts and Substrate accounts possible, we support the `CrossAddress` struct in Solidity. This struct represents the "Ethereum or Substrate" account.

```Solidity
// Solidity
struct CrossAddress {
  address eth;
  uint256 sub;
}
```

- For the EVM account, set the `eth` property with the EVM address (0x...), and the `sub` should be 0.
- For the Substrate account, set the `sub` property with the Substrate public key (not address!). The `eth` property should be equal to Ethereum zero address (0x000...00000);

To calculate Substrate public key from an address in Javascript, use `Address` utils.

```ts
import { Address } from "@unique-nft/utils";

const publicKey = Address.extract.SubstratePublicKey(
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
);
```

or convert the address to CrossAccount directly:

```ts
const cross = Address.extract.ethCrossAccountId(
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  // or "0xd43593c715Fdd31c61141ABd04a99FD6822c8558"
);
```

A lot of examples of how to use CrossAddress with EVM and Substrate accounts can be found in recipes of unique-contracts repo. For example:

- [minter contract](https://github.com/UniqueNetwork/unique-contracts/blob/main/contracts/recipes/Minter.sol#L100)
- how to [call the minter contract with EVM account](https://github.com/UniqueNetwork/unique-contracts/blob/main/test/minter.spec.ts)
- how to [call the minter contract with Substrate account](https://github.com/UniqueNetwork/unique-contracts/blob/main/test/minter.spec.ts)

## Signers and Wallets

Documentation section on how to build applications, and specifically [connecting accounts](https://docs.unique.network/build/sdk/v2/dapps.html#connecting-accounts)

It could be much easier to understand playing with code. Here is a [react template](https://github.com/UniqueNetwork/unique-react-template) you can use.

## SDK

SDK is only for Substrate accounts (remember that Substrate accounts can invoke contracts).
The [build](https://docs.unique.network/build/sdk/v2/quick-start.html) section of the documentation explains all the needed concepts.

## Why it makes sense to use the Unique Metadata Format and why you don't have to if you do not need it.

Unique Network implements NFTs natively – they are not contracts.

And yes, because of EVM support, plain ERC-721 NFTs can be created. However, no wallets, marketplaces, or other UIs in the ecosystem track this type of NFTs.

We support Unique Metadata Format, an OpenSea compatible, on-chain metadata format, to make your metadata readable for all interfaces. So, you need to stick this format until you understand why not.

However, there is good news—if you use SDK or unique contracts, you don't need to understand this format in detail. You only need to understand its features. Everything else is handled for you.

The [reference section](https://docs.unique.network/reference/schemas) in the documentation explaining all the features of unique metadata format.

The [js library for the unique metadata](https://github.com/UniqueNetwork/unique_schemas). You don't need it if you use SDK.

## How to call EVM contracts using Substrate account and SDK

- [Documentation](https://docs.unique.network/build/sdk/v2/evm.html)
- [EVM workshop](https://github.com/UniqueNetwork/unique-react-template/tree/workshop-EVM)
- [This function](https://github.com/UniqueNetwork/unique-react-template/blob/ab923457ece54f6ac6d1f2f47fc08ea52363dad1/src/pages/BreedingPage.tsx#L58-L107) covers how to invoke contracts

Long story short:

- You save the contract's ABI as JSON file and import it
- You call `sdk.evm.send` and pass abi, contract address, function name, and params

## To change a Unique Metadata compliant data attribute from EVM

Use @unique-nft/contracts, [TokenManager.sol](https://github.com/UniqueNetwork/unique-contracts?tab=readme-ov-file#tokenmanagersol)

EVM workhop demonstrates how to do this.

- [How do we mutate token image](https://github.com/UniqueNetwork/unique-react-template/blob/ab923457ece54f6ac6d1f2f47fc08ea52363dad1/contracts/contracts/BreedingGame.sol#L111-L119)
- [How do we mutate token attributes](https://github.com/UniqueNetwork/unique-react-template/blob/ab923457ece54f6ac6d1f2f47fc08ea52363dad1/contracts/contracts/BreedingGame.sol#L197-L202)
- [How do we call these solidity functions on the UI](https://github.com/UniqueNetwork/unique-react-template/blob/ab923457ece54f6ac6d1f2f47fc08ea52363dad1/src/pages/BreedingPage.tsx#L138-L173)

Please remember to view [this video](https://youtu.be/Cid_Ui5e0rk).

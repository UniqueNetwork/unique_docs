# Contract Helpers

Address: **0x842899ECF380553E8a4de75bF534cdf6fBF64049**

This precompiled contract allows the owner to manage the sponsorship of their contract.

In Unique Network, transactions can be sponsored, allowing for a gasless experience where the sponsor covers the transaction fees. This enables seamless and cost-free transfers of NFTs and the execution of smart contracts, even for accounts without native tokens.

[[toc]]

## Interface

<!-- TODO move this doc to build section: -->

Check the [reference section](../../../reference/blockchain/contract-helpers.md) for the complete interface details

## Code examples

Below are examples of how to use this precompiled contract with ethers.js and hardhat.

:::tip
If you're unfamiliar with setting up a Hardhat project, refer to the [official documentation](https://hardhat.org/docs)
:::

You will also need to install [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

### Connect to contract

First, let's deploy the smart contract to be sponsored and connect to ContractHelpers precompile. We assume you have developed a contract called MyContract.sol and want to sponsor its calls.

```ts
import { ethers } from "hardhat";
import { ContractHelpers__factory } from "@unique-nft/solidity-interfaces";

const [signer] = await ethers.getSigners();

const MyContractFactory = await ethers.getContractFactory("MyContract", seller);

// Contract to be sponsored
const myContract = await MyContractFactory.deploy();
myContract.waitForDeployment();

const contractHelpers = ContractHelpers__factory.connect(
  "0x842899ECF380553E8a4de75bF534cdf6fBF64049",
  signer
);
```

## Choose sponsoring mode

### Self-sponsoring

The simplest option is to sponsor transactions directly from the contract address itself.

```ts
await contractHelpers.selfSponsoredEnable(await myContract.getAddress());

const hasSponsor = await contractHelpers.hasSponsor(myContract.getAddress());
console.log("Self sponsoring enabled: ", hasSponsor); // true
```

### External address sponsoring

You can also set up sponsorship from an arbitrary address. In this case, one additional step is required – the sponsor must confirm the sponsorship.

```ts
await contractHelpers.selfSponsoredEnable(await myContract.getAddress());

const hasSponsor = await contractHelpers.hasSponsor(myContract.getAddress());
console.log("Self sponsoring enabled: ", hasSponsor); // true
```

### Enable sponsoring

There are a couple more steps to enable gasless transactions.

1. There are three sponsoring modes:

- 0: Disabled (default)
- 1: Allowlisted (Only users from allowlist will be sponsored)
- 2: Generous (All users will be sponsored)

Let's configure the contract to sponsor transactions for all users.

2. By default, not every block is sponsored due to a timeout. Let's adjust this setting.

```ts
// Sponsoring is Disabled by default:
const sponsoringEnabled = await contractHelpers.sponsoringEnabled(
  myContract.getAddress()
);
console.log("Is sponsoring enabled?", sponsoringEnabled);

// Set to 2 - Generous mode
await contractHelpers.setSponsoringMode(myContract.getAddress(), 2);
// Set to 0 - Sponsor transactions in every block
await contractHelpers.setSponsoringRateLimit(myContract.getAddress(), 0);

// Optionally, you can limit the maximum fee amount you want to sponsor
// await contractHelpers.setSponsoringFeeLimit(myContract.getAddress(), ...);

const sponsoringEnabledAfter = await contractHelpers.sponsoringEnabled(
  myContract.getAddress()
);
console.log("Sponsoring enabled now:", sponsoringEnabledAfter);
```

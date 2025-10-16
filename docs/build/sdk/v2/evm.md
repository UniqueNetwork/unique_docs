# Introduction to Smart Contracts

Unique Network supports EVM smart contracts, allowing you to interact with them using the SDK and Substrate accounts. This guide shows you how to call smart contracts from the SDK.

For comprehensive EVM documentation, including account mirroring, writing contracts, and advanced features, see the [EVM section](../../evm/index.md).

## How does it work

There is one question may appear at this moment:

EVM does not understand the Substrate address format – so what address will be `msg.sender`?

Unique provides an account mirroring mechanism to make it possible to call EVM smart contracts. Learn about it in the [EVM section](../../evm/accounts.md)

## Code examples

To call the contract, use `evm.send`:

```ts
// We assume you already know how to initialize SDK at this point
const sdk = UniqueChain(sdkConfig);

// Define an ABI object or import one from artifacts
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractAddress = "0x123...";
const recipient = "0x456...";

const { extrinsicOutput } = await sdk.evm.send({
  contract: {
    abi,
    address: contractAddress,
  },
  functionName: "transfer",
  functionArgs: [recipient, 20],
});
```
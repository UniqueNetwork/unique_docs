# EVM and Smart Contracts

Unique Network supports EVM tools and provides interfaces for native Collections and NFTs. In this article, you will learn how to interact with smart contracts using Unique SDK and Substrate accounts.

Learn [EVM section](../../evm/index.md) to better understand how EVM and substrate work together.

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
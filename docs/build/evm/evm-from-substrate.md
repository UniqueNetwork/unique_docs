# EVM from Substrate

In the previous article, we learned how substrate accounts could withdraw tokens from their mirror.

Now, let's learn how substrate accounts can call Solidity contracts. If you create a Solidity smart contract, how should it be made available for those who use Substrate accounts?

Long story short – use `api.tx.evm.call` extrinsic. Here is how to do it with Unique SDK:

```ts
import { Sdk, CHAIN_CONFIG } from "@unique-nft/sdk/full";
import { Sr25519Account } from "@unique-nft/sr25519";

const mnemonicOwner = "set your mnemonic phrase ...";

const account = Sr25519Account.fromUri(mnemonicOwner);
account.signer;

const sdk = new Sdk({
  baseUrl: CHAIN_CONFIG.opal.restUrl,
  account,
});

const erc20abi = [ /* ERC-20 contract's ABI */ ];

// Calling ERC-20 transfer method
const evmTxResult = await sdk.evm.send({
  funcName: "transfer",
  args: ["0xd79Ba776c7C99C4C0B6926386a472680B120E344", 100],
  abi: erc20abi,
  contractAddress: "0x0eC2A5af4460025fe9de8647aD362f267A276fc2",
});

// Get EVM events
const evmEvents = evmTxResult.parsed?.parsedEvents;
```

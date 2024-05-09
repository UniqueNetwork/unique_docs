# Re-Fungible

A re-fungible token (RFT) is essentially a non-fungible token (NFT) with a unique ability: partial ownership. 

Creating an RFT collection is similar to creating an NFT collection.

Here is a quick demo of how to work with RFT.

```ts
// Use @unique-nft/sdk/full:
import { Sdk, CHAIN_CONFIG } from "@unique-nft/sdk/full";
import { Sr25519Account } from "@unique-nft/sr25519";

// const mnemonicOwner = "your secret mnemonic here ...";
// const mnemonicReceiver = "your secret mnemonic here ...";

const owner = Sr25519Account.fromUri(mnemonicOwner);
const receiver = Sr25519Account.fromUri(mnemonicReceiver);

const sdk = new Sdk({
  baseUrl: CHAIN_CONFIG.opal.restUrl,
  account: owner,
});

// Create RFT-collection
// Set schema in the same way as for NFT tokens
const rftCollectionTxResult = await sdk.refungible.createCollection({
  mode: "ReFungible",
  name: "RFT",
  description: "Re-Fungible collection",
  tokenPrefix: "RFT",
  // Set schema and permissions
  // schema: {...}
  // tokenPropertyPermissions: {...}
});

const collectionId = rftCollectionTxResult.parsed!.collectionId;
console.log("RFT collection id", collectionId);

// Create new RFT
const rftTxResult = await sdk.refungible.createToken({
  collectionId,
  amount: 10, // This token will have 10 pieces
  // Set token data:
  // data: {...}
});
const rft = rftTxResult.parsed!;

// Check total pieces for rft
const totalPieces = await sdk.refungible.totalPieces(rft);
console.log("Total pieces:", totalPieces.amount);

// Send 6 pieces to "receiver"
await sdk.refungible.transferToken({
  collectionId,
  tokenId: rft.tokenId,
  to: receiver.address,
  amount: 6,
});

// Receiver's balance is 6/10. Another 4 pieces are owned by "owner"
const { amount } = await sdk.refungible.getBalance({
  ...rft,
  address: receiver.address,
});
console.log("receiver's balance", amount);

// owner burns his 4 pieces
await sdk.refungible.burn({
  ...rft,
  amount: 4,
});

// total pieces is 6
const totalPiecesAfterBurn = await sdk.refungible.totalPieces(rft);
console.log("Total pieces after burn:", totalPiecesAfterBurn.amount);

// Because "receiver" collects all the pieces it can perform repartition
await sdk.refungible.repartitionToken(
  { ...rft, amount: 1, address: receiver.address },
  { signer: receiver.signer },
);

// total pieces is 1
const totalPiecesAfterRepartition = await sdk.refungible.totalPieces(rft);
console.log(
  "Total pieces after repartition:",
  totalPiecesAfterRepartition.amount,
);
```
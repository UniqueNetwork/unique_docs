# Transaction sponsoring

In Unique Network, transactions can be sponsored, allowing for a gasless experience where the sponsor covers the transaction fees. This enables seamless and cost-free transfers of NFTs and the execution of smart contracts, even for accounts without native tokens.

[[toc]]

## Collection sponsoring

<!-- TODO describe more options: allow lists, gasless minting and -->
<!-- ### Non-Limited Sponsorship

First, we will overview unrestricted gasless transactions, in which the sponsor covers the transaction fees for all transfers within the collection. -->

Let's start with a full code example and then break it down.

```ts
import { Sdk, CHAIN_CONFIG } from "@unique-nft/sdk/full";
import { Sr25519Account } from "@unique-nft/sdk/sr25519";

const main = async () => {
  // 0. Initialize accounts
  // Set up sponsor and empty accounts
  const sponsorMnemonic = "...";
  const sponsor = Sr25519Account.fromUri(sponsorMnemonic);
  const emptyAccount = Sr25519Account.fromUri(
    Sr25519Account.generateMnemonic(),
  );

  // 0.1. Initialize SDK with sponsor
  // Set SDK with sponsor as default signer
  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.opal.restUrl,
    account: sponsor,
  });

  // 1. Sponsor creates a collection
  // Create a new collection by sponsor
  const collectionResponse = await sdk.collection.create({
    name: "Sponsored",
    description: "This collection is sponsored",
    tokenPrefix: "SC",
  });

  const { collectionId } = collectionResponse.parsed!;

  // 2. Create NFT
  // Create an NFT in the collection
  console.log("Creating NFT");
  const nftResponse = await sdk.token.create({ collectionId });

  const nft = nftResponse.parsed!;

  // 3. Set sponsorship for the collection
  // Make transactions for the collection gasless

  // 3.1. Set sponsor address
  // Set sponsor address for collection transactions
  await sdk.collection.setSponsorship({
    collectionId,
    newSponsor: sponsor.address,
  });

  // 3.2. Confirm sponsorship
  // Sponsor confirms sponsorship
  await sdk.collection.confirmSponsorship({ collectionId });

  // 3.3. Set sponsorship limits
  // Set limits for sponsorship; sponsor all transfers
  await sdk.collection.setLimits({
    collectionId,
    limits: { sponsorTransferTimeout: 0 },
  });

  // 4. Test sponsorship
  // Test the sponsorship functionality

  // 4.1. Sponsor transfers NFT to emptyAccount
  // Sponsor transfers NFT to empty account
  await sdk.token.transfer({ ...nft, to: emptyAccount.address });

  {
    // 4.2. Check new owner
    // Verify the empty account owns the NFT
    const { owner } = await sdk.token.owner(nft);
    if (owner !== emptyAccount.address)
      throw Error("Empty account is not the owner of NFT");
  }

  // 4.3. Empty account transfers token
  // Empty account transfers NFT, gas paid by sponsor
  const { fee } = await sdk.token.transfer(
    { ...nft, to: sponsor.address, address: emptyAccount.address },
    { signer: emptyAccount.signer },
  );
  console.log("Gasless transfer fee:", fee?.raw);

  // 4.4. Check NFT owner is sponsor again
  // Verify sponsor owns the NFT again
  console.log("Check NFT owner is sponsor again");
  const { owner } = await sdk.token.owner(nft);
  if (owner !== sponsor.address) throw Error("Sponsor is not the owner of NFT");
};

main();
```

#### 0. Initialize Accounts and SDK

Start by setting up the necessary accounts. The sponsor account must have a balance of native tokens to cover transaction fees, while the empty account will perform gasless transfers.

Initialize the SDK with the sponsor account set as the default signer.

```ts
// 0. Initialize accounts
// Set up sponsor and empty accounts
const sponsorMnemonic = "...";
const sponsor = Sr25519Account.fromUri(sponsorMnemonic);
const emptyAccount = Sr25519Account.fromUri(
  Sr25519Account.generateMnemonic(),
);

// 0.1. Initialize SDK with sponsor
// Set SDK with sponsor as default signer
const sdk = new Sdk({
  baseUrl: CHAIN_CONFIG.opal.restUrl,
  account: sponsor,
});
```

#### 1. Create Collection and NFT

The sponsor creates a new NFT collection and a token on its own address.

```ts
// 1. Sponsor creates a collection
// Create a new collection by sponsor
const collectionResponse = await sdk.collection.create({
  name: "Sponsored",
  description: "This collection is sponsored",
  tokenPrefix: "SC",
});

const { collectionId } = collectionResponse.parsed!;

// 2. Create NFT
// Create an NFT in the collection
console.log("Creating NFT");
const nftResponse = await sdk.token.create({ collectionId });

const nft = nftResponse.parsed!;
```

#### 2. Set Sponsorship for the Collection

Configure the collection to allow gasless transactions, meaning the `sponsor` will cover the transaction fees.

```ts
// 3. Set sponsorship for the collection
// Make transactions for the collection gasless

// 3.1. Set sponsor address
// Set sponsor address for collection transactions
await sdk.collection.setSponsorship({
  collectionId,
  newSponsor: sponsor.address,
});
```

Now the sponsor we set on a previous step should confirms their sponsorship for the collection.

```ts
  // 3.2. Confirm sponsorship
  // Sponsor confirms sponsorship
  await sdk.collection.confirmSponsorship({ collectionId });
```

By default, there is a cooldown period of five blocks between transactions. During this period, transaction fees are withdrawn from transaction signers as usual.

Let's define the limits for sponsorship to ensure the sponsor covers the fees for all transfers within the collection.

```ts
// 3.3. Set sponsorship limits
// Set limits for sponsorship; sponsor all transfers
await sdk.collection.setLimits({
  collectionId,
  limits: { sponsorTransferTimeout: 0 },
});
```

#### 3. Test sponsorship

Now let's test it. Send the previously created NFT to the empty account. After that, the empty account will send the NFT back even though it does not have any native tokens. The transaction fees will be withdrawn from the sponsor's balance.

```ts
// 4. Test sponsorship
// Test the sponsorship functionality

// 4.1. Sponsor transfers NFT to emptyAccount
// Sponsor transfers NFT to empty account
await sdk.token.transfer({ ...nft, to: emptyAccount.address });

{
  // 4.2. Check new owner
  // Verify the empty account owns the NFT
  const { owner } = await sdk.token.owner(nft);
  if (owner !== emptyAccount.address)
    throw Error("Empty account is not the owner of NFT");
}

// 4.3. Empty account transfers token
// Empty account transfers NFT, gas paid by sponsor
const { fee } = await sdk.token.transfer(
  { ...nft, to: sponsor.address, address: emptyAccount.address },
  { signer: emptyAccount.signer },
);
console.log("Gasless transfer fee:", fee?.raw);

// 4.4. Check NFT owner is sponsor again
// Verify sponsor owns the NFT again
console.log("Check NFT owner is sponsor again");
const { owner } = await sdk.token.owner(nft);
if (owner !== sponsor.address) throw Error("Sponsor is not the owner of NFT");
```

## Contract sponsoring

Review the [EVM section](/build/evm/smart-contracts/index.md) for contract sponsorship details.
# Collection sponsoring

In Unique Network, transactions can be sponsored, allowing for a gasless experience where the sponsor covers the transaction fees. This enables seamless and cost-free transfers of NFTs and the execution of smart contracts, even for accounts without native tokens.

[[toc]]

## What is sponsoring?

Sponsoring allows one account (the sponsor) to pay transaction fees on behalf of other users. This creates a gasless user experience where token holders can transfer NFTs, mint tokens, or interact with smart contracts without needing native blockchain tokens (OPL/UNQ).

**Key benefits:**

- **Onboarding**: New users can interact with your collection without first acquiring native tokens
- **User experience**: Seamless interactions without transaction fee friction
- **Business models**: Enable free-to-use applications while controlling costs through rate limits

## Prerequisite

Follow the [Getting started guide](./quick-start.md) to install required libraries, receive test network OPL tokens, and initialize SDK.

At this point, you need to know how to manage collections. Learn how to do this in the [Working with collections](./collections.md) guide.

You also need to know how to [mint and transfer NFTs](./tokens.md).

## Setting collection sponsoring

Enabling sponsorship requires two steps to ensure both parties (collection owner and sponsor) agree to the arrangement:

### Step 1: Set sponsor

The collection owner or admin designates an account as the sponsor:

```ts:no-line-numbers
// Only collection owner or admin can call this
const result = await sdk.collection.setSponsor({
  collectionId: 1,
  sponsor: sponsorAccount.address
});

console.log(result.result.sponsorship);
// {
//   isEnabled: true,
//   isConfirmed: false,
//   sponsor: "sponsor_address"
// }
```

At this point, sponsorship is **enabled but not confirmed**. No transactions will be sponsored yet.

### Step 2: Confirm sponsorship

The designated sponsor must confirm their willingness to sponsor the collection:

```ts:no-line-numbers
// The sponsor account must call this
const result = await sdk.collection.confirmSponsorship(
  { collectionId: 1 },
  { signerAddress: sponsorAccount.address },
  sponsorAccount
);

console.log(result.result.sponsorship);
// {
//   isEnabled: true,
//   isConfirmed: true,
//   sponsor: "sponsor_address"
// }
```

::: tip
The two-step process prevents malicious actors from forcing unwanted sponsorship obligations onto accounts without their consent.
:::

### What gets sponsored?

Once confirmed, the sponsor pays fees for:

- Token transfers
- Token minting
- Token approvals
- Other collection-specific transactions (subject to rate limits)

The sponsor does **not** pay for:

- Collection management operations (setting properties, adding admins, etc.)
- Operations performed by the collection owner or admins

## Setting limits

Sponsorship limits protect the sponsor from abuse by rate-limiting sponsored transactions. You can set these limits during collection creation or modify them later.

### During collection creation

```ts:no-line-numbers
await sdk.collection.create({
  name: "Test",
  description: "Test collection",
  symbol: "TST",
  limits: {
    sponsorApproveTimeout: 100,       // Blocks between sponsored approvals
    sponsoredDataRateLimit: 100,      // Blocks between sponsored metadata updates
    sponsoredDataSize: 2048,          // Max bytes of sponsored custom data
    sponsorTransferTimeout: 0,        // Blocks between sponsored transfers/mints
  },
});
```

### Modifying limits on existing collection

```ts:no-line-numbers
await sdk.collection.setLimits({
  collectionId: 1,
  limits: {
    sponsorApproveTimeout: 0,      // 0 = no timeout, sponsor every approval
    sponsorTransferTimeout: 0,     // 0 = no timeout, sponsor every transfer
    sponsoredDataSize: 4096,       // Increase sponsored data size
  },
});
```

### Limit details

**`sponsorTransferTimeout`** - Minimum number of blocks between sponsored transfers or mint transactions for a single user.

- `0` = No limit, sponsor every transaction
- `100` = User can make one sponsored transfer/mint every 100 blocks (~10 minutes on Unique Network)

**`sponsorApproveTimeout`** - Minimum number of blocks between sponsored approve transactions for a single user.

- `0` = No limit, sponsor every approval
- `50` = User can make one sponsored approval every 50 blocks (~5 minutes)

**`sponsoredDataSize`** - Maximum byte size of custom token data that can be sponsored when tokens are minted.

- Limits the size of `data` field in token minting to prevent large sponsored transactions
- Default: `2048` bytes

**`sponsoredDataRateLimit`** - Minimum number of blocks between sponsored metadata update transactions.

- Controls how often users can update token metadata with sponsorship
- Can be set to `'SponsoringDisabled'` to disable metadata sponsoring entirely

::: warning Important
Rate limits apply **per user**, not globally. If you have 1000 active users, they can all make sponsored transactions simultaneously (subject to their individual timeouts).
:::

## Complete example: Gasless transfers

Let's create a complete example demonstrating how an account without native tokens can transfer NFTs using sponsorship:

```ts:no-line-numbers
import { Sr25519Account } from '@unique-nft/accounts/sr25519';
import { UniqueChain } from '@unique-nft/sdk/full';

// Initialize SDK with sponsor account
const sponsorAccount = await Sr25519Account.fromUri('//Alice');
const sdk = UniqueChain({
  baseUrl: 'https://rest.unique.network/opal/v1',
  account: sponsorAccount
});

// Step 1: Create collection with sponsorship enabled
const { result: { collectionId } } = await sdk.collection.create({
  name: "Sponsored Collection",
  description: "Users can transfer without fees",
  symbol: "SPON",
  limits: {
    sponsorTransferTimeout: 0,    // No timeout - sponsor all transfers
    sponsorApproveTimeout: 0,     // No timeout - sponsor all approvals
  },
});

// Step 2: Set up sponsorship
await sdk.collection.setSponsor({
  collectionId,
  sponsor: sponsorAccount.address
});

await sdk.collection.confirmSponsorship({ collectionId });

// Step 3: Generate a new account without any native tokens
const emptyAccount = await Sr25519Account.fromUri(
  Sr25519Account.generateMnemonic()
);

console.log('Empty account has 0 OPL tokens');

// Step 4: Mint token to the empty account
const { result: [token] } = await sdk.token.mintNFTs({
  collectionId,
  tokens: [{ owner: emptyAccount.address }]
});

// Step 5: Empty account transfers token (sponsor pays fees!)
await sdk.token.transfer(
  {
    to: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    collectionId,
    tokenId: token.tokenId,
  },
  { signerAddress: emptyAccount.address },
  emptyAccount,
);

console.log('Transfer successful! Sponsor paid the fee.');

// Verify the transfer
const updatedToken = await sdk.token.get({
  collectionId,
  tokenId: token.tokenId,
});

console.log('New owner:', updatedToken.owner);
```

## Checking sponsorship status

You can query the current sponsorship state at any time:

```ts:no-line-numbers
const collection = await sdk.collection.get({ collectionId: 1 });

console.log(collection.sponsorship);
// {
//   isEnabled: boolean,
//   isConfirmed: boolean,
//   sponsor: string | null
// }

if (collection.sponsorship.isConfirmed) {
  console.log(`✓ Sponsorship active`);
  console.log(`  Sponsor: ${collection.sponsorship.sponsor}`);
} else if (collection.sponsorship.isEnabled) {
  console.log(`⏳ Sponsorship pending confirmation`);
  console.log(`  Proposed sponsor: ${collection.sponsorship.sponsor}`);
} else {
  console.log(`✗ No sponsorship`);
}
```

## Removing sponsorship

To remove sponsorship from a collection, set the sponsor to `null`:

```ts:no-line-numbers
// Collection owner or admin can remove sponsorship
await sdk.collection.setSponsor({
  collectionId: 1,
  sponsor: null
});

// Verify sponsorship is removed
const collection = await sdk.collection.get({ collectionId: 1 });
console.log(collection.sponsorship);
// { isEnabled: false, isConfirmed: false, sponsor: null }
```

## Best practices

### 1. Set appropriate rate limits

```ts:no-line-numbers
// Too permissive - can drain sponsor quickly
limits: {
  sponsorTransferTimeout: 0,  // ❌ No limit
}

// Reasonable - protects sponsor from spam
limits: {
  sponsorTransferTimeout: 50,  // ✓ One transfer per ~5 minutes per user
}
```

### 2. Monitor sponsor balance

```ts:no-line-numbers
const { availableBalance } = await sdk.balance.get({
  address: sponsorAccount.address
});

const minBalance = 100_000_000_000_000n; // 100 OPL minimum

if (BigInt(availableBalance.amount) < minBalance) {
  console.warn('⚠️  Sponsor balance low! Top up soon.');
  // Consider removing sponsorship or notifying admin
}
```

# Advanced SDK Usage

This guide covers advanced SDK features and patterns for building sophisticated blockchain applications.

[[toc]]

## Overview

Every extrinsic method in the SDK provides multiple ways to interact with the blockchain:

- **Direct execution**: Simple one-call transaction submission
- **Manual workflow**: Step-by-step control over build → sign → submit → status
- **Fee estimation**: Calculate transaction costs before execution
- **Batch operations**: Execute multiple transactions atomically
- **Custom options**: Fine-tune transaction parameters and confirmation behavior

## Extrinsic methods

All extrinsic methods (like `balance.transfer`, `collection.create`, `token.mint`, etc.) share the same underlying API structure. This section uses `balance.transfer` as an example, but the patterns apply to all extrinsics.

### Direct execution (default)

The simplest way to execute a transaction:

```ts:no-line-numbers
const { result, extrinsicOutput } = await unique.balance.transfer({
  amount: '100',
  to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});

console.log('Transfer result:', result);
console.log('Transaction hash:', extrinsicOutput.hash);
console.log('Block hash:', extrinsicOutput.blockHash);
```

This method:

1. Builds the transaction
2. Signs it with your account
3. Submits to the network
4. Waits for confirmation
5. Returns the result and transaction details

### Manual workflow

For advanced control, you can handle each step separately:

#### 1. Build

Build an unsigned transaction payload:

```ts:no-line-numbers
const unsignedTx = await unique.balance.transfer.build({
  amount: '100',
  to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});
```

#### 2. Sign

Sign the transaction with your account:

```ts:no-line-numbers
const signature = await unique.balance.transfer.sign(unsignedTx);
// Returns: "0x..." (hex signature)
```

You can also use a different account:

```ts:no-line-numbers
const signature = await unique.balance.transfer.sign(unsignedTx, customAccount);
```

#### 3. Submit

Submit the signed transaction to the network:

```ts:no-line-numbers
const txHash = await unique.balance.transfer.submit(unsignedTx, signature);
// Returns: "0x..." (transaction hash)
```

#### 4. Get status

Wait for and retrieve the transaction result:

```ts:no-line-numbers
const { result, extrinsicOutput } = await unique.balance.transfer.getStatus(
  '/balances/transfer', // route - each method has its own route
  txHash
);
```

#### Complete example

```ts:no-line-numbers
// Step-by-step transaction workflow
const unsignedTx = await unique.balance.transfer.build({
  amount: '100',
  to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});

const signature = await unique.balance.transfer.sign(unsignedTx);
const txHash = await unique.balance.transfer.submit(unsignedTx, signature);

const { result, extrinsicOutput } = await unique.balance.transfer.getStatus(
  '/balances/transfer',
  txHash
);

console.log('Transfer completed:', result);
console.log('Block number:', extrinsicOutput.blockNumber);
```

### Encode

Encode transaction parameters into a compact extrinsic format (used for batch operations):

```ts:no-line-numbers
const encoded = await unique.balance.transfer.encode({
  amount: '100',
  to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});

console.log(encoded.compactExtrinsic); // "0x..."
```

This method is primarily used for creating batches (see [Batch operations](#batch-operations) below).

### Fee estimation

Calculate transaction fees before execution:

```ts:no-line-numbers
const fees = await unique.balance.transfer.fee({
  amount: '100',
  to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});

console.log(fees);
```

Returns:

```ts:no-line-numbers
{
  baseFee: '124000000',           // Base transaction fee
  lenFee: '0',                     // Length-based fee component
  adjustedWeightFee: '124000000', // Weight-based fee component
  totalFee: '124000000',          // Total fee in wei
  xcmFee: '0'                     // Cross-chain messaging fee (if applicable)
}
```

## Build options

Customize how transactions are built:

```ts:no-line-numbers
await unique.balance.transfer(
  {
    amount: '100',
    to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  },
  {
    signerAddress: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    nonce: 5,
    mortalLength: 64
  }
);
```

### signerAddress

Override the default account used for signing:

```ts:no-line-numbers
// Use a different account than the one configured in SDK
const result = await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  { signerAddress: customAccount.address }
);
```

### nonce

Manually specify the transaction nonce. Useful for:

- Parallel transaction submission
- Replacing pending transactions
- Advanced queue management

```ts:no-line-numbers
const currentNonce = await unique.account.nextIndex({
  address: account.address
});

// Submit multiple transactions with sequential nonces
await Promise.all([
  unique.balance.transfer(
    { amount: '100', to: address1 },
    { nonce: currentNonce }
  ),
  unique.balance.transfer(
    { amount: '200', to: address2 },
    { nonce: currentNonce + 1 }
  ),
  unique.balance.transfer(
    { amount: '300', to: address3 },
    { nonce: currentNonce + 2 }
  )
]);
```

### mortalLength

Control transaction validity period:

```ts:no-line-numbers
// Transaction valid for 64 blocks
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  { mortalLength: 64 }
);

// Immortal transaction (valid indefinitely)
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  { mortalLength: -1 }
);

// Default mortal period
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  { mortalLength: 0 }
);
```

**Values:**

- **Positive number**: Transaction valid for N blocks from current block
- **0**: Use chain default mortal period
- **-1**: Immortal transaction (never expires)

::: warning
Immortal transactions can be replayed indefinitely if not included in a block. Use with caution.
:::

## Status options

Control how the SDK waits for transaction confirmation:

```ts:no-line-numbers
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  undefined, // buildOptions
  undefined, // account override
  {
    retries: 20,
    timeout: 5000,
    isFinalized: true
  }
);
```

### retries

Maximum number of attempts to fetch transaction status:

```ts:no-line-numbers
// Check status up to 30 times
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  undefined,
  undefined,
  { retries: 30 }
);
```

**Default**: 15 retries

### timeout

Delay in milliseconds between status check attempts:

```ts:no-line-numbers
// Wait 10 seconds between each check
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  undefined,
  undefined,
  { timeout: 10000 }
);
```

**Default**: 3000ms (3 seconds)

### isFinalized

Wait for finalized block confirmation instead of just block inclusion:

```ts:no-line-numbers
// Wait for finalized confirmation (more secure)
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  undefined,
  undefined,
  { isFinalized: true }
);
```

**Default**: false (wait for inclusion in a block)

::: tip
For high-value transactions or when finality is critical, use `isFinalized: true`.
:::

### Global status options

You can set default status options when initializing the SDK:

```ts:no-line-numbers
import { UniqueChain } from '@unique-nft/sdk/full';

const unique = UniqueChain({
  baseUrl: 'https://rest.unique.network/opal/v1',
  statusOptions: {
    retries: 30,
    timeout: 5000,
    isFinalized: true
  }
});

// All transactions will use these defaults
await unique.balance.transfer({ amount: '100', to: recipientAddress });

// You can still override per-transaction
await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  undefined,
  undefined,
  { isFinalized: false } // Override global setting
);
```

## Batch operations

Execute multiple transactions atomically using `utility.batchAll()`. If any transaction fails, the entire batch is reverted.

### Basic batch

```ts:no-line-numbers
// Encode multiple operations
const operations = [
  unique.balance.transfer.encode({
    amount: '100',
    to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  }),
  unique.balance.transfer.encode({
    amount: '200',
    to: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }),
  unique.balance.transfer.encode({
    amount: '300',
    to: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy"
  })
];

// Execute all operations in a single transaction
const { result, extrinsicOutput } = await unique.utility.batchAll(operations);

console.log('Batch successful:', result.isSuccess);
console.log('Number of operations:', result.calls.length);
console.log('Transaction hash:', extrinsicOutput.hash);
```

## Account override

Override the signing account for a specific transaction:

```ts:no-line-numbers
import { KeyringProvider } from '@unique-nft/accounts/keyring';

// Initialize SDK with default account
const defaultAccount = await KeyringProvider.fromMnemonic(defaultMnemonic);
const unique = UniqueChain({
  baseUrl: 'https://rest.unique.network/opal/v1',
  account: defaultAccount
});

// Use a different account for a specific transaction
const customAccount = await KeyringProvider.fromMnemonic(customMnemonic);

await unique.balance.transfer(
  { amount: '100', to: recipientAddress },
  { signerAddress: customAccount.address }, // Specify address in build options
  customAccount // Provide account for signing
);
```

## Practical examples

### Parallel transaction submission

```ts:no-line-numbers
async function sendToMultipleRecipientsParallel() {
  // Get current nonce
  const currentNonce = await unique.account.nextIndex({
    address: account.address
  });

  const recipients = [
    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy'
  ];

  // Submit all transactions in parallel with sequential nonces
  const results = await Promise.all(
    recipients.map((address, index) =>
      unique.balance.transfer(
        { amount: '100', to: address },
        { nonce: currentNonce + index }
      )
    )
  );

  console.log(`Sent ${results.length} transfers`);
  results.forEach((result, index) => {
    console.log(`Transfer ${index + 1}:`, result.extrinsicOutput.hash);
  });
}
```

### Custom signing workflow (external wallet)

```ts:no-line-numbers
async function signWithExternalWallet() {
  // 1. Build transaction
  const unsignedTx = await unique.balance.transfer.build(
    { amount: '100', to: recipientAddress },
    { signerAddress: externalWalletAddress }
  );

  // 2. Get user to sign with their external wallet
  // (e.g., browser extension, hardware wallet)
  const signature = await externalWallet.signPayload(
    unsignedTx.signerPayloadJSON
  );

  // 3. Submit the signed transaction
  const txHash = await unique.balance.transfer.submit(
    unsignedTx,
    signature
  );

  // 4. Wait for confirmation
  const { result, extrinsicOutput } = await unique.balance.transfer.getStatus(
    '/balances/transfer',
    txHash,
    { isFinalized: true }
  );

  return result;
}
```

## Best practices

### Batch when possible

Instead of:

```ts:no-line-numbers
// Inefficient - multiple transactions
for (const recipient of recipients) {
  await unique.balance.transfer({ amount: '100', to: recipient });
}
```

Use:

```ts:no-line-numbers
// Efficient - single atomic transaction
const batch = recipients.map(recipient =>
  unique.balance.transfer.encode({ amount: '100', to: recipient })
);
await unique.utility.batchAll(batch);
```

### Estimate fees for user confirmation

```ts:no-line-numbers
// Show user estimated fees before execution
const fees = await unique.collection.create.fee({
  name: 'My Collection',
  description: 'Description',
  symbol: 'COL',
  mode: 'Nft'
});

const { decimals } = await unique.balance.get({ address: account.address });
const feeInCoins = Number(fees.totalFee) / Math.pow(10, decimals);

// Show confirmation dialog
const confirmed = await showConfirmation(
  `This operation will cost approximately ${feeInCoins} OPL. Continue?`
);

if (confirmed) {
  await unique.collection.create({ ... });
}
```

### Handle nonce management

```ts:no-line-numbers
// Good - let SDK manage nonce
await unique.balance.transfer({ amount: '100', to: address });

// Advanced - manual nonce for parallel submissions
const nonce = await unique.account.nextIndex({ address: account.address });
await Promise.all([
  unique.balance.transfer({ amount: '100', to: address1 }, { nonce }),
  unique.balance.transfer({ amount: '200', to: address2 }, { nonce: nonce + 1 })
]);
```

### Error handling

```ts:no-line-numbers
try {
  const result = await unique.balance.transfer(
    { amount: '100', to: recipientAddress },
    undefined,
    undefined,
    {
      retries: 30,
      timeout: 5000,
      isFinalized: true
    }
  );
  console.log('Success:', result);
} catch (error) {
  if (error.message.includes('Extrinsic not found')) {
    console.error('Transaction timeout - network might be congested');
  } else if (error.message.includes('balance too low')) {
    console.error('Insufficient balance');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

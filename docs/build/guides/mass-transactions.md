# Parallel and Batch Transactions

When a single account needs to send multiple transactions, the most straightforward approach is to send the transactions sequentially.

```ts:no-line-numbers
const token1 = await sdk.token.create({collectionId}, {signer: alice.address});
const token2 = await sdk.token.create({collectionId}, {signer: alice.address});
```

In the example above, Alice needs to create two tokens. First, token #1 is created—the SDK waits for the transaction to complete successfully before proceeding to create token #2.

This approach has several drawbacks:

- Extended execution time: Completing and finalizing each transaction requires several blocks. Consequently, even a small number of transactions can take several minutes.
- Asynchronous execution challenges: In scenarios where transactions are triggered by user actions, transactions might need to be executed simultaneously.

### What happens when transactions from a single account are executed simultaneously?

A seemingly obvious, yet incorrect approach:

```ts:no-line-numbers
const [token1, token2] = await Promise.all([
  sdk.token.create({ collectionId }),
  sdk.token.create({ collectionId }),
]);
```

With this code, only one transaction will succeed, while the second will fail with the following error:

```sh:no-line-numbers
1014: Priority is too low: (18446744073709551615 vs 18446744073709551615): The transaction has too low priority to replace another transaction already in the pool
```

### Transaction Nonce

The `Priority is too low` error occurs because both transactions are sent with the same nonce.

:::tip
In blockchain networks, particularly in transaction validation, a nonce serves several critical purposes:

Preventing Replay Attacks: By ensuring that each transaction has a unique nonce, the system prevents attackers from reusing a previously valid transaction to deceive the network.
Ensuring Transaction Uniqueness and Order: Nonces ensure that each transaction is unique and help maintain the correct sequence of transactions, preserving the integrity and order of the blockchain.
:::

Each account in the network maintains a nonce. The nonce value in a transaction increments by 1 upon the transaction's execution, regardless of whether the transaction succeeds or fails. If a transaction is executed without specifying a nonce, it will be requested before signing the transaction. In the above example, since both transactions are executed almost simultaneously, the network doesn't have time to increment the nonce, resulting in both transactions being sent with the same nonce.

The solution to this problem is to explicitly specify the nonce for each transaction. In the example below, the transactions will be executed successfully and are likely to be included in the same block.

```ts:no-line-numbers
// request nonce before transactions ...
let { nonce } = await sdk.common.getNonce(owner);

// ... increment it for each call
const [token1, token2, ...other] = await Promise.all([
  sdk.token.create({ collectionId }, { nonce: nonce++ }),
  sdk.token.create({ collectionId }, { nonce: nonce++ }),
  // ...
]);
```

:::tip Why doesn't the SDK handle the nonce automatically?

There is no universally reliable way to manage the nonce implicitly. Such attempts can lead to unintended consequences and still may not fully resolve the issue.
:::

### Alternative methods

In some cases, the aforementioned method might not be suitable. An example is when a transaction is triggered by a user's action in a web interface.

If acting on behalf of users, you could store the nonce in a database and use an atomic database operation to manage the nonce. It is crucial to understand that desynchronization will inevitably lead to errors. There should be no other source of transaction signing outside the application.

Another potentially more reliable method than storing the nonce is to queue the required actions and execute transactions using the previously described method.

## Transaction Batching

Batching allows you to execute multiple operations in a single atomic transaction using `utility.batchAll()`. This approach is fundamentally different from parallel nonce-based execution and has distinct advantages and trade-offs.

### How batching works

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
  })
];

// Execute all operations in a single transaction
const { result, extrinsicOutput } = await unique.utility.batchAll(operations);
```

### Parallel execution vs Batching: When to use each

#### Use parallel execution with nonces when:

**1. You need partial success handling**

With parallel execution, each transaction is independent. If one fails, others can still succeed.

```ts:no-line-numbers
// Some transfers might succeed even if others fail
const results = await Promise.allSettled([
  unique.balance.transfer({ amount: '100', to: addr1 }, { nonce: n }),
  unique.balance.transfer({ amount: '200', to: addr2 }, { nonce: n + 1 }),
  unique.balance.transfer({ amount: '300', to: addr3 }, { nonce: n + 2 })
]);

// Handle successes and failures separately
results.forEach((result, i) => {
  if (result.status === 'fulfilled') {
    console.log(`Transfer ${i} succeeded`);
  } else {
    console.log(`Transfer ${i} failed:`, result.reason);
  }
});
```

**2. Operations are logically independent**

When operations don't need to be atomic (e.g., sending notifications, distributing rewards to different users where partial completion is acceptable).

**3. Maximum throughput is critical**

Parallel execution can potentially complete faster as transactions may be included in different blocks.

**4. You're dealing with very large numbers of operations**

Batches have size limits. For hundreds or thousands of operations, parallel execution with nonce management might be necessary.

#### Use batching when:

**1. Atomicity is required**

All operations must succeed or fail together. This is critical for:

- Multi-step NFT operations (create collection + mint tokens)
- Financial operations requiring consistency
- Setting up related configuration changes

```ts:no-line-numbers
// Either collection is created AND tokens are minted, or nothing happens
const batch = [
  unique.collection.create.encode({
    name: 'My Collection',
    description: 'Collection with initial tokens',
    symbol: 'COL',
    mode: 'Nft'
  }),
  // If collection creation fails, minting won't happen
  unique.token.mintNFTs.encode({
    collectionId: collectionId,
    tokens: [{ owner: account.address }]
  })
];

await unique.utility.batchAll(batch);
```

**2. Simpler error handling**

With batching, you have one transaction to monitor instead of tracking multiple parallel transactions:

```ts:no-line-numbers
try {
  const { result } = await unique.utility.batchAll(operations);
  if (result.isSuccess) {
    console.log('All operations completed successfully');
  }
} catch (error) {
  console.error('Batch failed, all operations reverted');
}
```

**3. You need guaranteed execution order**

Batch operations execute in the exact order specified, which is guaranteed within the same transaction.

**4. Avoiding nonce management complexity**

Batching requires only one nonce (automatically managed), eliminating the complexity of manual nonce tracking.

**Use batching when:**

- Operations must be atomic (all succeed or all fail)
- You want to minimize fees
- You want simpler code without nonce management
- Operations are related and should execute together
- Order of execution matters

**Use parallel execution with nonces when:**

- Partial success is acceptable or desired
- Operations are independent
- You need maximum throughput
- You're dealing with very large operation counts (>100)
- You need fine-grained control over each transaction

**Hybrid approach:**

Sometimes combining both strategies is optimal:

```ts:no-line-numbers
// Create multiple batches and execute them in parallel
const batchSize = 50;
const batches = [];

for (let i = 0; i < allOperations.length; i += batchSize) {
  const batch = allOperations.slice(i, i + batchSize).map(op =>
    unique.balance.transfer.encode(op)
  );
  batches.push(batch);
}

// Get current nonce
let nonce = await unique.account.nextIndex({ address: account.address });

// Execute batches in parallel with explicit nonces
const results = await Promise.allSettled(
  batches.map((batch, index) =>
    unique.utility.batchAll(batch, { nonce: nonce + index })
  )
);

// Handle results
results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Batch ${index + 1} succeeded`);
  } else {
    console.log(`Batch ${index + 1} failed:`, result.reason);
  }
});
```

This hybrid approach gives you:

- Atomic operations within each batch
- Reduced fees compared to individual transactions
- Partial success across batches
- Parallel execution for better throughput

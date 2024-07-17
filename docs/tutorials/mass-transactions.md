# Bulk Transactions

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

> In blockchain networks, particularly in transaction validation, a nonce serves several critical purposes:
>
> Preventing Replay Attacks: By ensuring that each transaction has a unique nonce, the system prevents attackers from reusing a previously valid transaction to deceive the network.
> Ensuring Transaction Uniqueness and Order: Nonces ensure that each transaction is unique and help maintain the correct sequence of transactions, preserving the integrity and order of the blockchain.

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

> **Why doesn't the SDK handle the nonce automatically?**
> 
> There is no universally reliable way to manage the nonce implicitly. Such attempts can lead to unintended consequences and still may not fully resolve the issue.


### Alternative methods

In some cases, the aforementioned method might not be suitable. An example is when a transaction is triggered by a user's action in a web interface.

If acting on behalf of users, you could store the nonce in a database and use an atomic database operation to manage the nonce. It is crucial to understand that desynchronization will inevitably lead to errors. There should be no other source of transaction signing outside the application.

Another potentially more reliable method than storing the nonce is to queue the required actions and execute transactions using the previously described method.

<!-- TODO: ### Transactions batching
 -->
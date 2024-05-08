# Nesting

The **nesting** feature allows you to create **nested tokens**. Thus, the topmost token will have a wallet address as its owner, while the owner of tokens nested in it will be the token above it.
The entire chain of nested tokens will be called a **bundle**. If you transfer a top-level token to another owner, all tokens in the bundle will go with it.

> If you don't know how to create collections and tokens, start from [the beginning](./getting-started.md)

## Nesting permission

Nesting is not allowed by default. You need to set special permissions at the collection level during creation.

<!-- TODO create a reference article about permissions -->

```typescript
const creationResult = await sdk.collection.create.submitWaitResult({
  name: "Test collection",
  description: "My test collection",
  tokenPrefix: "TST",
  // Token owners and collection admins are allowed to nest tokens:
  permissions: {
    nesting: {
      tokenOwner: true,
      collectionAdmin: true,
      // You can set collection ids allowed for nesting:
      // restricted: [1] 
    },
  },
});
```

> Note: After a collection is created, you can change nesting permission from less to more restrictive. For example, if the collection has permission collectionAdmin: true, you can switch it to false, but not vice versa.

## Creating bundles

```typescript
async function main() {
  // ... Create collection and NFTs
  // and get their IDs (collectionId, firstTokenId, secondTokenId)


  await sdk.token.nest({
    parent: { collectionId, tokenId: firstTokenId },
    nested: { collectionId, tokenId: secondTokenId },
  });
}

main();
```

## Check if the token is bundle

- To check if the token is part of a bundle, use `isBundle`
- To get the hole bundle tree, use `getBundle`

```typescript
  const { isBundle } = await sdk.token.isBundle({
    collectionId,
    tokenId: token1Id,
  });

  console.log('token 1 isBundle?', isBundle);

  const getBundleResult = await sdk.token.getBundle({
    collectionId,
    tokenId: token1Id,
  });

  console.log('getBundleResult:', getBundleResult);
```


## Unnest

The reverse process is called unnesting, when a token no longer belongs to any token and its owner becomes the wallet address.

```typescript
const { parsed, error } = await sdk.token.unnest.submitWaitResult({
  nested: { collectionId, tokenId: token2Id },
});
```

After unnesting the token with tokenId=2 is no longer part of the bundle. Neither is the token with tokenId=1 - because it no longer has any attached tokens.

Read more about nesting functions in the [reference](../../reference/sdk-methods.md)

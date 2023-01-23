# Nesting

The **nesting** feature allows you to create **nested tokens**. Thus, the topmost token will have a wallet address as its owner, while the owner of tokens nested in it will be the token above it.
The entire chain of nested tokens will be called a **bundle**.  If you transfer a top-level token to another owner, all tokens in the bundle will go with it.


## Creating a collection

:warning: You need to set the permission field correctly in the collection. Otherwise, if the collection is not allowed to be nested, you won't be able to create a bundle of nested tokens in it.

```typescript
export async function createCollection(sdk, address) {
  const { parsed, error } = await sdk.collections.creation.submitWaitResult({
    address,
    name: 'Test collection',
    description: 'My test collection',
    tokenPrefix: 'TST',
    permissions: {
      nesting: {
        tokenOwner: true,
        collectionAdmin: true,
      },
    },
  });

  if (error) {
    console.log('create collection error', error);
    process.exit();
  }

  const { collectionId } = parsed;

  return sdk.collections.get({ collectionId });
}
```

## Token creation

```typescript
export async function createToken(sdk, address, collectionId) {
  const { parsed, error } = await sdk.tokens.create.submitWaitResult({
    address,
    collectionId,
  });

  if (error) {
    console.log('create token error', error);
    process.exit();
  }

  const { tokenId } = parsed;

  return sdk.tokens.get({ collectionId, tokenId });
}
```

## Creating a nested token

```typescript
export async function createNestedToken(sdk, nestedArgs) {
  const { address, parent, nested } = nestedArgs;
  const { parsed, error } = await sdk.tokens.nest.submitWaitResult({
    address,
    parent,
    nested,
  });

  if (error) {
    console.log('create token error', error);
    process.exit();
  }

  const { collectionId, tokenId } = parsed;

  console.log(`Token ${tokenId} from collection ${collectionId} successfully nested`);

  return sdk.tokens.get({ collectionId, tokenId });
}
```

## Example execute function

Now let's wrap all our steps in an asynchronous function and run it, watching the result in the console

```typescript
async function main() {

  // get signer
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.instance.address;

  // initialize sdk
  const sdk = createSdk(signer);

  // create a collection
  const collection = await createCollection(sdk, address);
  console.log('collection', collection);

  // token creating 
  const token = await createToken(sdk, address, collection.id);
  console.log('token', token);
  const token2 = await createToken(sdk, address, collection.id);
  console.log('token2', token2);

  // nesting (put tokenId 2 in tokenId 1)
  const nestedToken = await createNestedToken(sdk, {
    address,
    parent: {
      collectionId: collection.id,
      tokenId: token.tokenId,
    },
    nested: {
      collectionId: collection.id,
      tokenId: token2.tokenId,
    },
  });

  console.log('nestedToken', nestedToken);
}

main();
```

## IsBundle and getBundle

Let's look at some more functions provided by our library: IsBundle and getBundle. Add the following code inside the `main` function

```typescript
  const isBundle = await sdk.tokens.isBundle({
    collectionId: collection.id,
    tokenId: 1,
  });

  const isBundle2 = await sdk.tokens.isBundle({
    collectionId: collection.id,
    tokenId: 2,
  });

  console.log('token 1 isBundle?', isBundle);
  console.log('token 2 isBundle?', isBundle2);

  const result: any = await sdk.tokens.getBundle({
    collectionId: collection.id,
    tokenId: 2,
  });

  console.log('getBundle', result);
```
Running the whole process, you will see that both the top-level and the nested token are part of the bundle.

## Unnest

The reverse process is called `unnest`, when a token no longer belongs to any token and its owner becomes the wallet address.

Add to your js file unnesting function

```typescript
export async function createUnNestedToken(sdk: any, nestedArgs: any) {
  const { address, parent, nested } = nestedArgs;
  const { parsed, error } = await sdk.tokens.unnest.submitWaitResult({
    address,
    parent,
    nested,
  });

  if (error) {
    console.log('create token error', error);
    process.exit();
  }

  const { collectionId, tokenId } = parsed;

  console.log(`Token ${tokenId} from collection ${collectionId} successfully unnested`);

  return sdk.tokens.get({ collectionId, tokenId });
}
```

and add its call to our function`main`

```typescript
const unNestedToken = await createUnNestedToken(sdk, {
    address,
    parent: {
      collectionId: collection.id,
      tokenId: token.tokenId,
    },
    nested: {
      collectionId: collection.id,
      tokenId: token2.tokenId,
    },
  });

  console.log('unNestedToken', unNestedToken);

  const isBundleAfterUnnest = await sdk.tokens.isBundle({
    collectionId: collection.id,
    tokenId: 2,
  });

  console.log('token 2 isBundle?', isBundleAfterUnnest);
  ```
after unnesting you will see that the token with tokenId=2 is no longer part of the bundle. Neither is the token with tokenId=1 - because it no longer has any attached tokens.


Read more about this and other nesting functions [**here**](../sdk/methods.md)

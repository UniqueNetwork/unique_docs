# Nesting and Bundling 

### General info

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1, by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

We can use the `tokenIdToAddress` function to obtain a token's address. As it will become apparent from the example code given below, we are constructing a valid and unique Ethereum address by incorporating the collection and token IDs into a 'root' Ethereum address.

A group of tokens nested within an NFT can, in turn, be a nested, ordered, tree-like structure. This format specifically applies to NFT games and marketplaces because it allows developers to create novel NFT relationships.

For example, we can create a main-game-character NFT and then nest in-game items under it as a single, convenient bundle.

![Nesting](../images/nesting.png)

<Details>
<template v-slot:header>
Sample code
</template><template v-slot:body>

```typescript:no-line-numbers
import { ethers } from 'ethers';
 
const tokenIdToAddress = (collectionId, tokenId) => {
  if (collectionId >= 0xffffffff || collectionId < 0) 
    throw new Error('collectionId overflow');
  if (tokenId >= 0xffffffff || tokenId < 0) 
    throw new Error('tokenId overflow');
  return ethers.utils.toChecksumAddress(
    `0xf8238ccfff8ed887463fd5e0${collectionId.toString(16).padStart(8, '0')}${tokenId.toString(16).padStart(8, '0')}`
 );
}
```
</template>
</Details>

We can perform the nesting simply by sending the token to this address by invoking a transfer call:

```typescript:no-line-numbers
api.tx.unique.transfer({Ethereum: tokenIdToAddress(ACollectionId, A1TokenId)}, ACollectionId, A2TokenId, 1)
```

`ACollectionId` is the ID of the collection the NFTs A1 and A2 belong to, and `A1TokenId` and `A2TokenId` are the individual tokens IDs (all of them integer numbers).

A prerequisite for nesting is that both the tokens must belong to the same owner.

Unnesting can be performed via a regular transfer call (the `createMultiple` SDK method.transferFrom):

```typescript:no-line-numbers
api.tx.unique.transferFrom({Ethereum: tokenIdToAddress(ACollectionId, A1TokenId)}, {Substrate: newOwnerAddress}, ACollectionId, A2TokenId, 1)
```

Only the owner of the parent NFT (A1) can perform a withdrawal of the NFT from a bundle. By withdrawing a parent NFT, the whole branch of descendant tokens nested under it are also transferred (A1 can thus be viewed as a branch root).

The nesting depth of a bundle is limited to 5 generations (or 5 layers deep). As previously mentioned, a nested token must share a common owner with the root token.

### Limitations

When using nesting, you may face limitations for the amount of tokens that can be minted using the `createMultiple` SDK method.

Let's take the following example: we have three collections, and we want to mint tokens in them and implement three-level nesting.
So, we mint a token (A) in the first collection first. Then, we mint a token (B) in the second collection and specify the token from the first collection as its owner. Now, the token from the second collection is nested to the token from the first collection. Good!  
Now, we want to mint several tokens in the third collection and nest all of them to the token B.
The most convenient way is to use bulk minting, e.g., using the `createMultiple` SDK method. But that's where we face the limitation.
We cannot mint **more than 2 tokens** using this method if we are using the described nesting scheme. 

Now, we will clarify why the chain works this way. **Five** is not a nesting depth limitation. This is the depth budget. Based on the
the example below, we will describe the process step-by-step: 

1. We have token A, and token B is nested into it. Now, we will try to mint three tokens into token B.
2. We initiate the transaction for bulk minting to create 3 tokens. The nesting budget for the transaction is **5**.
3. The blockchain mints the first of three tokens. It has depth 2 (C1 -> B -> A). The budget is reduced by 2. Now, the budget is equal to **3**. 
4. The blockchain mints the second of three tokens. It has the same depth - 2 (C2 -> B -> A). The budget is reduced by 2. 
Now, the budget is equal to **1**.
5. The blockchain mints the third of three tokens. It has the same depth - 2 (C3 -> B -> A). The budget should be reduced by 2. 
But we do not have such a budget remaining. If we commit the transaction, the budget will be **-1**. The error of the budget overflow occurs. 

:warning: The budget for nesting is defined for the transaction. That's why the issue occurs when we are using the bulk minting.
This is one transaction for the blockchain. The budget does not depend on tokens, collections, or anything else. 

**Solution**: To implement this scenario, we could carry out three separate transactions: mint C1, mint C2, and mint C3. 
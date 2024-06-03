# Collection Helpers

Address: **0x6c4e9fe1ae37a41e93cee429e8e1881abdcbb54f**

This precompiled contract enables the creation of native collections and tokens via the Ethereum interface.

## Code examples

Below are examples of how to use this precompiled contract with ethers.js and hardhat.

> If you're unfamiliar with setting up a Hardhat project, refer to the official documentation: https://hardhat.org/docs

### Connect to contract

```ts
import { ethers } from 'hardhat';
import { CollectionHelpers__factory } from '@unique-nft/solidity-interfaces';

const [signer] = await ethers.getSigners();

const collectionHelpers = CollectionHelpers__factory
  .connect("0x6c4e9fe1ae37a41e93cee429e8e1881abdcbb54f", signer);
```
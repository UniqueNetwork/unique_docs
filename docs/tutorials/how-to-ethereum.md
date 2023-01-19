# How to work with Unique Network using Ethereum technologies 

[[toc]]

## Intro 

In Unique Network, there is no need to write smart contracts as it is usually required in Ethereum networks.

Unique Network provides emulated smart contracts. This means that if you call a specific address where a smart contract is supposed to be, Unique Network will pretend that it has a smart contact there. Thus, you can access our node using Ethereum technologies, and the node will respond.

This advantage allows using smart contracts just as libraries from any `.js`, `.ts` or even `.sol` file. The following guide will demonstrate how we call the smart contracts from the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

In this tutorial, we will use the [Hardhat library](https://hardhat.org/hardhat-runner/docs/guides/project-setup). We will walk through creating and deploying an ERC-721 smart contract on the Opal test network using Hardhat and Solidity. Also, we will create a collection and mint several different NFTs using the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

## Prerequisites

You need to have the following installed and prepared to start this guide:

- Node.js, version > 14.
- **npm** or **yarn**.
- Metamask account.

At the moment, we have Opal Testnet. 
Its websocket URL is `wss://ws-opal.unique.network` (rpc endpoint - `https://rpc-opal.unique.network`). 

In Polkadot apps, you can check it using [this link](https://polkadot.js.org/apps/?rpc=wss://ws-opal.unique.network/#/explorer).

You can use [@unique2faucet_opal_bot](https://t.me/unique2faucet_opal_bot) in Telegram to get some **OPL**.

## Set up environment 

### Install and initialize the libraries  

First of all, we need to install the libraries. 

To install the required libraries, you can use the following commands. Please note that Hardhat must be initialized after the installation.

The second command will prompt to select the project type, please choose *TypeScript* and answer *yes* to all questions.

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install --save-dev hardhat @unique-nft/solidity-interfaces @nomicfoundation/hardhat-toolbox dotenv
npx hardhat
npx hardhat test
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add -D hardhat @unique-nft/solidity-interfaces @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers dotenv
yarn hardhat
yarn hardhat test 
```

</CodeGroupItem>
</CodeGroup>


### Connect the network and the Metamask account

Create a `.env` file in the root directory of our project, and add your Metamask private key and the network RPC to it.

Follow [these instructions](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key/ "these instructions") to export your private key from Metamask. 

Your `.env` should look like this:

```typescript:no-line-numbers
RPC_OPAL="https://rpc-opal.unique.network"
PRIVATE_KEY = "your-metamask-private-key"
```

After this, update your `hardhat.config.ts` so that our project knows about all of these values. Please pay attention to the `settings` object in the config file. To successfully compile the smart contracts, please use this configuration that enables the IR-based ( intermediate representation) code generator. Also, we will need to enable the optimizer and set the parameter for it. 

This configuration is required for Solidity versions newer than 0.8.17 (for more details please check the [Solidity docs](https://docs.soliditylang.org/en/v0.8.17/ir-breaking-changes.html)). 

```typescript:no-line-numbers
import dotenv from 'dotenv'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config()
const { RPC_OPAL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 800,
      },
      viaIR : true,
    },
  },
  networks: {
    hardhat: {},
    opal: {
      url: RPC_OPAL,
      accounts: [`${PRIVATE_KEY}`]
    },
  }
};

export default config;
```

## Using your own smart contract

### Write a new smart contract  

After this, we will write a new smart contract that will use this library. Please pay attention that we can just import a couple of `.sol` files and use them. 

We will create a new file in the */contracts* folder with the **CollectionManager.sol** name. This contract will create a collection and make it ERC721Metadata compatible. This simple example demonstrates how you can create your own smart contracts if needed using our library.   

The contract below is [inherited](https://docs.soliditylang.org/en/develop/contracts.html#inheritance) from `CollectionHelpersEvents`. You can refer to the `CollectionHelpers.sol` file from the library to learn more. The contract contains one function (`createCollection`) that accepts a collection owner address, a collection admin address, a collection name, a collection description, a collection symbol and a collection base URI as arguments. Then, the function calls the `createNFTCollection` function from our library that creates an NFT collection. When the collection is created, our function makes this collection ERC721Metadata compatible. Finally, it sets the collection admin and collection owner and returns the address of the created collection.

```sol:no-line-numbers
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {CollectionHelpers, CollectionHelpersEvents} from  "@unique-nft/solidity-interfaces/contracts/CollectionHelpers.sol";
import {UniqueNFT, CrossAddress} from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

// inherit contract from our interface 
contract CollectionManager is CollectionHelpersEvents {
  // a «static» smart contract in our chain (CollectionHelpers.sol) obtained by its address 
  CollectionHelpers helpers = CollectionHelpers(0x6C4E9fE1AE37a41E93CEE429e8E1881aBdcbb54F);

  function createCollection(
    address owner,
    address managerContract,
    string calldata name,
    string calldata description,
    string calldata symbol,
    string calldata baseURI
  ) public payable virtual returns (address){
    // create a collection using the method from the library 
    address collectionAddress = helpers.createNFTCollection{value: helpers.collectionCreationFee()}(name, description, symbol);
    // make the collection ERC721Metadata compatible
    helpers.makeCollectionERC721MetadataCompatible(collectionAddress, baseURI);
    // get the collection object by its address 
    UniqueNFT collection = UniqueNFT(collectionAddress);
    // set the collection admin and owner using cross address
    collection.addCollectionAdminCross(CrossAddress(managerContract, 0));
    collection.changeCollectionOwnerCross(CrossAddress(owner, 0));
    // return the collection address 
    return collectionAddress;
  }
}
```
:warning: Make sure that the version defined above (^0.8.17) is the same as the version defined in the **hardhat.config.ts** file.

### Deploy a smart contract  

Now, when our contract is written (see above) and our configuration file is ready, it is time to write the contract deployment script.

Create the `deploy.ts` file in the */scripts* folder with the following content:

```typescript:no-line-numbers
const {ethers} = require('hardhat');

async function main() {
  // Grab the contract factory
  const CollectionManager = await ethers.getContractFactory("CollectionManager");

  // Start deployment, returning a promise that resolves to a contract object
  const collectionManager = await CollectionManager.deploy(); // Instance of the contract
  console.log("Contract deployed to address:", collectionManager.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

After this, we are finally ready to deploy our smart contract! For this, please run the following command line:

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npx hardhat run scripts/deploy.ts --network opal
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn hardhat run scripts/deploy.ts --network opal
```

</CodeGroupItem>
</CodeGroup>

When the script is executed, you should then see something like:

``Contract deployed to address: 0xB07956E26FDF1b215aC89AE21F822F8AB9Be9A27
``

### Create an NFT collection 

Now, we can create a new file in the */scripts* folder called `createCollection.ts`.

First of all, we will import all needed packages and create the `main` function which will contain all our actions. This script creates a new collection using the smart contract that we deployed in the previous section. 

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from "hardhat"
import {CollectionHelpersFactory, UniqueNFTFactory} from "@unique-nft/solidity-interfaces"
import {CollectionManager__factory} from '../typechain-types'
import {Address} from "@unique-nft/utils";

async function main() {
  // define a provider
  const provider = ethers.provider
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) 
    throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  // address received after the deployment - see the section above 
  const contractAddress = '0xFcD9dC04af91B033834B230A1D8B4CDd7fDfFbb4'

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)
  // Create a contract instance
  const collectionManager = CollectionManager__factory.connect(contractAddress, wallet);
  console.log(`Contract address found: ${collectionManager.address}`)

  // create a new collection
  let newCollection = await collectionManager.createCollection(
    '0xb4d6A98aa8CD5396069c2818Adf4ae1A0384b43a',
    '0xb4d6A98aa8CD5396069c2818Adf4ae1A0384b43a',
    'My new collection',
    'This collection is for testing purposes',
    'TC',
    'https://ipfs.unique.network/ipfs/',
    {
      value: await collectionHelpers.collectionCreationFee()
    }
  )

  const transactionReceipt = await newCollection.wait()
  const collectionAddress = transactionReceipt.events?.[0].args?.collectionId as string
  const collectionId = Address.collection.addressToId(collectionAddress)

  console.log(`Collection created!`)
  console.log(`Address: ${collectionAddress} , id: ${collectionId}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Using Unique solidity interfaces 

### Create an NFT collection 

Now, when we demonstrated how to work with contracts that you can create on your own, let's proceed to the our [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library. All further actions will be performed using it. 

:warning: Starting from this section, we will add more and more different actions to one script file. In the end, we will get one function that carries out all actions in one single execution. 

Let's initialize the needed objects, our config file and also create an array of cids for the future. The code below demonstrates how to create a new collection using our library. The code looks shorter and cleaner comparing to the previous section where we used the manual created smart contract. 

We would like to draw your attention to the fact that the collection creation at Unique chains cost some price 
and additional collection creation price which is 2 UNQ or QTZ. Via Substrate API 
this sum is being hold automatically, while via Eth RPC API it requires to pass
the value manually. But to not pass this constant manually (because it may change somewhere later)
there is a useful helper `collectionHelpers.collectionCreationFee()` which returns
real necessary value to send to create a collection. 

Thus, usual collection creation has complete cost around ~2.3 UNQ, where 2 UNQ 
must be paid via `{value: await collectionHelpers.collectionCreationFee()}` field in the transaction.
And the rest ~0.3 UNQ will be hold automatically in the form of gas cost. 

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from "hardhat"
import {CollectionHelpersFactory, UniqueNFTFactory} from "@unique-nft/solidity-interfaces"
import {Address} from "@unique-nft/utils";

dotenv.config()

// define several cids that we will use in our example
const tokenIpfsCids = {
  1: 'QmZ8Syn28bEhZJKYeZCxUTM5Ut74ccKKDbQCqk5AuYsEnp',
  2: 'QmZVpSsjvxev3C8Dv4E44fSp8gGMP6aoLMp56HmZi5Wkxh',
  3: 'QmZMo8JDB9isA7k7tr8sFLXYwNJNa51XjJinkLWcc9vnta',
  4: 'QmV7fqfJBozrc7VtaHSd64GvwNYqoQE1QptaysenTJrbpL',
}

async function main() {
  // define a provider
  const provider = ethers.provider
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) 
    throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)

  // create a new collection
  let newCollection = await ( await collectionHelpers.createNFTCollection(
    'My NFT collection',
    'This collection is for testing purposes',
    'TC',
    {
      value: await collectionHelpers.collectionCreationFee(),
    }
  )).wait()

  const collectionAddress = newCollection.events?.[0].args?.collectionId as string
  const collectionId = Address.collection.addressToId(collectionAddress)

  console.log(`Collection created! Address: ${collectionAddress} , id: ${collectionId}`)
}
```

### Make a collection 721Metadata compatible

The ERC721Metadata interface is an optional interface to add other metadata details to your [ERC721](https://eips.ethereum.org/EIPS/eip-721) NFTs. The developers can choose to add a token name, a token symbol, and a token URI as metadata to an ERC721 token. If you want to use these metadata fields for tokens, you can make the created collection the ERC721Metadata compatible. 

Please note that the collection, that we created in the [using your own smart contract](#using-your-own-smart-contract) section, is already ERC721Metadata compatible. 

```ts:no-line-numbers
async function main() {
  /*
  code created earlier 
  */
  const txMakeERC721 = await (await collectionHelpers.makeCollectionERC721MetadataCompatible(
    collectionAddress, 
    'https://ipfs.unique.network/ipfs/',
  )).wait()

  console.log('The ERC721Metadata flag was set to true.')
}
```

### Mint an NFT

Now, when we created the collection, let's proceed to minting NFTs. For this, we will need to use the `UniqueNFTFactory` object and initialize it using id of the created collection. After this, we can just call the corresponding method (`mint`) to create an new NFT. The only argument for this method is the owner address. 

You can add the following code to the `main` function which we created earlier. 

```ts:no-line-numbers
async function main() {
  /*
  code created earlier 
  */
  const collection = await UniqueNFTFactory(collectionId, wallet, ethers)

  const txMintToken = await (await collection.mint(wallet.address)).wait()

  const tokenId = txMintToken.events?.[0].args?.tokenId.toString()
  const tokenUri = await collection.tokenURI(tokenId)

  console.log(`Successfully minted token #${tokenId}, it's URI is: ${tokenUri}`)
}
```

### Mint an NFT with cross address

Before we proceed to the code sample, we would like to provide some details on how the cross address works in Ethereum. 
The cross address is a structure that contains an Ethereum and a Substrate addresses: 

```ts:no-line-numbers
struct CrossAddress {
	address eth;
	uint256 sub;
}
```

:warning: One of these addresses must be zero address. In other case, the blockchain will reject the transaction. 

To clarify, you must specify two addresses in any case. But, one of them must be zero address, and the second one must be a valid address. 

Now, when we know what the cross address is, we can use the `mintCross` method that accepts as the first argument the `CrossAddress` structure. The second parameter is the properties array. In this example, we will set only one property (`URISuffix`).

Please refer to the code sample below that demonstrates how to mint a token using an Ethereum address. You can add the following code to the `main` function which we created earlier. 

```ts:no-line-numbers
// import new objects for this section
import {Ethereum} from '@unique-nft/utils/extension'
import {Address, StringUtils} from '@unique-nft/utils'

async function main() {
  /*
  code created earlier 
  */
  const collection = UniqueNFTFactory(collectionId, wallet, ethers)

  const crossMintResult = await (await collection.mintCross(
    {
      eth: wallet.address,
      sub: 0n,
    },
    [
      {
        key: 'URISuffix',
        value: StringUtils.Utf8.stringToNumberArray(tokenIpfsCids['1']),
      },
    ]
  )).wait()
    
  const parsedTxReceipt = Ethereum.parseEthersTxReceipt(crossMintResult)
  console.log(`Successfully minted token with cross address. Id: 
    ${parsedTxReceipt.events.Transfer.tokenId.toString()}`)
}
```

As we mentioned, it is possible to specify either Ethereum, or Substrate address in the cross address. So, let's demonstrate how to use the Substrate address for the same operation.  

```ts:no-line-numbers
const crossMintResult = await (await collection.mintCross(
  {
    eth: '0x0000000000000000000000000000000000000000',
    sub: Address.substrate.decode('5DVgiNh1Go8ESa18xEirA4uV3zpra59awPGQjJTmCrqYMNtM').bigint,
  }, 
  [
    {
      key: 'URISuffix',
      value: StringUtils.Utf8.stringToNumberArray(tokenIpfsCids['2'])
    }
  ]
)).wait()
```

### URI and URISuffix

A token has the following properties: `baseURI`, `URI`, `URISuffix`. In this section, we will provide some details about them and describe how an URI is returned by our `tokenURI` method when you are trying to get a token URI. 

So, when we are getting a token URI, first of all, we need to check that this collection is ERC721Metadata compatible. If this is not so, the error will occur. Then, we check whether the mentioned above properties exist and are not zero address. 

The check is carried out in this order: `URI`, `baseURI`, `URISuffix`. 

1. If the `URI` property is valid (exists and not zero address), then the method returns it. If the property is invalid, proceed to next check.
2. If the `baseURI` property is valid, then the method returns an empty value. If the property is invalid, proceed to next check.
3. If the `URISuffix` property is valid, the method returns the `baseURI + URISuffix` value. 
4. If all previous checks failed, the method returns the `baseURI` property value.  

Thus, if the collection is not ERC721Metadata compatible, then you will not be able to get the `URI` and `URISuffix` properties at all. 

### Mint an NFT with token URI 

There is a way to mint a token and specify its tokenURI in one action. For this, we can use the `mintWithTokenURI` method. We just need to pass an owner address and a token URI to this method.  

You can add the following code to the `main` function which we created earlier. 

```ts:no-line-numbers
async function main() {
  /*
  code created earlier 
  */
  const txMintToken = await (await collection.mintWithTokenURI(wallet.address, 
    'https://ipfs.unique.network/ipfs/' + tokenIpfsCids['3'])).wait()

  const tokenId = txMintToken.events?.[1].args?.tokenId.toNumber()
  const tokenUri = await collection.tokenURI(tokenId)

  console.log(`Successfully minted token #${tokenId}, it's URI is: ${tokenUri}`)
}
```

### Mint an NFT with a token suffix 

To create an NFT with the token suffix, you need to mint an NFT first using the common `mint` method, and then use the `setProperties` method to set the `URISuffix` property. 

Please keep in mind that you can set any property this way. Also, just in case, we would like to remind you that we already set this property in different way in the [mint with cross address](#mint-with-cross-address) section.

```ts:no-line-numbers
async function main() {
  /*
  code created earlier 
  */
  const txMintToken = await (await collection.mint(wallet.address)).wait()

  const tokenId = txMintToken.events?.[0].args?.tokenId.toString()
  const tokenUri = await collection.tokenURI(tokenId)
  console.log(`Successfully minted token to set the suffix: #${tokenId}, 
      it's URI is: ${tokenUri}`)

  const txSetSuffix = await (await collection.setProperties(
    tokenIdWithSuffix,
    [ 
      {
        key: 'URISuffix',
        value: StringUtils.Utf8.stringToNumberArray(tokenIpfsCids['4']),
      },
    ]
  )).wait()

  console.log(`URI suffix was set for token # ${tokenIdWithSuffix}`)
}
```

## Result 

Here is the final code that we created during this tutorial. It creates a new collection, makes it ERC721Metadata compatible and mints 4 NFTs in different ways and with different property values.  

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from 'hardhat'
import {CollectionHelpersFactory, UniqueNFTFactory} from '@unique-nft/solidity-interfaces'
import {Ethereum} from '@unique-nft/utils/extension'
import {Address, StringUtils} from '@unique-nft/utils'

dotenv.config()

const tokenIpfsCids = {
  1: 'QmZ8Syn28bEhZJKYeZCxUTM5Ut74ccKKDbQCqk5AuYsEnp',
  2: 'QmZVpSsjvxev3C8Dv4E44fSp8gGMP6aoLMp56HmZi5Wkxh',
  3: 'QmZMo8JDB9isA7k7tr8sFLXYwNJNa51XjJinkLWcc9vnta',
  4: 'QmV7fqfJBozrc7VtaHSd64GvwNYqoQE1QptaysenTJrbpL',
}

async function main() {
  // define a provider
  const provider = ethers.provider
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) 
    throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)

  // create a new collection
  let newCollection = await ( await collectionHelpers.createNFTCollection(
    'My NFT collection',
    'This collection is for testing purposes',
    'TC',
    {
      value: await collectionHelpers.collectionCreationFee(),
    }
  )).wait()

  const collectionAddress = newCollection.events?.[0].args?.collectionId as string
  const collectionId = Address.collection.addressToId(collectionAddress)
  console.log(`Collection created!`)
  console.log(`Address: ${collectionAddress} , id: ${collectionId}`)
 
  // Make ERC721Metadata
  const txMake = await (
    await collectionHelpers.makeCollectionERC721MetadataCompatible(
      collectionAddress,
      'https://ipfs.unique.network/ipfs/'
    )
  ).wait()

  console.log('The ERC721Metadata flag was set to true.')

  const collection = await UniqueNFTFactory(collectionId, wallet, ethers)

  // Mint 
  const txMintToken = await (await collection.mint(wallet.address)).wait()

  const tokenId = txMintToken.events?.[0].args?.tokenId.toString()
  const tokenUri = await collection.tokenURI(tokenId)
  console.log(`Successfully minted token #${tokenId}, it's URI is: ${tokenUri}`)
  
  // Mint cross
  const crossMintResult = await ( await collection.mintCross(
    {
      eth: wallet.address,
      sub: 0n,
    },
    [
      {
        key: 'URISuffix',
        value: StringUtils.Utf8.stringToNumberArray(tokenIpfsCids['1']),
      },
    ]
  )).wait()

  const parsedTxReceipt = Ethereum.parseEthersTxReceipt(crossMintResult)
  console.log(`Successfully minted token with cross address. 
    Id: ${parsedTxReceipt.events.Transfer.tokenId.toString()}`)

  // Mint with URI
  const txMintTokenWithURI = await (await collection.mintWithTokenURI(wallet.address, 
    'https://ipfs.unique.network/ipfs/' + tokenIpfsCids['1'])).wait()

  const tokenIdWithURI = txMintTokenWithURI.events?.[1].args?.tokenId.toNumber()
  const tokenUriWithURI = await collection.tokenURI(tokenIdWithURI)

  console.log(`Successfully minted token #${tokenIdWithURI}, 
    it's URI is: ${tokenUriWithURI}`)

  // Mint with suffix 
  const txMintTokenWithSuffix = await (await collection.mint(wallet.address)).wait()

  const tokenIdWithSuffix = txMintTokenWithSuffix.events?.[0].args?.tokenId.toString()
  const tokenUriWithSuffix = await collection.tokenURI(tokenIdWithSuffix)

  console.log(`Successfully minted token to set the suffix: #${tokenIdWithSuffix}, 
    it's URI is: ${tokenUriWithSuffix}`)

  const txSetSuffix = await (await collection.setProperties(
    tokenIdWithSuffix,
    [ 
      {
        key: 'URISuffix',
        value: StringUtils.Utf8.stringToNumberArray(tokenIpfsCids['2']),
      },
    ]
  )).wait()

  console.log(`URI suffix was set for token # ${tokenIdWithSuffix}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

```
# How to work with Unique Network using Ethereum technologies 

[[toc]]

### Intro 

In Unique Network, there is no need to write smart contracts as it is usually required in Ethereum networks.

Unique Network provides emulated smart contracts. This means that if you call a specific address where a smart contract is supposed to be, Unique Network will pretend that it has a smart contact there. Thus, you can access our node using Ethereum technologies, and the node will respond.

This advantage allows using smart contracts just as libraries from any `.js`, `.ts` or even `.sol` file. The following guide will demonstrate how we call the smart contracts from the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

In this tutorial, we will use the [Hardhat library](https://hardhat.org/hardhat-runner/docs/guides/project-setup). We will walk through creating and deploying an ERC-721 smart contract on the Opal test network using Hardhat and Solidity. Also, we will mint an NFT using a library.

### Prerequisites

You need to have the following installed and prepared to start this guide:

- Node.js, version > 14.
- **npm** or **yarn**.
- Metamask account.

At the moment, we have Opal Testnet. 
Its websocket URL is *wss://ws-opal.unique.network* (rpc endpoint - https://rpc-opal.unique.network). 

In Polkadot apps, you can check it using [this link](https://polkadot.js.org/apps/?rpc=wss://ws-opal.unique.network/#/explorer).

You can use [@unique2faucet_opal_bot](https://t.me/unique2faucet_opal_bot) in Telegram to get some **OPL**.

### Initialize the required libraries  

First of all, we need to install the libraries and then import the required objects to our script. 

To install the libraries, you can use the following commands. Please note that Hardhat must be initialized after the installation.

This command will prompt to select the project type, please choose *TypeScript* and answer *yes* to all questions.

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install --save-dev hardhat
npx hardhat
npx hardhat test
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add -D hardhat
yarn hardhat
yarn hardhat test 
```

</CodeGroupItem>
</CodeGroup>

When the main library is installed, we will need to install some additional packages which will be used later. 

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers
```

</CodeGroupItem>
</CodeGroup>

### Import smart contracts and write a new one  

Let's install the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library that provides the several smart contracts. You can check the repository for the `.sol` files and review them if needed. 

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm i @unique-nft/solidity-interfaces
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/solidity-interfaces
```

</CodeGroupItem>
</CodeGroup>

After this, we will write a new smart contract that will use this library. Please pay attention that we can just import a couple of **.sol** files and use them. 

We will create a new file in the */contracts* folder with the **CollectionManager.sol** name. 

```sol:no-line-numbers
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {CollectionHelpers, CollectionHelpersEvents} from  "@unique-nft/solidity-interfaces/contracts/CollectionHelpers.sol";
import {UniqueNFT, CrossAddress} from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

contract CollectionManager is CollectionHelpersEvents {
  CollectionHelpers helpers = CollectionHelpers(0x6C4E9fE1AE37a41E93CEE429e8E1881aBdcbb54F);

  function createCollection(
    address owner,
    address managerContract,
    string calldata name,
    string calldata description,
    string calldata symbol,
    string calldata baseURI
  ) public payable virtual returns (address){
    address collectionAddress = helpers.createNFTCollection{value: helpers.collectionCreationFee()}(name, description, symbol);

    helpers.makeCollectionERC721MetadataCompatible(collectionAddress, baseURI);

    UniqueNFT collection = UniqueNFT(collectionAddress);

    collection.addCollectionAdminCross(CrossAddress(managerContract, 0));
    collection.changeCollectionOwnerCross(CrossAddress(owner, 0));

    return collectionAddress;
  }
}
```
:warning: Make sure that the version defined above (^0.8.17) is the same as the version defined in the **hardhat.config.ts** file.

### Connect the network and the Metamask account

Install the `dotenv` package in your project directory by running:

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install dotenv --save
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add dotenv --save
```

</CodeGroupItem>
</CodeGroup>

Then, create a `.env` file in the root directory of our project, and add your Metamask private key and the network RPC to it.

Follow [these instructions](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key/ "these instructions") to export your private key from Metamask. 

Your `.env` should look like this:

```typescript:no-line-numbers
RPC_OPAL="https://rpc-opal.unique.network"
PRIVATE_KEY = "your-metamask-private-key"
```

After this, update your `hardhat.config.ts` so that our project knows about all of these values.

```typescript:no-line-numbers
import dotenv from 'dotenv'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config()
const { RPC_OPAL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
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

### Deploy a smart contract  

Now, when our contract is written (see above) and our configuration file is ready, it is time to write the contract deployment script.

Create the `deploy.ts` file with the following content:

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

#### Using your own smart contract

Now, we can create a new file in the */scripts* folder called `createCollection.ts`.

First of all, we will import all needed packages and create the `main` function which will contain all our actions. 

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
  // @ts-ignore
  const wallet = new ethers.Wallet(privateKey, provider)
  // address received after the deployment - see the section above 
  const contractAddress = '0xFcD9dC04af91B033834B230A1D8B4CDd7fDfFbb4'
  // @ts-ignore
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

#### Using Unique solidity interfaces 

:warning: Starting from this section, we will add more and more different actions to one script file. In the end, we will get one function that carries out all actions in one execution. 

```ts:no-line-numbers
// create a new collection
let newCollection = await (await collectionHelpers.createNFTCollection(
    'My NFT collection',
    'This collection is for testing purposes',
    'TC',
    {
      value: await collectionHelpers.collectionCreationFee()
    }
  )).wait()

const collectionAddress = newCollection.events?.[0].args?.collectionId as string
const collectionId = Address.collection.addressToId(collectionAddress)
console.log(`Collection created!`)
console.log(`Address: ${collectionAddress} , id: ${collectionId}`)
```

### Make a collection 721Metadata compatible

```ts:no-line-numbers
const txMake = await (await collectionHelpers.makeCollectionERC721MetadataCompatible(
    collectionAddress, 
    'https://ipfs.unique.network/ipfs/',
  )).wait()

console.log('The ERC721Metadata flag was set to true.')
```

### URI and URISuffix

A token has the following properties: `baseURI`, `URI`, `URISuffix`. In this section, we will provide some details about them and describe how an URI is returned by our `tokenURI` method when you are trying to get a token URI. 

So, when we are getting a token URI, first of all, we need to check that this collection is ERC721Metadata compatible. If this is not so, the error will occur. Then, we check whether the mentioned above properties exist and are not empty. 

The check is carried out in this order: `URI`, `baseURI`, `URISuffix`. 

1. If the `URI` property is valid (exists and not empty), then the method returns it. 
2. If the `baseURI` property is valid, then the method returns an empty value. 
3. If the `URISuffix` property is valid, the method returns the `baseURI + URISuffix` value. If all previous checks failed, the method returns the `baseURI` property value.  

Thus, if the collection is not ERC721Metadata compatible, then you will not be able to get the `URI` and `URISuffix` properties at all. 

### Mint an NFT 

#### Classic Mint



```ts:no-line-numbers
const collection = UniqueNFTFactory(collectionId, wallet, ethers)

const txMintToken = await (await (await collection).mint(wallet.address)).wait()

const tokenId = txMintToken.events?.[0].args?.tokenId.toString()
const tokenUri = await (await collection).tokenURI(tokenId)
console.log(`Successfully minted token #${tokenId}, it's URI is: ${tokenUri}`)
```

#### Mint with Cross account

Before we proceed to the code sample, we would like to provide some details on how the cross account works in Ethereum. 
The cross address is a structure that contains an Ethereum and a Substrate addresses: 

```ts:no-line-numbers
struct CrossAddress {
	address eth;
	uint256 sub;
}
```

:warning: One of these addresses must be empty. In other case, the blockchain will reject the transaction. 

To clarify, you must specify two addresses in any case. But, one of them must be empty, and the second one must be a valid address. 

Now, when we know what the cross address is, we can use the `mintCross` method that accepts as the first argument the `CrossAddress` structure. The second parameter is the properties array. In this example, we will set only one property (`URISuffix`).

Please refer to the code sample below that demonstrates how to mint a token. You can add the following code to the `main` function which we created earlier. 

```ts:no-line-numbers
// import new objects for this section
import {Ethereum} from '@unique-nft/utils/extension'
import {Address, StringUtils} from '@unique-nft/utils'

async function main() {

  /*
  code created earlier 
  */

  const collection = UniqueNFTFactory(collectionId, wallet, ethers)

  const crossMintResult = await (await (await collection).mintCross(
    {
      eth: wallet.address,
      sub: 0n,
    },
    [
      {
        key: 'URISuffix',
        value: StringUtils.Utf8.stringToNumberArray(tokenIpfsCids['1']),
      },
    ])).wait()
    
  const parsedTxReceipt = Ethereum.parseEthersTxReceipt(crossMintResult)
  console.log(parsedTxReceipt.events)
}
```

### Mint a NFT with tokenURI 

There is a way to mint a token and specify its tokenURI in one action. For this, we can use the `mintWithTokenURI` method. We just need to pass an owner address and a token URI to this method.  

You can add the following code to the `main` function which we created earlier. 

```ts:no-line-numbers
async function main() {

  /*
  code created earlier 
  */

  const IpfsCid = 'QmZ8Syn28bEhZJKYeZCxUTM5Ut74ccKKDbQCqk5AuYsEnp'

  const txMintToken = await (await collection.mintWithTokenURI(wallet.address, 'https://ipfs.unique.network/ipfs/' + IpfsCid)).wait()
  const tokenId = txMintToken.events?.[1].args?.tokenId.toNumber()
  const tokenUri = await collection.tokenURI(tokenId)

  console.log(`Successfully minted token #${tokenId}, it's URI is: ${tokenUri}`)
}
```

### Result 

Here is the final code that we created during this tutorial: 

```ts:no-line-numbers
```
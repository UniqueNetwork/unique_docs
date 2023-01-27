# General info

[[toc]]

## Intro 

In Unique Network, there is no need to write smart contracts as it is usually required in Ethereum networks.

Unique Network provides emulated smart contracts. This means that if you call a specific address 
where a smart contract is supposed to be, Unique Network will pretend that it has a smart contact there.   
Thus, you can access our node using Ethereum technologies, and the node will respond.

This advantage allows using smart contracts just as libraries from any `.js`, `.ts` or even `.sol` file. 
This article will demonstrate how we call the smart contracts from  
the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

## Prerequisites

You need to have the following installed and prepared to start working with Unique Network   
via Ethereum:

- Node.js, version > 14.
- **npm** or **yarn**.
- Metamask account.

At the moment, we have Opal Testnet. Its websocket URL is `wss://ws-opal.unique.network`  
(rpc endpoint - `https://rpc-opal.unique.network`). 

In Polkadot apps, you can check it using [this link](https://polkadot.js.org/apps/?rpc=wss://ws-opal.unique.network/#/explorer).

You can use [@unique2faucet_opal_bot](https://t.me/unique2faucet_opal_bot) in Telegram to get some **OPL**.

## Set up environment 

### Install and initialize the libraries  

First of all, we need to install the libraries.
To install the required libraries, you can use the following commands. Please note that Hardhat 
must be initialized after the installation.

The second command will prompt to select the project type, please choose *TypeScript* and  
answer *yes* to all questions.

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install --save-dev hardhat @unique-nft/solidity-interfaces @unique-nft/utils @nomicfoundation/hardhat-toolbox dotenv
npx hardhat
npx hardhat test
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add -D hardhat @unique-nft/solidity-interfaces @unique-nft/utils @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers dotenv
yarn hardhat
yarn hardhat test 
```

</CodeGroupItem>
</CodeGroup>


### Connect to network and Metamask account

Create a `.env` file in the root directory of our project, and add your Metamask private key and the network RPC to it.
Follow [these instructions](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key/) 
to export your private key from Metamask. 

Your `.env` should look like this:

```typescript:no-line-numbers
RPC_OPAL="https://rpc-opal.unique.network"
PRIVATE_KEY = "your-metamask-private-key"
```

After this, update your `hardhat.config.ts` so that our project knows about all of these values.   
Please pay attention to the `settings` object in the config file. To successfully compile the smart contracts, 
please use this configuration that enables the IR-based ( intermediate representation) code generator.
Also, we will need to enable the optimizer and set the parameter for it. 

This configuration is required for Solidity versions newer than 0.8.17 (for more details  
please check the [Solidity docs](https://docs.soliditylang.org/en/v0.8.17/ir-breaking-changes.html)). 

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

## Write new smart contract  

After this, we will write a new smart contract that will use this library. Please pay attention that 
we can just import a couple of `.sol` files and use them. 

We will create a new file in the */contracts* folder with the **CollectionManager.sol** name. 
This contract will create a collection and make it ERC721Metadata compatible. 
This simple example demonstrates how you can create your own smart contracts if needed using our library.   

The contract below is [inherited](https://docs.soliditylang.org/en/develop/contracts.html#inheritance) 
from `CollectionHelpersEvents`. You can refer to the `CollectionHelpers.sol` file from the library to learn more.  
The contract contains one function (`createCollection`) that accepts a collection owner address, 
a collection admin address, a collection name, a collection description, a collection symbol and a collection base URI as arguments.  
Then, the function calls the `createNFTCollection` function from our library that creates an NFT collection. 
When the collection is created, our function makes this collection ERC721Metadata compatible.   
Finally, it sets the collection admin and collection owner and returns the address of the created collection.

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
:warning: Make sure that the version defined above (^0.8.17) is the same as the version defined  
in the **hardhat.config.ts** file.

## Deploy smart contract  

Now, when our contract is written (see above) and our configuration file is ready, 
it is time to write the contract deployment script.

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

main().catch(console.error)
```

After this, we are finally ready to deploy our smart contract!  
For this, please run the following command line:

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


## Cross address 

In this section, we would like to provide some details on how the cross address 
works in Ethereum. The cross address is a structure that contains an Ethereum and a Substrate addresses: 

```ts:no-line-numbers
struct CrossAddress {
	address eth;
	uint256 sub;
}
```

:warning: One of these addresses must be zero address. In other case, the blockchain will reject the transaction. 

To clarify, you must specify two addresses in any case. But, one of them must be zero address, and the second one 
must be a valid address. 

## URI and URISuffix

A token has the following properties: `baseURI`, `URI`, `URISuffix`. In this section, we will provide 
some details about them and describe how an URI is returned by our `tokenURI` method when you are trying to get a token URI. 

So, when we are getting a token URI, first of all, we need to check that this collection is ERC721Metadata compatible. 
If this is not so, the error will occur. Then, we check whether the mentioned above properties exist and are not zero address. 

The check is carried out in this order: `URI`, `baseURI`, `URISuffix`. 

1. If the `URI` property is valid (exists and not zero address), then the method returns it.  
   In case the property is invalid, proceed to next check.
2. If the `baseURI` property is valid, then the method returns an empty value.  
   In case the property is invalid, proceed to next check.
3. If the `URISuffix` property is valid, the method returns the `baseURI + URISuffix` value. 
4. After all previous checks failed, the method returns the `baseURI` property value.  

Thus, if the collection is not ERC721Metadata compatible, then you will not be able to get  
the `URI` and `URISuffix` properties at all. 
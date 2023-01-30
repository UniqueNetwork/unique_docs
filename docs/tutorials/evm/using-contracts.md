# Using your own smart contract

In this tutorial, we will use the [Hardhat library](https://hardhat.org/hardhat-runner/docs/guides/project-setup). 
We will create a collection and mint several different tokens (NFT, RFT, fungible) using
the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

Before we start, please make sure that you meet the [prerequisites](eth-general.md#prerequisites) and  
[you environment is set up](eth-general.md#set-up-environment).

### Create NFT collection 

In this section, we will use the contract that is created in the 
[Write a new contract](eth-general.md#write-new-smart-contract) section. 

Let's create a new file in the */scripts* folder called `mintNFT.ts`.

First of all, we will import all needed packages and create the `main` function which 
will contain all our actions.  

Then, we will need to initialize several objects to create a signer for our operations. This requires 
to know the private key of your account. Also, we will need to find our deployed contract by its address 
to be able to work with it. 

When everything is prepared, we can just call the `createCollection` method of our smart contract. As 
we defined, the method accepts a collection owner address, a collection admin address, a collection name, 
a collection description, a collection symbol and a collection base URI as arguments. Also, we need to 
specify the collection creation fee (see [create NFT collection using solidity interfaces](#create-nft-collection-1)
for details).

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

### Set sponsor for smart contract 

In Unique Network, it is possible to enable sponsoring for a smart contract (see 
[Sponsoring](concepts/../../concepts/network-features/sponsoring.md#smart-contract-sponsoring)).

 To do this, we need to call two actions - set sponsor and confirm sponsorship. First action
 (`setSponsor`) accepts the contract address and the sponsor address as parameters. For the second action
 (`confirmSponsorship`), the caller must be same that set by `setSponsor`. The only parameter is the 
 contract address that wil be sponsored.  Also, we need to specify the gas limit to avoid unpredictable spending. 
 
```ts:no-line-numbers
async function main() {
  /*
  code created earlier
  */
  console.log(`Contract address found: ${collectionManager.address}`)
  const contractHelpers = await ContractHelpersFactory(wallet, ethers)

  // ---- second account - sponsor 
  const privateKeySecondary = process.env.PRIVATE_KEY_SECONDARY
  if (!privateKeySecondary) 
    throw new Error('Missing private key')
  const walletConfirm = new ethers.Wallet(privateKeySecondary, provider)
  const contractHelpersConfirm = await ContractHelpersFactory(walletConfirm, ethers)
  // ----

  const setSponsorTx = await (await contractHelpers.setSponsor(
    collectionManager.address, 
    '0x83E02d8ab05913bA7b5A76fA828A95E5118255E8'
  )).wait()

  const confirmSponsorTx = await contractHelpersConfirm.confirmSponsorship(
    collectionManager.address,
    {
      gasLimit: 10_000_000,
    }
  )

  console.log(`New sponsor was set for the contract. The sponsor address: 
    ${Ethereum.parseEthersTxReceipt(setSponsorTx).events.ContractSponsorSet.sponsor}`)
  }
```

To run the created script, you can using the command below: 

<CodeSwitcher name="commandLine">
<template v-slot:npm>

```bash:no-line-numbers
npx hardhat run scripts/mintNFT.ts --network opal
```

</template>
<template v-slot:yarn>

```bash:no-line-numbers
yarn hardhat run scripts/mintNFT.ts --network opal
```

</template>
</CodeSwitcher>
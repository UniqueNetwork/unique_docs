# How to work with Unique Network using Ethereum technologies 

[[toc]]

## Intro 

In this tutorial, we will use the [Hardhat library](https://hardhat.org/hardhat-runner/docs/guides/project-setup). 
We will create a collection and mint several different NFTs using
the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

Before we start, please make sure that you meet the [prerequisites](eth-general.md#prerequisites) and  
[you environment is set up](eth-general.md#set-up-environment).

## Using your own smart contract

### Create an NFT collection 

In this section, we will use the contract that is created in the 
[Write a new contract](eth-general.md#write-a-new-smart-contract) section. 

Let's create a new file in the */scripts* folder called `createCollection.ts`.

First of all, we will import all needed packages and create the `main` function which 
will contain all our actions.  

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

Now, when we demonstrated how to work with contracts that you can create on your own, let's proceed to
 our [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library. 
 All further actions will be performed using it. 

:warning: Starting from this section, we will add more and more different actions to one script file. 
In the end, we will get one function that carries out all actions in one single execution. 

Let's initialize the needed objects, our config file and also create an array of cids for the future. 
The code below demonstrates how to create a new collection using our library. 
The code looks shorter and cleaner comparing to the previous section where we used the manual created smart contract. 

We would like to draw your attention to the fact that the collection creation at Unique chains costs some price, 
and additional collection creation price is 2 UNQ or QTZ. Via Substrate API 
this sum is being hold automatically, while via Eth RPC API it is required to pass
this value manually. But in order not to pass this constant manually (because it may change somewhen later)
there is a useful helper `collectionHelpers.collectionCreationFee()` which   returns
real necessary value to send to create a collection. 

Thus, to create a usual collection will cost around ~2.3 UNQ, where 2 UNQ  
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

The ERC721Metadata interface is an optional interface to add other metadata details to  
your [ERC721](https://eips.ethereum.org/EIPS/eip-721) NFTs. 
The developers can choose to add a token name, a token symbol, and a token URI as metadata to an ERC721 token. 
If you want to use these metadata fields for tokens, you can make the created collection the ERC721Metadata compatible. 

Please note that the collection, that we created in the [using your own smart contract](#using-your-own-smart-contract) 
section, is already ERC721Metadata compatible. 

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

Now, when we created the collection, let's proceed to minting NFTs. For this, we will need 
to use the `UniqueNFTFactory` object and initialize it using id of the created collection. 
After this, we can just call the corresponding method (`mint`) to create an new NFT. 
The only argument for this method is the owner address. 

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

This example will use the [Cross Address](eth-general.md#cross-address). 

We can use the `mintCross` method that accepts as the first argument the `CrossAddress` structure.  
The second parameter is the properties array. In this example, we will set only one property (`URISuffix`).

Please refer to the code sample below that demonstrates how to mint a token using an Ethereum address. 
You can add the following code to the `main` function which we created earlier. 

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

As we mentioned, it is possible to specify either Ethereum, or Substrate address in the cross address.  
So, let's demonstrate how to use the Substrate address for the same operation.  

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

### Mint an NFT with token URI 

There is a way to mint a token and specify its tokenURI in one action. For this, we can use  
the `mintWithTokenURI` method. We just need to pass an owner address and a token URI to this method.    
To learn more about token URI, please refer to the [URI and URISuffix](eth-general.md#uri-and-urisuffix) section.

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

To create an NFT with the token suffix, you need to mint an NFT first using the common `mint` method, 
and then use the `setProperties` method to set the `URISuffix` property.  
To learn more about token URI, please refer to the [URI and URISuffix](eth-general.md#uri-and-urisuffix) section.

Please keep in mind that you can set any property this way. Also, just in case, we would like to remind 
you that we already set this property in different way in the [mint with cross address](#mint-with-cross-address) section.

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

Here is the final code that we created during this tutorial. It creates a new collection, 
makes it ERC721Metadata compatible and mints 4 NFTs in different ways and with different property values.  

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
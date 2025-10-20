# Using Solidity interfaces library

## Intro

Now, when we demonstrated how to work with contracts that you can create on your own, let's proceed to
our [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.
All further actions will be performed using it.  
 Please note that we **do not need Hardhat** anymore for further
operations. Everything can be done using standard [ethers](https://docs.ethers.org/v5/) library. Also, scripts
can be launched without using Hardhat.

In this tutorial, we will create a collection and mint several different tokens (NFT, RFT, fungible) using
the [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces) library.

Before we start, please make sure that you meet the [prerequisites](eth-general.md#prerequisites) and  
[you environment is set up](eth-general.md#set-up-environment).

## NFT

### Create NFT collection

:bell: Starting from this section, we will add more and more different actions to one script file.  
So, all imports are global variables will be the same as in this section.

Let's initialize the needed objects, our config file and also create an array of cids for the future.
The code below demonstrates how to create a new collection using our library.
The code looks shorter and cleaner comparing to the previous section where we used the manual created smart contract.

:exclamation: We would like to draw your attention to the fact that the collection creation at Unique chains costs some price,
and additional collection creation price is 2 UNQ. Via Substrate API
this sum is being hold automatically, while via Eth RPC API it is required to pass
this value manually. But in order not to pass this constant manually (because it may change somewhen later)
there is a useful helper `collectionHelpers.collectionCreationFee()` which returns
real necessary value to send to create a collection.

Thus, to create a usual collection will cost around ~2.3 UNQ, where 2 UNQ  
must be paid via `{value: await collectionHelpers.collectionCreationFee()}` field in the transaction.
And the rest ~0.3 UNQ will be hold automatically in the form of gas cost.

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from 'ethers'
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
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-opal.unique.network')
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) throw new Error('Missing private key')
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

### Mint NFT token

Now, when we created the collection, let's proceed to minting NFTs. For this, we will need
to use the `UniqueNFTFactory` object and initialize it using id of the created collection.
After this, we can just call the corresponding method (`mint`) to create an new NFT.
The only argument for this method is the owner address.

:exclamation: Please note that if we do not specify a token URI, the base URI will be returned  
(see the [URI and URISuffix](tutorials/evm/../../eth-general.md#uri-and-urisuffix) section).

You can add the following code to the `main` function which we created earlier.

```ts:no-line-numbers
async function main() {
  /*
  code created earlier
  */
  const collection = await UniqueNFTFactory(collectionId, wallet, ethers)

  const txMintToken = await (await collection.mint(wallet.address)).wait()

  const tokenId = txMintToken.events?.[0].args?.tokenId.toString()

  console.log(`Successfully minted token #${tokenId}`)
}
```

### Mint NFT token with cross address

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

### Mint NFT with token URI

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

### Mint NFT with a token suffix

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

## RFT

### Create RFT collection

Besides NFT collections, you can also create a refungible collections in Unique Networks. For more details about
this collection type please refer to [Refungibility](concepts/../../concepts/network-features/refungibility.md).

To create a RFT collection, you can use the same `collectionHelpers` object that we initialized in previous sections.
The arguments that we need to pass is pretty the same as for NFT collections - name, description and token prefix.
Also, we have to specify the collection creation fee.  
This fee is explained in detail in the the [create an NFT collection](#create-an-nft-collection-1) section.

```ts:no-line-numbers
async function main() {
  // define a provider
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-opal.unique.network')
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey) throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)

  let newRFTCollection = await ( await collectionHelpers.createRFTCollection(
    'My new RFT collection',
    'This RFT collection is for testing purposes',
    'RFC',
    {
      value: await collectionHelpers.collectionCreationFee(),
    }
  )).wait()

  const collectionAddressRFT = newCollection.events?.[0].args?.collectionId as string
  const collectionIdRFT = Address.collection.addressToId(collectionAddressRFT)

  console.log(`RFT collection created! Address: ${collectionAddressRFT} , id: ${collectionIdRFT}`)
}
```

### Mint refungible token

After we created the RFT collection, we can mint tokens in it. Minting RFT is quite simple, we just need to
use the corresponding object (`UniqueRefungibleFactory`) and its `mint` method. The only argument that we need
to use is the owner address.

However, since this is the RFT token, we would need to divide it into several pieces. For this, right after the token
is minted, we can call the `repartition` method and pass the required number of pieces to it.

The method belongs to the `UniqueRefungibleTokenFactory` object. When initializing this object, we need
to specify the collection id and the token id.

```ts:no-line-numbers
async function main() {
  /*
  code created earlier
  */
  const collectionRFT = await UniqueRefungibleFactory(collectionIdRFT, wallet, ethers)

  const txMintRFTToken = await (await collectionRFT.mint(wallet.address)).wait()

  const tokenIdRFT = Number(Ethereum.parseEthersTxReceipt(txMintRFTToken).events.Transfer.tokenId)
  console.log(`RFT token minted. Id: ${tokenIdRFT}`)

  const rftFactory = await UniqueRefungibleTokenFactory(
    {
      collectionId: collectionIdRFT,
      tokenId: tokenIdRFT,
    },
    wallet,
    ethers
  )

  const txRepart = await (await rftFactory.repartition(10n)).wait()

  console.log(`${Ethereum.parseEthersTxReceipt(txRepart).events.Transfer.value} new pieces were created.
  One piece remained on the original place.`)
}
```

## Fungible

### Create fungible collection

The third type of the collection is fungible. In this collection, we can mint fungible (ERC-20) tokens.
The `createFTCollection` method is also available in the `collectionHelpers` object that we initialized in the
previous sections.

Creating fungible collections has some specifics comparing to the NFT and RFT collections. The key difference is that
we must specify the `decimals` argument. To learn more about decimals, you can refer to the [ERC-20 standard](https://docs.openzeppelin.com/contracts/3.x/erc20#a-note-on-decimals).

:bell: The maximum value for decimals is 30.

Also, we need to specify the gas limit (more than this value will not be hold from you), and the collection creation fee.
This fee is explained in detail in the the [create an NFT collection](#create-an-nft-collection-1) section.

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from 'ethers'
import {
  CollectionHelpersFactory,
  UniqueFungibleFactory
} from '@unique-nft/solidity-interfaces'
import {Ethereum} from '@unique-nft/utils/extension'
import {Address} from '@unique-nft/utils'

dotenv.config()

async function main() {
  // define a provider using the Opal RPC
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.unq.uniq.su')
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey) throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)

  const newFTcollection = await (await collectionHelpers.createFTCollection(
    'My new FT collection',
    10, // decimals
    'This FT collection is for testing purposes',
    'FC',
    {
      gasLimit: 10_000_000,
      value: await collectionHelpers.collectionCreationFee(),
    }
  )).wait()

  const collectionAddressFT = Ethereum.parseEthersTxReceipt(newFTcollection).events.CollectionCreated.collectionId
  const collectionIdFT = Address.collection.addressToId(collectionAddressFT)

  console.log(`FT collection created! Address: ${collectionAddressFT}, id: ${collectionIdFT}`)
}

main().catch(console.error)
```

### Mint fungible token

After the fungible collection is created, we can mint tokens in it. For this, we will need to initialize the
`UniqueFungibleFactory` object and call its `mint` method. The arguments that the method accepts are the
address of the owner and the number of fungible tokens that we want to mint.

```ts:no-line-numbers
async function main() {
  /*
  code created earlier
  */
  const collectionFT = await UniqueFungibleFactory(collectionIdFT, wallet, ethers)

  const txMintFT = await (await collectionFT.mint(wallet.address, 50)).wait()
  console.log(Ethereum.parseEthersTxReceipt(txMintFT).events.Transfer.value.toString(),
    'fungible tokens were minted.')
}
```

## Generic

### Make collection 721Metadata compatible

The ERC721Metadata interface is an optional interface to add other metadata details to  
your [ERC721](https://eips.ethereum.org/EIPS/eip-721) NFTs.
The developers can choose to add a token name, a token symbol, and a token URI as metadata to an ERC721 token.
If you want to use these metadata fields for tokens, you can make the created collection the ERC721Metadata compatible.

Please note that the collection, that we created in the [using your own smart contract](#using-your-own-smart-contract)
section, is already ERC721Metadata compatible, because we included the corresponding method call to the contract.

To make the collection ERC721Metadata compatible, we need to specify the collection address and the base URI.

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

### Set sponsor for collection

It is possible to enable sponsorship for a collection. To learn more about this feature, please refer to the
[Sponsoring](concepts/../../concepts/network-features/sponsoring.md) section.

To enable sponsoring, we will need a second account who will be actually a sponsor. So, we need to initialize a
new wallet instance for this account, and also a new collection instance so we can confirm a sponsorship.

When we prepare needed objects, we need to perform two operations: set a sponsor and confirm sponsorship. The first
operation is signed by our regular account, and we specify our sponsor in the `setCollectionSponsorCross` method. Please note
that we use the cross address here (see [Cross Address](tutorials/../eth-general.md#cross-address)).
Then, we call and sign the `confirmCollectionSponsorship` method by our sponsor account.

```ts:no-line-numbers
async function main() {
  /*
  code created earlier
  */
 // -- second account - sponsor
  const privateKeySecondary = process.env.PRIVATE_KEY_SECONDARY
  if (!privateKeySecondary) throw new Error('Missing private key for second account')
  const walletConfirm = new ethers.Wallet(privateKeySecondary, provider)
  const collectionConfirm = await UniqueNFTFactory(collectionId, walletConfirm, ethers)
  // --

  const txSponsor = await (await collection.setCollectionSponsorCross(
    {
      eth: '0x83E02d8ab05913bA7b5A76fA828A95E5118255E8',
      sub: 0n,
    },
  )).wait()

  const txConfirm = await (await collectionConfirm.confirmCollectionSponsorship({
    gasLimit: 10_000_000,
  })).wait()

  console.log(`Sponsor was set. The current sponsor is 0x83E02d8ab05913bA7b5A76fA828A95E5118255E8`)
}
```

### Transfer token

If needed we can easily transfer any token to a new owner. For this, we just need to call the `transfer` method
and pass a new owner address along with the token id to it. Please check the code below.

```ts:no-line-numbers
const txTransfer = await (await collection.transfer(
  '0x1B7AAcb25894D792601AAEEEd34E07Ed14Fd31eB',
  tokenId
)).wait()

console.log(`Token transferred!`)
```

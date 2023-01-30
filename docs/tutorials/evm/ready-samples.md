
# Ready to use samples

You can find the complete code that we created in this section. 

To run scripts, you can use the following commands (where `--opal` is the network specified  
in the `hardhat.config.ts` file):

<CodeSwitcher name="commandLine">
<template v-slot:npm>

```bash:no-line-numbers
npx hardhat run scripts/mintNFT.ts --network opal
npx hardhat run scripts/mintRFT.ts --network opal
npx hardhat run scripts/mintFT.ts --network opal
```

</template>
<template v-slot:yarn>

```bash:no-line-numbers
yarn hardhat run scripts/mintNFT.ts --network opal
yarn hardhat run scripts/mintRFT.ts --network opal
yarn hardhat run scripts/mintFT.ts --network opal
```

</template>
</CodeSwitcher>

### Mint NFT

**mintNFT.ts**

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

  // Enable collection sponsoring. For this, we will need second account 
  const privateKeySecondary = process.env.PRIVATE_KEY_SECONDARY
  if (!privateKeySecondary) 
    throw new Error('Missing private key')
  const walletConfirm = new ethers.Wallet(privateKeySecondary, provider)
  const collectionConfirm = await UniqueNFTFactory(collectionId, walletConfirm, ethers)
  // --------
  const txSponsor = await (await collection.setCollectionSponsorCross(
    {
      eth: '0x83E02d8ab05913bA7b5A76fA828A95E5118255E8',
      sub: 0n,
    },
  )).wait()

  const txConfirm = await (await collectionConfirm.confirmCollectionSponsorship({
    gasLimit: 10_000_000,
  })).wait()
  
  const currentSponsor = await collectionConfirm.collectionSponsor()
  console.log(`Sponsor was set. The current sponsor is 0x83E02d8ab05913bA7b5A76fA828A95E5118255E8`)

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
### Mint RFT 

**mintRFT.ts**

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from 'hardhat'
import {
  CollectionHelpersFactory,
  UniqueRefungibleFactory,
  UniqueRefungibleTokenFactory,
} from '@unique-nft/solidity-interfaces'
import {Ethereum} from '@unique-nft/utils/extension'
import {Address} from '@unique-nft/utils'

dotenv.config()

async function main() {
  // define a provider
  const provider = ethers.provider
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey) throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)

  // create a new collection
  let newCollection = await (
    await collectionHelpers.createRFTCollection(
      'My new RFT collection',
      'This RFT collection is for testing purposes',
      'RFC',
      {
        value: await collectionHelpers.collectionCreationFee(),
      }
    )
  ).wait()

  const collectionAddressRFT = newCollection.events?.[0].args?.collectionId as string
  const collectionIdRFT = Address.collection.addressToId(collectionAddressRFT)

  console.log(`RFT collection created! Address: ${collectionAddressRFT} , id: ${collectionIdRFT}`)

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

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

```

### Mint Fungible 

**mintFT.ts** 

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from 'hardhat'
import {
  CollectionHelpersFactory, 
  UniqueFungibleFactory
} from '@unique-nft/solidity-interfaces'
import {Ethereum} from '@unique-nft/utils/extension'
import {Address} from '@unique-nft/utils'

dotenv.config()

async function main() {
  // define a provider
  const provider = ethers.provider
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey) throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)

// create a fungible collection
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

  // mint fungible tokens 
  const collectionFT = await UniqueFungibleFactory(collectionIdFT, wallet, ethers)

  const txMintFT = await (await collectionFT.mint(wallet.address, 50)).wait()
  console.log(`${Ethereum.parseEthersTxReceipt(txMintFT).events.Transfer.value} fungible tokens were minted. `)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
```
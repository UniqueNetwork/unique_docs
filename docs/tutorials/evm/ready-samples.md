
# Ready to use samples

You can find the complete code that we created in this section. 

To run scripts, you can use the following commands. Make sure that you installed the [tsx](https://www.npmjs.com/package/tsx) 
package to run scripts. 

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npx tsx mintNFT.mts
npx tsx mintRFT.mts
npx tsx mintFT.mts
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn tsx mintNFT.mts
yarn tsx mintRFT.mts
yarn tsx mintFT.mts
```

</CodeGroupItem>
</CodeGroup>

### Mint NFT

**mintNFT.mts**

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from 'ethers'
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
  // define a provider using the Opal RPC
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-opal.unique.network')
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)


  ///////////////////////////////////////////
  // Create a new collection
  ///////////////////////////////////////////
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
  
  const collection = await UniqueNFTFactory(collectionId, wallet, ethers)


  ///////////////////////////////////////////
  // Make ERC721Metadata
  ///////////////////////////////////////////
  const txMake = await (
    await collectionHelpers.makeCollectionERC721MetadataCompatible(
      collectionAddress,
      'https://ipfs.unique.network/ipfs/'
    )
  ).wait()

  console.log('The ERC721Metadata flag was set to true.')


  ///////////////////////////////////////////
  // Enable collection sponsoring. For this, we will need second account 
  ///////////////////////////////////////////
  const privateKeySecondary = process.env.PRIVATE_KEY_SECONDARY
  if (!privateKeySecondary) 
    throw new Error('Missing private key')
  const walletConfirm = new ethers.Wallet(privateKeySecondary, provider)
  const collectionConfirm = await UniqueNFTFactory(collectionId, walletConfirm, ethers)

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


  ///////////////////////////////////////////
  // Mint NFT 
  ///////////////////////////////////////////
  const txMintToken = await (await collection.mint(wallet.address)).wait()

  const tokenId = txMintToken.events?.[0].args?.tokenId.toString()
  console.log(`Successfully minted token #${tokenId}`)
  

  ///////////////////////////////////////////
  // Mint with URI
  ///////////////////////////////////////////
  const txMintTokenWithURI = await (await collection.mintWithTokenURI(wallet.address, 
    'https://ipfs.unique.network/ipfs/' + tokenIpfsCids['1'])).wait()

  const tokenIdWithURI = txMintTokenWithURI.events?.[1].args?.tokenId.toNumber()
  const tokenUriWithURI = await collection.tokenURI(tokenIdWithURI)

  console.log(`Successfully minted token #${tokenIdWithURI}, 
    it's URI is: ${tokenUriWithURI}`)


  ///////////////////////////////////////////
  // Mint with suffix and then re-write its value
  ///////////////////////////////////////////
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
  const tokenIdWithSuffix = parsedTxReceipt.events.Transfer.tokenId.toString()
  console.log(`Successfully minted token with cross address. Id: ${tokenIdWithSuffix}`)

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

main().catch(console.error)
```
### Mint RFT 

**mintRFT.mts**

```ts:no-line-numbers
import dotenv from 'dotenv'
import {ethers} from 'ethers'
import {
  CollectionHelpersFactory,
  UniqueRefungibleFactory,
  UniqueRefungibleTokenFactory,
} from '@unique-nft/solidity-interfaces'
import {Ethereum} from '@unique-nft/utils/extension'
import {Address} from '@unique-nft/utils'

dotenv.config()

async function main() {
  // define a provider using the Opal RPC
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-opal.unique.network')
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey) throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)


  ///////////////////////////////////////////
  // Create a new RFT collection
  ///////////////////////////////////////////
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


  ///////////////////////////////////////////
  // Make ERC721Metadata compatible 
  ///////////////////////////////////////////
  const txMake = await (
    await collectionHelpers.makeCollectionERC721MetadataCompatible(
      collectionAddressRFT,
      'https://ipfs.unique.network/ipfs/'
    )
  ).wait()

  console.log('The ERC721Metadata flag was set to true.')


  ///////////////////////////////////////////
  // Mint RFT 
  ///////////////////////////////////////////
  const collectionRFT = await UniqueRefungibleFactory(collectionIdRFT, wallet, ethers)

  const txMintRFTToken = await (
    await collectionRFT.mintWithTokenURI(
      wallet.address,
      'https://ipfs.unique.network/ipfs/' + tokenIpfsCids['1']
    )
  ).wait()

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

main().catch(console.error)
```

### Mint Fungible 

**mintFT.mts** 

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
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-opal.unique.network')
  // Create a signer
  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey) throw new Error('Missing private key')
  const wallet = new ethers.Wallet(privateKey, provider)

  const collectionHelpers = await CollectionHelpersFactory(wallet, ethers)


  ///////////////////////////////////////////
  // Create a fungible collection
  ///////////////////////////////////////////
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

  ///////////////////////////////////////////
  // Mint fungible tokens 
  ///////////////////////////////////////////
  const collectionFT = await UniqueFungibleFactory(collectionIdFT, wallet, ethers)

  const txMintFT = await (await collectionFT.mint(wallet.address, 50)).wait()
  console.log(`${Ethereum.parseEthersTxReceipt(txMintFT).events.Transfer.value} fungible tokens were minted. `)
}
main().catch(console.error)
```
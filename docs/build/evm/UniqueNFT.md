# UniqueNFT

The [UniqueNFT.sol](https://github.com/UniqueNetwork/unique-chain/blob/develop/pallets/nonfungible/src/stubs/UniqueNFT.sol) smart contract is the Unique Network NFT representation for our Ethereum facade. 

### Collection Id to Ethereum contract address conversion

To convert a Collection Id to a Collection Address (emulated smart contract in fact), it is enough to concatenate the  `0x17c4e6453cc49aaaaeaca894e6d9683e` prefix and the collection number in HEX format with 8 symbols length.

The sample code:

```typescript:no-line-numbers
const collectionIdToAddress = (collectionId: number): string => {
  if (collectionId >= 0xffffffff || collectionId < 0) {
    throw new Error('id overflow')
  }
  
  return Web3.utils.toChecksumAddress(
    '0x17c4e6453cc49aaaaeaca894e6d9683e' + 
    collectionId.toString(16).padStart(8, '0')
  )
}
```

Another sample:

```typescript:no-line-numbers
const collectionAddress = Web3.utils.toChecksumAddress(
  '0x17c4e6453cc49aaaaeaca894e6d9683e' + 
  collectionId.toString(16).padStart(8, '0')
)
```

### Ethereum contract address to Collection Id 

If a smart contract address is known, it is possible to perform reverse operation - convert Collection Address (of emulated smart contract) to a Collection Id. This is an unambiguous process in both directions. 

For this, we just extract last 8 symbols from the address and convert it to unsigned integer value:

Sample code: 

```typescript:no-line-numbers
const extractCollectionIdFromAddress = (address: string): number => {
  if (!([40, 42].includes(address.length))) {
    throw new Error('address wrong format')
  }
  
  return parseInt(address.slice(-8), 16)
}
```

Another sample:

```typescript:no-line-numbers
const collectionId = parseInt(address.slice(-8), 16)
```

### Live converter

You can use the converter below to easily convert Collection Id to Collection Address and vice versa. 

<br/>
<CollectionAddressCoder/>

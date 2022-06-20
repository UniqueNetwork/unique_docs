# UniqueNFT

[UniqueNFT.sol](https://github.com/UniqueNetwork/unique-chain/blob/develop/pallets/nonfungible/src/stubs/UniqueNFT.sol)
Unique network’s NFT representation for our eth facade

#### Collection Id to Ethereum contract address conversion

Conversion from Collection Id to Collection's emulated smart contract Address 
is actually concatenation of prefix `0x17c4e6453cc49aaaaeaca894e6d9683e` 
with collection number in hex form, 8 symbols length.

An example:

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

An example two:
```typescript:no-line-numbers
const collectionAddress = Web3.utils.toChecksumAddress(
  '0x17c4e6453cc49aaaaeaca894e6d9683e' + 
  collectionId.toString(16).padStart(8, '0')
)
```

Conversion from Collection's emulated smart contract Address to Collection Id is 
the opposite operation, just extracting last 8 symbols from the address and 
converting it to unsigned integer:

```typescript:no-line-numbers
const extractCollectionIdFromAddress = (address: string): number => {
  if (!([40, 42].includes(address.length))) {
    throw new Error('address wrong format')
  }
  
  return parseInt(address.slice(-8), 16)
}
```

An example two:
```typescript:no-line-numbers
const collectionId = parseInt(address.slice(-8), 16)
```

#### Live converter

<br/>
<CollectionAddressCoder/>

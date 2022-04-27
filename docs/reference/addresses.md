# Addresses

<SubEthCoder/>

### Collection Id to Ethereum contract address conversion

Conversion from Collection Id to emulated smart contract Address:

```typescript
const collectionIdToAddress = (collectionId: number): string => {
    if (collectionId >= 0xffffffff || collectionId < 0) throw new Error('id overflow');
    const buf = Buffer.from([0x17, 0xc4, 0xe6, 0x45, 0x3c, 0xc4, 0x9a, 0xaa, 0xae, 0xac, 0xa8, 0x94, 0xe6, 0xd9, 0x68, 0x3e,
        collectionId >> 24,
        (collectionId >> 16) & 0xff,
        (collectionId >> 8) & 0xff,
        collectionId & 0xff,
    ]);
    return Web3.utils.toChecksumAddress('0x' + buf.toString('hex'));
}
```

Conversion from emulated smart contract Address to Collection Id:

```typescript
const extractCollectionIdFromAddress = (address: string): number => {
    if (!(address.length === 42 || address.length === 40)) throw new Error('address wrong format');
    return parseInt(address.substr(address.length - 8), 16);
}
```

Live Converter:

<CollectionAddressCoder/>

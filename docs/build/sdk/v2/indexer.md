# Unique SDK indexer

::: warning
The Unique SDK v2 is in alpha and may contain bugs or incomplete features. For production use or to access more stable functionality, please refer to the [documentation for the previous version](../getting-started.md) of the SDK.
:::

[[toc]]


This SDK provides a typed wrapper around Axios to interact with the Unique Network blockchain indexer API. Below are some real-world use cases to help you get started.

## API Endpoints

- **Unique Network**
  - endpoint: `https://api-unique.uniquescan.io/v2`
  - [Swagger UI](https://api-unique.uniquescan.io/v2/documentation)
  - [Scalar UI](https://api-unique.uniquescan.io/v2/reference)

- **Opal Network**
  - endpoint: `https://api-opal.uniquescan.io/v2`
  - [Swagger UI](https://api-opal.uniquescan.io/v2/documentation)
  - [Scalar UI](https://api-opal.uniquescan.io/v2/reference)

## SDK Initialization

To start using the SDK, initialize the `UniqueIndexer` client with the desired base URL:

```typescript
import { UniqueIndexer } from '@unique-nft/sdk';

const indexerClient = UniqueIndexer({ baseUrl: 'https://api-unique.uniquescan.io/v2' });
```

## Examples

## Use Cases and Code Samples

### Fetch the Last 5 Blocks

Retrieve the last 5 blocks from the blockchain in descending order by block number.

```typescript
const getLastBlocks = async () => {
  const indexerClient = UniqueIndexer({baseUrl: 'https://api-unique.uniquescan.io/v2'});

  const blocks = await indexerClient.blocks({limit: 5, orderByNumber: 'desc'});

  console.log('Last blocks', blocks);
};
```

### Fetch the First 5 Blocks of the Current Year

Retrieve the first 5 blocks from the blockchain in ascending order by block number, starting from January 1st of the current year.

```typescript
const getFirstBlocksInThisYear = async () => {
  const indexerClient = UniqueIndexer({baseUrl: 'https://api-unique.uniquescan.io/v2'});
  const startDate = new Date(`${new Date().getFullYear()}-01-01`);

  const blocks = await indexerClient.blocks({limit: 5, orderByNumber: 'asc', timestampFrom: startDate});

  console.log('First blocks in this year', blocks);
};
```

### Fetch a Single Block by Hash

Retrieve a single block from the blockchain using its hash.

```typescript
const getSingleBlockByHash = async () => {
  const indexerClient = UniqueIndexer({baseUrl: 'https://api-unique.uniquescan.io/v2'});

  const block = await indexerClient.block({hashOrNumber: '0xd2fcbc0a3be6a34e93d4201ca9ffbeae18931471d62a2dcb3b1c4f4da180a6d0'});

  console.log('Single block by hash', block);
};
```

### Fetch a Single Block by Number

Retrieve a single block from the blockchain using its number.

```typescript
const getSingleBlockByNumber = async () => {
  const indexerClient = UniqueIndexer({baseUrl: 'https://api-unique.uniquescan.io/v2'});

  const block = await indexerClient.block({hashOrNumber: 333});

  console.log('Single block by number', block);
};
```

### Fetch All Extrinsic Sections and Methods

Retrieve all available extrinsic sections and methods from the blockchain. This information is useful for filtering extrinsics.

```typescript
const getAllExtrinsicSectionsAndMethods = async () => {
  const indexerClient = UniqueIndexer({baseUrl: 'https://api-unique.uniquescan.io/v2'});

  const extrinsics = await indexerClient.extrinsicSections();

  console.log('All extrinsic sections and methods', extrinsics);
};
```

### Fetch Extrinsics by Section and Method

Retrieve extrinsics filtered by specific sections and methods.

```typescript
const getExtrinsicsBySectionAndMethod = async () => {
  const indexerClient = UniqueIndexer({ baseUrl: 'https://api-unique.uniquescan.io/v2' });

  const balanceTransfers = await indexerClient.extrinsics({
    sectionIn: ['balances'],
    methodIn: ['transfer', 'transferAll', 'transferKeepAlive', 'transferAllowDeath'],
  });

  console.log('Extrinsics by section and method', balanceTransfers);
};
```

### Fetch Extrinsics by Signer

Retrieve extrinsics filtered by the signer's address.

```typescript
const getExtrinsicsBySigner = async () => {
  const indexerClient = UniqueIndexer({baseUrl: 'https://api-unique.uniquescan.io/v2'});

  const balanceTransfers = await indexerClient.extrinsics({ signerIn: ['5H684Wa69GpbgwQ7w9nZyzVpDmEDCTexhRNmZ7mkqM1Rt7dH'] });

  console.log('Extrinsics by signer', balanceTransfers);
};
```

### Search Collections

Retrieve collections based on multiple search criteria such as name, description, admin, owner, sponsor, and various sorting options.

```typescript
const searchCollections = async () => {
  const indexerClient = UniqueIndexer({ baseUrl: 'https://api-unique.uniquescan.io/v2' });

  const collections = await indexerClient.collections({
    nameLike: '%substra%',
    descriptionLike: '%First NFT collection%',
    adminIn: ['5F6TPxrxZBhhpvRA8Lu1PWjcpoeoEkAQ4TVALpaxgenTU3sM'],
    ownerIn: ['5H684Wa69GpbgwQ7w9nZyzVpDmEDCTexhRNmZ7mkqM1Rt7dH'],
    sponsorIn: ['5H684Wa69GpbgwQ7w9nZyzVpDmEDCTexhRNmZ7mkqM1Rt7dH'],
    isBurned: false,
    orderByCollectionId: 'asc',
    orderByLastTokenId: 'desc',
    orderByName: 'asc',
    orderByCreatedAtBlockNumber: 'asc',
    orderByUpdatedAtBlockNumber: 'asc',
  });

  console.log('Collections', collections);
};
```

### Search NFTs

Retrieve NFTs based on various search criteria such as collection ID, token ID, ownership, royalty recipients, attributes, and sorting options.

```typescript
const searchNfts = async () => {
  const indexerClient = UniqueIndexer({ baseUrl: 'https://api-unique.uniquescan.io/v2' });

  const nfts = await indexerClient.nfts({
    collectionIdIn: ['1', '0x17C4e6453cC49AAaaEaCA894E6D9683e00000001'],
    tokenIdIn: [1],
    isBurned: false,
    royaltyRecipientIn: ['5Gus5r7HSZv9ScdaTNVbFMBEsxMtc4cZBPTLfJJbLXQK8m9d'],
    attributeTraitTypeIn: ['traits'],
    attributeValueIn: ['Up Hair', 'Teeth Smile'],
    isBundle: false,
    ownerIn: ['5FZeTmbZQZsJcyEevjGVK1HHkcKfWBYxWpbgEffQ2M1SqAnP'],
    orderByCollectionId: 'asc',
    orderByTokenId: 'asc',
    orderByCreatedAtBlockNumber: 'asc',
  });

  console.log('NFTs', nfts);
};
```

### Search Accounts

Retrieve accounts based on various search criteria such as address, mirror address, smart contract status, signer status, and whether the account is an Ethereum address.

```typescript
const searchAccounts = async () => {
  const indexerClient = UniqueIndexer({ baseUrl: 'https://api-unique.uniquescan.io/v2' });

  const accounts = await indexerClient.accounts({
    addressIn: ['5H1La78VqPKMeyzL129N2E5PBeS8rdLqoKhsM5LGxS2Y8xtR'],
    mirrorIn: ['0xdA9bC709172FD24505D356000BF6524065E86B57'],
    isSmartContract: false,
    isSigner: true,
    isEthereum: false,
  });

  console.log('Accounts', accounts);
};
```


### Fetch Event Sections

Retrieve all available event sections from the blockchain.

```typescript
const eventsSections = async () => {
  const indexerClient = UniqueIndexer({ baseUrl: 'https://api-unique.uniquescan.io/v2' });
  const sections = await indexerClient.eventSections();

  console.log('Event sections', sections);
};
```


### Search Events

Retrieve events from the blockchain based on specific criteria such as section, method, and block number range.

```typescript
const searchEvents = async () => {
  const indexerClient = UniqueIndexer({ baseUrl: 'https://api-unique.uniquescan.io/v2' });

  const events = await indexerClient.events({
    sectionIn: ['balances'],
    methodIn: ['Transfer'],
    blockNumberFrom: 1000000,
    blockNumberTo: 2000000,
  });

  console.log('Events', events);
};
```

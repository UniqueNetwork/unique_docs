# How to create a marketplace from scratch

Here we will show you all the necessary things and pitfalls you need to know about when attempting to make your own marketplace.

Full demo can be found [here](https://github.com/UniqueNetwork/insert-your-marketplace-name)

## Main idea

NFT marketplace is similar to a regular real-world marketplace of digital goods. The main difference is that user doesn't pay, but instead transfers tokens (money) to marketplace account and receives "goods" (NFT) at the address used to transfer money.

Below we will describe main operations that you will need in order to create a marketplace. Keep in mind that it's just a simplified concept to give you an idea of how to execute main actions using blockchain.

## Prerequisites:
1. Main wallet that will accept money from buyers and hold selling tokens
2. DB of sorts to store data about tokens on sale and their prices. In our examples, we will use json file as our db for simplicity
3. Frontend should know the address of marketplace wallet - the one that holds tokens. In our example we will receive it via back-end request on /settings
4. We will use polkadot.js extension as the main source for users to subscribe to transactions and maintain accounts.
5. Marketplace wallet should always have some funds on it to cover transaction fees

[Extension can be found here](https://polkadot.js.org/extension/)

## Manage accounts

Before we begin we need a way to manage accounts. Select an account that will be used for buying/selling as well as represent it balance.

```ts
import { web3Accounts, web3Enable, web3EnablePromise } from '@polkadot/extension-dapp';

const getAccounts = async () => {
  // check that library is initialized and ready to read extension data
  if (!web3EnablePromise) {
      // check that extension is installed and working
      let extensions = await web3Enable('my cool dapp');
      if (extensions.length !== 0) {
        // get accounts from polkadot's extension
        const _accounts = await web3Accounts();
        return _accounts;
      }
  }
  throw new Error('Polkadotjs extension is not installed');
}

const getBalance = async (account) => {
    if (!account?.address) return;
    const { address } = account;
    const { availableBalance } = await sdkClient.balance.get({ address })
    setBalance(`${availableBalance.formatted} ${tokenSymbol}`);
};
let accounts = await getAccounts();
let selectedAccount = accounts[0];

const selectAccountBalance = await getBalance(selectedAccount);
```
## How to sell

Before some one can buy a token it should be placed on sale. Sale is represented as "offer" which is basically a token on an account and a record in DB about the price.

```ts
// TODO: link to guide on how to sign transactions with extension when using SDK
```
1. Get user tokens.
For that matter we will be using unique-scan API since there's no on-chain solution to get all user tokens.
```ts
const getTokens = async (address: string): Promise<ScanTokenEntity[]> => {
const body = JSON.stringify({
  "operationName": "getTokens",
  "variables": {
    "where": {
      "_and": [
        {
          "_or": [
            {
              "owner": {
                "_eq": address
              }
            },
            {
              "owner_normalized": {
                "_eq": address
              }
            }
          ]
        },
      ]
    }
  },
  "query": GqlQuery
});

const response = await fetch(config.scanUrl || '', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body,
});

if (response?.ok) {
  const { data } = await response.json();
  return data.tokens.data;
}

return [];
```

2. Transfer token to marketplace wallet
```ts
import { Sdk} from "@unique-nft/sdk";
const sdkClient = new Sdk({ baseUrl, signer: null });

const selectedAccount = '...';
const marketplaceWalletAddress = '...';

const { signerPayloadJSON } = await sdkClient.tokens.transfer.build({ address: selectedAccount?.address, collectionId, tokenId, from: selectedAccount?.address, to: escrowAddress, value: 1 }) || {};

// sign transaction
const signature = await signTx(signerPayloadJSON, selectedAccount);
if(!signature) return;

// submit transaction
const { hash } = await sdkClient.extrinsics.submit({ signerPayloadJSON, signature }) || {};
if(!hash) return;

// !IMPORTANT!
// { hash} from above will be used in next step and provided in request to BE for validation
```

3. Setup a price for selling NFT

Front-end
```ts
const hash; // from previouse step
const price; // asked from user on UI
const selectedAccount; // account from extension

await fetch(`${config.marketApiUrl}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hash, price, seller: selectedAccount.address })
  });

```
Back-end
```ts
// validate transaction
const { parsed } = await sdkClient.extrinsics.status({ hash: txHash });

if (!parsed) throw new Error('Extrinsic is not complited or doesn\'t exist');

const { from, to, collectionId, tokenId, value } = parsed;

    if (from !== seller
      || to !== getEscrowAddress() // marketplace wallet address
      || value !== 1
      ) throw new Error('Extrinsic is not valid');

// save offer to DB
const collection = await sdkClient.collections.get({ collectionId });
const token = await sdkClient.tokens.get({ collectionId, tokenId });

const { name, tokenPrefix } = collection;
const { image } = token;

// in our example - this will save offer to file
await appendOffer({ collectionId, tokenId, seller, price, tokenDescription: { collectionName: name, prefix: tokenPrefix, imageUrl: image.fullUrl || '' } });
```

## Purchase NFT

When purchasing NFT keep in mind that we need not only to send NFT to buyer, but also send money to seller. At this step you can also manage comissions if you want to.

1. Send funds to marketplace wallet
Front-end
```ts
const selectedAccount = '...';
const marketplaceWallet = '...';
const buyToken = async (offerId, price) => {
    if(!selectedAccount?.address) return;

    const { signerPayloadJSON } = await sdkClient.balance.transfer.build({
      address: selectedAccount.address,
      destination: marketplaceWallet,
      amount: price
    }) || {};
    if (!signerPayloadJSON) return;

    // sign transaction
    const signature = await signTx(signerPayloadJSON, selectedAccount);
    if(!signature) return;

    // submit transaction
    const { hash } = await sdkClient.extrinsics.submit({ signerPayloadJSON, signature }) || {};
    if(!hash) return;

// Once again - we will use { hash } in next step
```
2. Call REST api to confirm purchase
Front-end
```ts
const offerId; // from token we are trying to buy
const selectedACcount; // from polkadojs widget
const hash; // from previouse step

await fetch(`${config.marketApiUrl}/offers`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ offerId,
      buyer: selectedAccount.address,
      txHash: hash })
  });
```
Back-end
```ts
// validate and verify purchase

// get offer from DB
const offer = await getOffer(offerId);
if(!offer || offer.status !== 'active') throw new Error('Active offer not found');

const { collectionId, tokenId, price, seller } = offer;

const { blockHash } = await sdkClient.extrinsics.status({ hash: txHash });

const { args } = await sdkClient.extrinsics.get({ blockHashOrNumber: blockHash, extrinsicHash: txHash });

const [destination, amountRaw] = args || [];
// validate user transfer: it exist, it send money to crrect address and amount is higher than the price

// Don't forget to account chain decimals when calculating transfered amounts
if (destination !== getEscrowAddress()
  || BigInt(amountRaw) !== BigInt(price * (10 ** decimals))
  ) throw new Error('Extrinsic is not valid');
```
3. Backend should send NFT to buyer
```ts
const keyring = new Keyring({ type: signatureType });
const { address, sign } = keyring.addFromUri(escrowSeed);
await sdkClient.tokens.transfer.submit({
  address,
  collectionId,
  tokenId,
  from: address,
  to: buyer,
  value: 1
}, {
  signer: {
    sign({ signerPayloadHex }) {
      const signature = u8aToHex(sign(signerPayloadHex, { withType: true }))
      return Promise.resolve({ signature, signatureType });
    }
  }
});
```
4. Backend should send funds to seller
```ts
const keyring = new Keyring({ type: signatureType });
const { address, sign } = keyring.addFromUri(escrowSeed);
await sdkClient.balance.transfer.submit({
  address,
  destination: seller,
  amount: price
}, {
  signer: {
    sign({ signerPayloadHex }) {
      const signature = u8aToHex(sign(signerPayloadHex, { withType: true }))
      return Promise.resolve({ signature, signatureType });
    }
  }
});
```
5. Close/complete offer in DB
```ts
await setOfferStatus(offerId, 'closed');
```


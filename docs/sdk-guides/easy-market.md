# How to create a marketplace from scratch

## __What is this article about__
Here we will show you all the most important *concepts* you need to know about when going to make your own marketplace.

__```This is not a step by step guide on building a marketplace, but rather an explisit look at main specifics regarding BlockChain marketplaces.```__

Complete marketplace created by this guide can be found [here](https://github.com/UniqueNetwork/insert-your-marketplace-name)

Below we will describe main operations that you will need in order to create a marketplace. Keep in mind that it's just a simplified concept to give you an idea of how to develop main marketplace operations using blockchain.

- We will look into _account managment_ - simple look on how to interact with polkadotjs extension in order to receive payments and place NFTs to sale

- Then we will look on _how to put NFT on sale_ - how to transfer token to marketplace wallet and validate that transfer

- Finally we will learn _how to puchase_ previously placed NFT. How to provide bought NFT to buyer and give money to the seller.
# __Content__
- [Managing accounts](#Accounts)
- [How to place NFT on sale](#Sale)
- [How to process NFT purchase](#Buy)

__Different usecases and advanced implementations will be described in later chapters of this guide-series__

## __⚠️  Prerequisites:__
<details>
<summary> Important parts of application that are neccessary for marketplace</summary>

1. Main wallet that will accept money from buyers and hold selling tokens. Also known as `escrow` or `marketplaceWallet`

2. DB of sorts to store data about tokens on sale and their prices. In our examples, we will use json file as our db for simplicity

3. Frontend should know the address of `marketplace wallet` - the one that holds tokens. In our example we will receive it via back-end request on /settings, you can use environment variables

4. We will use polkadot.js extension as the main source for users to subscribe to transactions and maintain accounts.

5. `Marketplace wallet` should always have some funds on it to cover transaction fees at transfering tokens or nfts

[Extension can be found here](https://polkadot.js.org/extension/)
</details>

<a name="Accounts"></a>

# __Manage accounts__ 

Before we begin we need a way to manage users accounts. User should be able to select an account that will be used for buying/selling. We also would like to present the balance of selected account.

⚠️ `selectedAccount` in further parts of this guide will be the one received from extension

<details>
<summary>Front-end:</summary>

```ts
import { PolkadotAccount, PolkadotProvider } from '@unique-nft/accounts/polkadot';

// Get all accounts presented in polkadotjs extension
const getAccounts = async () => {
  const provider = new PolkadotProvider({ accountType: ['sr25519']});
  await provider.init();
  // get accounts from polkadot's extension
  const _accountsList = await provider.getAccounts() as PolkadotAccount[];
  if (_accountsList.length !== 0) {
    const _accounts = await web3Accounts();
    return _accounts;
  }
  throw new Error('Polkadotjs extension is not installed');
}

const getBalance = async (account) => {
  if (!account) return;
  const address = account.getAddress();
  const { availableBalance } = await sdk.balance.get({ address })
  return availableBalance;
};

let accounts = await getAccounts();
// ⚠️ User account used for interactions
let selectedAccount = accounts[0]; 
```
[More about accounts](../createAccount)
</details>

<a name="Sell"></a>

# __How to sell__ 

Before some one can buy a token it should be placed on sale. Sale is represented as `offer` which is basically a token on `marketplace wallet` and a record in DB about the price of this token.

## __1. Get user tokens.__

For that matter we will be using unique-scan API since there's no on-chain solution to get all user tokens.

<details>
<summary>Example:</summary>

```ts
// GQL request to get tokens
const GqlQuery = "query getTokens($limit: Int, $offset: Int, $where: TokenWhereParams = {}, $orderBy: TokenOrderByParams = {}) {\n" +
  "  tokens(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {\n" +
  "    data {\n" +
  "      collection_id\n" +
  "      collection_name\n" +
  "      owner\n" +
  "      owner_normalized\n" +
  "      image\n" +
  "      token_id\n" +
  "      token_prefix\n" +
  "      __typename\n" +
  "    }\n" +
  "    count\n" +
  "    timestamp\n" +
  "    __typename\n" +
  "  }\n" +
  "}";

// address can be obtained as "selectedAccount.address"
const getTokens = async (address: string): Promise<ScanTokenEntity[]> => {
  // GQL params to specify which tokens we want to get from DB
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

  const { data } = await response.json();
  return data.tokens.data;
};

```
</details>

## __2. Transfer token to marketplace wallet__
Before we, as marketplace, can do anything with token - we need to obtain ownership over it. Which will be achieved by transfering token by user to our `marketplace wallet`.

<details>
<summary>Example:</summary>

```ts
const { hash } = await sdk.tokens.transfer.submitWatch({ 
  address: selectedAccount?.address, 
  collectionId, 
  tokenId, 
  from: selectedAccount?.address, 
  to: escrowAddress, 
  value: 1 
}, {
  signer: selectedAccount
});

// Make sure to save "hash" for next step
```
</details>

## __3. Setup a price for selling NFT__
Put NFT price to DB. It is unwise to keep pricing inside nft, so we will handle it offchain.

⚠️ We will send `hash` obtained in previouse step to back-end, so we can validate transfer on server side before saving it to DB

<details>
<summary>Front-end:</summary>

```ts
// hash - from previouse step
// price - from UI
// selectedAccount - from extension
await fetch(`${config.marketApiUrl}/offers`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ hash, price, seller: selectedAccount.address })
});

```
</details>

<details>
<summary>Back-end:</summary>

```ts
import { hexToNumber } from "@polkadot/util";
// validate transaction
const { parsed, blockHash } = await sdk.extrinsics.status({ hash: txHash });

if (!parsed) throw new Error('Extrinsic is not complited or doesn\'t exist');

const { args } = await sdk.extrinsics.get({ blockHashOrNumber: blockHash, extrinsicHash: txHash });

const [from, to, collectionIdEncoded, tokenIdEncoded, valueEncoded] = args || [];

const collectionId = hexToNumber(collectionIdEncoded);
const tokenId = hexToNumber(tokenIdEncoded);
const value = hexToNumber(valueEncoded);

if (from.substrate !== seller
  || to.substrate !== getEscrowAddress() // marketplace wallet address
  || value !== 1
  ) throw new Error('Extrinsic is not valid');

// save offer to DB
const collection = await sdk.collections.get({ collectionId });
const token = await sdk.tokens.get({ collectionId, tokenId });

const { name, tokenPrefix } = collection;
const { image } = token;

// in our example - this will save offer to file
await appendOffer({ collectionId, tokenId, seller, price, tokenDescription: { collectionName: name, prefix: tokenPrefix, imageUrl: image.fullUrl || '' } });
```
</details>

<a name="Buy"></a>

# __Purchase NFT__

When purchasing NFT keep in mind that we need not only to send NFT to buyer, but also send money to seller. At this step you can also manage comissions if you want to.

## __1. Send funds to marketplace wallet__
As a purchase - we should give money to marketplace. It can be done simply by transfering funds to `marketplaceWallet` by buyer.

<details>
<summary>Front-end:</summary>

```ts
const payForToken = async (offerId, price) => {
  if(!selectedAccount?.address) return;

  const { hash } = await sdk.balance.transfer.submitWatch({ 
    address: selectedAccount.address,
    destination: marketplaceWallet,
    amount: price
  }, {
    signer: selectedAccount
  });
  return hash; // we will use it in next step to finilize purchase
}

// Once again - we will use { hash } in next step
```
</details>

## __2. Call REST api to confirm purchase__
Send transaction info to back-end for validation. Backend will verify that sufficient amount of funds was provided to confirm purchase.

⚠️ We will send `hash` obtained in previouse step to back-end, so we can validate transfer on server side before saving it to DB

<details>
<summary>Front-end:</summary>

```ts
const offerId; // from token we are trying to buy
const selectedACcount; // from polkadojs widget
const hash; // from previouse step

await fetch(`${config.marketApiUrl}/offers/buy`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
    offerId,
    buyer: selectedAccount.address,
    txHash: hash 
  })
});
```
</details>

<details>
<summary>Back-end:</summary>

Validate purchase request
```ts
import { hexToBn } from "@polkadot/util";

// get offer from DB
const offer = await getOffer(offerId);
// make sure offer does exist and not finished
if(!offer || offer.status !== 'active') throw new Error('Active offer not found');

const { collectionId, tokenId, price, seller } = offer;

const { blockHash } = await sdk.extrinsics.status({ hash: txHash });

const { args } = await sdk.extrinsics.get({ blockHashOrNumber: blockHash, extrinsicHash: txHash });

const [destination, amountRaw] = args || [];

const { decimals } = await sdk.chain.properties();

const amount = hexToBn(amountRaw);
// human price is "1 UNQ" but for chain it should be "1 000 000 000 000" (12 zeros - the amount of decimals)
const priceBN = (new BN(price)).mul((new BN(10)).pow(new BN(decimals)));

// validate user transfer: it exist, it send money to crrect address and amount is higher than the price

// Don't forget to account chain decimals when calculating transfered amounts
if (destination.id !== getEscrowAddress()
  || !amount.eq(priceBN)
) throw new Error('Extrinsic is not valid');
```

</details>

## __3. Backend should send NFT to buyer__
Now, when everything verified - we need to finish up the trade. First - give NFT to buyer.

<details>
<summary>Back-end:</summary>

```ts
await sdk.tokens.transfer.submit({
  address, // market wallet address
  collectionId,
  tokenId,
  from: address, // market wallet address`
  to: buyer, // buyer address`
  value: 1
}, {
  signer: selectedAccount
});
```
</details>

## __4. Backend should send funds to seller__
Second - send money to buyer. 

💡At that step you can keep a portion of money as a market fee:

Cut a part, for example 10%, of the summ that should be sent to seller - and keep it on marketplace wallet or send on your own wallet instead.

<details>
<summary>Back-end:</summary>

```ts
await sdk.balance.transfer.submit({
  address,
  destination: seller,
  amount: price
}, {
  signer: selectedAccount
});
```
</details>

## __5. Close/complete offer in DB__
Don't forget to mark offer as completed in DB.
```ts
await setOfferStatus(offerId, 'closed');
```

# Usefull links for further reading
1. [SDK](/sdk-docs) - see how to use all SDK methods and more
2. [EVM and smartcontracts](/evm-docs/ethereum/Smart%20contracts\.html) - checkout out how you can use ethereum smart contracts and an example of how we did it with our market
3. [Adresses](/concepts/addresses/) - general information about accounts
4. Whitelabel marketplace by UniqueNetwork [FE](https://github.com/UniqueNetwork/unique-marketplace-frontend)/[BE](https://github.com/UniqueNetwork/unique-marketplace-api) - our implementation for marketplace. Be warned - this one is very complex and utilizes custom smartcontract as well as built-in scan solution for TX validations.
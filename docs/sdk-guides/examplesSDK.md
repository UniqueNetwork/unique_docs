# SDK examples

Here we will show how to create collection and token with Unique JS SDK.

#### Steps

The lifecycle of a extrinsic (or transaction in non-Substrate terminology) contains of:
1. build extrinsic
2. sign extrinsic
3. submit signed extrinsic

Also we will need a Substrate account (mnemonic seed phrase and address)
which can be created with the Polkadot.js extension
as it shown [here](/sdk-guides/createAccount)  
This account should have some balance to create collection (2-2.5 OPL).
[Our faucet telegram bot](https://t.me/unique2faucet_opal_bot)

Packages used in this example:
 - [@unique-nft/sdk](https://www.npmjs.com/package/@unique-nft/sdk)
 - [@unique-nft/accounts](https://www.npmjs.com/package/@unique-nft/accounts)


```ts
import { Sdk } from '@unique-nft/sdk';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

const baseUrl = 'https://rest.unique.network/opal/v1';
const mnemonic = 'bus ahead nation nice damp recall place dance guide media clap language';


////////////////////////////////////////////
// Creating SDK client
////////////////////////////////////////////
function createSdk(account) {
  const options = {
    baseUrl,
    signer: account,
  }
  return new Sdk(options);
}

////////////////////////////////////////////////////////////////////////////
// Creating sample collection
// For the signature, the signer specified in the SDK constructor is used
////////////////////////////////////////////////////////////////////////////
export async function createCollection(sdk, address) {
  const { parsed, error } = await sdk.collections.creation.submitWaitResult({
    address,
    name: 'Test collection',
    description: 'My test collection',
    tokenPrefix: 'TST',
  });

  if (error) {
    console.log('create collection error', error);
    process.exit();
  }

  const { collectionId } = parsed;

  return sdk.collections.get({ collectionId });
}

////////////////////////////////////////////////////////////////////////////
// Creating sample token in collection
// For the signature, the signer specified in the SDK constructor is used
////////////////////////////////////////////////////////////////////////////
export async function createToken(sdk, address, collectionId) {
  const { parsed, error } = await sdk.tokens.create.submitWaitResult({
    address,
    collectionId,
  });

  if (error) {
    console.log('create token error', error);
    process.exit();
  }

  const { tokenId } = parsed;

  return sdk.tokens.get({ collectionId, tokenId });
}


////////////////////////////////////////////
// entrypoint
////////////////////////////////////////////
async function main() {
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = account.instance.address;

  const sdk = createSdk(account);

  const collection = await createCollection(sdk, address);
  console.log('collection', collection);

  const token = await createToken(sdk, address, collection.id);
  console.log('token', token);
}

main();
```
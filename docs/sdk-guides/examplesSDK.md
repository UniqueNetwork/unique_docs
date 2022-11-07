# SDK examples

The following example illustrates how to use the Unique JS SDK library to create a collection and add a token to it.

The lifecycle of an extrinsic is:

1. request the REST service to build the extrinsic
2. sign the extrinsic
3. submit the signed extrinsic

 We'll need a Substrate address to use in this example. Since we need to provide the *mnemonic seed* and the *wallet address* at some point remember to have these two data items handy if you are using an already existing account or make a note of these two data items during the account creation process if you will be creating a new account for the sake of this exercise. The instructions for creating an account with the Polkadot.js wallet browser extension can be found [here](/sdk-guides/createAccount). And, since some Opal tokens are required to pay for the transaction fees as well (around 2 to 2.5 OPL) note that these can be obtained via the [Telegram faucet bot](https://t.me/unique2faucet_opal_bot).

Packages used in this example:

- [@unique-nft/sdk](https://www.npmjs.com/package/@unique-nft/sdk)
- [@unique-nft/accounts](https://www.npmjs.com/package/@unique-nft/accounts)

```ts
import { Sdk } from '@unique-nft/sdk';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

const baseUrl = 'https://rest.unique.network/opal/v1';
const mnemonic = 'bus ahead nation nice damp recall place dance guide media clap language';


////////////////////////////////////////////
// Creating an SDK client
////////////////////////////////////////////
function createSdk(account) {
  const options = {
    baseUrl,
    signer: account,
  }
  return new Sdk(options);
}

////////////////////////////////////////////////////////////////////////////
// Creating a sample collection
// The signer specified in the SDK constructor is used to sign an extrinsic
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
// Creating a sample token in the newly created collection
// The signer specified in the SDK constructor is used to sign an extrinsic
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
// Entrypoint 
////////////////////////////////////////////
async function main() {
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.instance.address;

  const sdk = createSdk(signer);

  const collection = await createCollection(sdk, address);
  console.log('collection', collection);

  const token = await createToken(sdk, address, collection.id);
  console.log('token', token);
}

main();
```

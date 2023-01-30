# SDK usage examples

On this page, we will provide examples of basic token handling methods: creating an account, creating a collection, creating and transferring a token. You can read more about other methods in the [methods section](../networks/methods.md).

[[toc]]

## Prerequisites

All transactions require some fee, so in test purpose you can use Opal tokens, which you can get for free on your balance. These can be obtained via the [Telegram faucet bot](https://t.me/unique2faucet_opal_bot).

## How to create an account

In this tutorial, we will go through the entire process of creating an account using the Unique Network SDK.

Consider using how you can create or get an account using the [Accounts](https://www.npmjs.com/package/@unique-nft/accounts) package.

You will need to come up with or generate a mnemonic phrase (this is a set of words that can be used to create and restore your wallet).

:warning: Never share your mnemonic phrase with anyone. If someone gets access to your mnemonic phrase, they can steal your funds.

#### Generate a new account

An easy way to create a new account is to use the `generateAccount` function from the `Accounts` package:

```typescript:no-line-numbers
import { generateAccount, SignatureType } from "@unique-nft/accounts";

const account = await generateAccount({
  pairType: SignatureType.Sr25519,
  meta: {
    name: 'my_test_account'
  }
})

console.log(account);

```

<Details>
<template v-slot:header>
Console log output
</template><template v-slot:body>

```typescript:no-line-numbers
{
  mnemonic: 'alter eternal wolf cash picture print orange drink exact vendor arch bulb',
  seed: '0xcf9eff78eecb3cebcea5645c5376f4693d3b419deb8e8ee58551c3f7e69f1cb6',
  publicKey: '0x24f91ccc3ab6656f8da3ad3e441656483b772ff2394e6e1da5ebf1f2cd46e143',
  keyfile: {
    encoded: 'MFMCAQEwBQYDK2VwBCIEIBitDsTc6aHS8m1Ta59l7d71ElpB7y0V2w1PHNInvZlS7Im6LVJjq2fqAc6oVv7c9ldlC4qT/rKCjtGpB69yw+ShIwMhAED5ve+webmJVaeKFzobwAlbU0gW57ktBM6oDxKqBisB',
    encoding: { content: [Array], type: [Array], version: '3' },
    address: '5DXu7NRcFPSVEF3WcYkbrrZfFBE4rnkaYeP8721WEcystBxj',
    meta: { name: 'my_test_account' }
  }
}

```
</template>
</Details>

#### Get an account from mnemonic phrase

If you already have a mnemonic phrase, you can use it to get an account. Here is how the phrase looks like:

``
affair spoon other impact target solve extra range cute myself float panda
``

Here is how we can use it to get an account.

```typescript:no-line-numbers
import { getAccountFromMnemonic } from '@unique-nft/accounts';

const account = await getAccountFromMnemonic({
  mnemonic: 'affair spoon other impact target solve extra range cute myself float panda',
});
console.log(account);
```

<Details>
<template v-slot:header>
Console log output
</template><template v-slot:body>

```typescript:no-line-numbers
{
  mnemonic: 'affair spoon other impact target solve extra range cute myself float panda',
  seed: '0x2a5dd888c0fb536c7c82ee53bb44ca49825ab134dd5a9c09e62423eeba30847b',
  publicKey: '0x094bb2d311460005c5072635beb8a11c8f15521d2136bdfbab3163af3c21412e',
  keyfile: {
    encoded: 'MFMCAQEwBQYDK2VwBCIEICpd2IjA+1NsfILuU7tEykmCWrE03VqcCeYkI+66MIR7Ji4DUViFrOGgvhQNVi8elFCpHSDekzUg/5dpSD2lZsuhIwMhACYuA1FYhazhoL4UDVYvHpRQqR0g3pM1IP+XaUg9pWbL',
    encoding: { content: [Array], type: [Array], version: '3' },
    address: '5CvmLzTcAfSFJgRiJ7DbKYwDUMcRBbNAa3bQeCrNM2nXTvBk',
    meta: {}
  }
}
```

</template>
</Details>

Or, we can generate a mnemonic phrase and then get an account using it:

```typescript:no-line-numbers
import { getAccountFromMnemonic } from '@unique-nft/accounts';
import { mnemonicGenerate } from '@polkadot/util-crypto';

const mnemonicPhrase = mnemonicGenerate();
const account = await getAccountFromMnemonic({
  mnemonic: mnemonicPhrase,
});
```

#### Providers

If you need to get an account from one specific provider, then it is not necessary to create an Accounts object, you can contact the provider directly:

```typescript:no-line-numbers
import { Account } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { KeyringOptions } from '@polkadot/keyring/types';

const options: KeyringOptions = {
  type: 'sr25519',
};
const provider = new KeyringProvider(options);
await provider.init();
const signer = provider.addSeed('<seed of account>');
```

The following providers are supported:

<CodeSwitcher name="keyring">
  <template v-slot:keyring>

```typescript:no-line-numbers
// The provider works directly with the chain using `KeyringPair` from the `@polkadotkeyring` package.
import { Account } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { KeyringOptions } from '@polkadot/keyring/types';

const options: KeyringOptions = {
  type: 'sr25519',
  };
  const provider = new KeyringProvider(options);
  await provider.init();

const signer1 = provider.addSeed('<seed of account>');
const signer2 = provider.addKeyfile('<json keyfile>');
```
  </template>
  <template v-slot:keyringLocal>

```typescript:no-line-numbers
import { Account } from '@unique-nft/accounts';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  KeyringLocalOptions,
  KeyringLocalProvider,
  } from '@unique-nft/accounts/keyring-local';

const options: KeyringLocalOptions = {
  type: 'sr25519',
  passwordCallback: async (keyring: KeyringPair) => {
    return '<password>';
      },
      };
      const provider = new KeyringLocalProvider(options);
      await provider.init();

const signer = provider.addUri('<uri of account>', '<password>');
```

  </template>
  <template v-slot:polkadotExtension>

```typescript:no-line-numbers
// The provider uses the Polkadot extension (https://polkadot.js.org/extension) for the browser.
import { Web3AccountsOptions } from '@polkadot/extension-inject/types';
import { Account } from '@unique-nft/accounts';
import { PolkadotProvider } from '@unique-nft/accounts/polkadot';

const options: Web3AccountsOptions = {
  accountType: ['sr25519'],
  };
  const provider = new PolkadotProvider(options);
  await provider.init();

const signer = await provider.first();
```

  </template>
  <template v-slot:metamaskExtension>

```typescript:no-line-numbers
// The provider uses the Metamask extension (https://metamask.io/download) for the browser.
import { Account } from '@unique-nft/accounts';
import { MetamaskProvider } from '@unique-nft/accounts/metamask';

const provider = new MetamaskProvider();
await provider.init();

const signer = await provider.first();
```

  </template>
</CodeSwitcher>

## How to create a new collection

<CodeSwitcher>
<template v-slot:sdk>

```ts:no-line-numbers
import { Sdk } from '@unique-nft/sdk';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

const baseUrl = 'https://rest.unique.network/opal/v1';
const mnemonic = 'bus ahead nation nice damp recall place dance guide media clap language';

// Creating an SDK client
function createSdk(account) {
  const options = {
    baseUrl,
    signer: account,
  }
  return new Sdk(options);
}

// Creating a sample collection
// The signer specified in the SDK constructor is used to sign an extrinsic
export async function createCollection(sdk, address) {
  const { parsed, error } = await sdk.collections.creation.submitWaitResult({
    address,
    name: 'Test collection',
    description: 'My test collection',
    tokenPrefix: 'TST',
  });

  if (error) {
    console.log('Error occurred while creating a collection. ', error);
    process.exit();
  }

  const { collectionId } = parsed;

  return sdk.collections.get({ collectionId });
}

// Entrypoint
async function main() {
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.instance.address;

  const sdk = createSdk(signer);

  const collection = await createCollection(sdk, address);
  console.log('Сollection was create. ID: ', collection);
}

main();
```
</template>
</CodeSwitcher>


## How to create a new token

<CodeSwitcher>
<template v-slot:sdk>

```typescript
import { CreateTokenNewArguments } from '@unique-nft/substrate-client/tokens/types';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
} from '@unique-nft/substrate-client/tokens';

const createTokenArgs: CreateTokenNewArguments = {
    address: '<your account address>',
    collectionId: 123,
    data: {
        encodedAttributes: {
            '0': 0,
            '1': [0],
            '2': 'foo_bar',
        },
        image: {
            ipfsCid: '<valid_ipfs_cid>',
        },
    },
};

const result = await sdk.tokens.create.submitWaitResult(createArgs);
const { collectionId, tokenId } = result.parsed;

const token = await sdk.tokens.get({ collectionId, tokenId });
```
</template>
</CodeSwitcher>

## Hot to transfer a token

<CodeSwitcher>
<template v-slot:sdk>

```typescript
import { TransferArguments } from '@unique-nft/substrate-client/tokens';

const args: TransferArguments = {
  address: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
```

</template>
</CodeSwitcher>

## What are token permissions

## Unique schema
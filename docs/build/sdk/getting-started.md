# Getting started

## Overview

The SDK facilitates seamless integration of Unique Network's capabilities into the web3 application, bypassing the need for direct low-level API interaction. It enables you to effortlessly mint collections and tokens, manage account balances, and more.

All transactions require a fee so that you can use Opal tokens for test purposes. You can get them free in [Telegram faucet bot](https://t.me/unique2faucet_opal_bot).

[[toc]]

## Installation

Install `@unique-nft/sdk` for Unique Network interaction and `@unique-nft/accounts` for account management.

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/sdk @unique-nft/accounts
```

  </CodeGroupItem>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/sdk @unique-nft/accounts
```

  </CodeGroupItem>
</CodeGroup>

## Creating SDK instance

In the `baseUrl` parameter, you must pass one of the paths to the network. For a complete list of endpoints, refer to the [reference](../../reference/sdk-endpoints.md).

You can also set a default signer; for this, you must set the seed phrase to the signer option.

```typescript:no-line-numbers
import Sdk, {Options} from "@unique-nft/sdk";

const baseUrl = "https://rest.unique.network/opal/v1";
const mnemonic = '<SET THE MNEMONIC SEED PHRASE FOR THE DEFAULT SIGNER>';

const options: KeyringOptions = {
  type: "sr25519",
};
const provider = new KeyringProvider(options);
await provider.init();

const signer = provider.addSeed(mnemonic);

const options: Options = {
    baseUrl,
    signer
};
const sdk = new Sdk(options);
```

## Creating accounts

### Get an account from the mnemonic phrase

If you already have a mnemonic phrase, you can use it to get an account. Here is what the phrase looks like:

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

### Providers

You can contact the provider directly if you need to get an account from a specific provider, like polkadot{.js} or Metamask.

The following providers are supported:

<CodeGroup>
  <CodeGroupItem title="Keyring">

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
  </CodeGroupItem>
  <CodeGroupItem title="Keyring Local">

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

  </CodeGroupItem>
  <CodeGroupItem title="Polkadot Extension">

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

  </CodeGroupItem>
  <CodeGroupItem title="Metamask Extension">

```typescript:no-line-numbers
// The provider uses the Metamask extension (https://metamask.io/download) for the browser.
import { Account } from '@unique-nft/accounts';
import { MetamaskProvider } from '@unique-nft/accounts/metamask';

const provider = new MetamaskProvider();
await provider.init();

const signer = await provider.first();
```

  </CodeGroupItem>
</CodeGroup>

## Creating collections and NFTs
<!-- TODO give a link to Unique Schema guide -->
<CodeGroup>
<CodeGroupItem title = "SDK" active>

```ts:no-line-numbers
// ... sdk initialization 

const { parsed, error } = await sdk.collection.create.submitWaitResult({
  name: "Test collection",
  description: "My test collection",
  tokenPrefix: "TST",
});

if (error) throw Error("Error occurred while creating a collection");
if (!parsed) throw Error("Cannot parse results");

const { collectionId } = parsed;
const collection = await sdk.collection.get({ collectionId });

// Create NFT
await sdk.token.create({ collectionId });
// ...
```
</CodeGroupItem>
</CodeGroup>


## Transfer NFT

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript
await sdk.token.transfer({
  collectionId,
  tokenId: 1,
  to: "5EZDbVxdAYH6mB7uAnoUUvaXDL2LyEmYxpsEn9NWajqpQJ2W",
});
```

</CodeGroupItem>
</CodeGroup>

## Batch several transactions

You should manually increase `nonce` if you want to send several transactions in one block.

<CodeGroup>
<CodeGroupItem title="SDK">

```typescript no-line-numbers
  let { nonce } = await sdk.common.getNonce({ address: signer.address });

  await Promise.all([
    sdk.balance.transfer.submitWaitResult(
      {
        amount: 100,
        destination: "5CiRmhr6pd3YyU2VPR4ePTVxw2FddTiZeocEiiZbvq4XDACq",
      },
      { nonce: nonce++ },
    ),
    sdk.balance.transfer.submitWaitResult(
      {
        amount: 100,
        destination: "5E7DCdEPC8enm49fkQ6ipkxo2EA1F3qZ5WiaaCdeppxQ9ejD",
      },
      { nonce: nonce++ },
    ),
  ]);
```
</CodeGroupItem>
</CodeGroup>
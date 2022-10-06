# Ways to create

In this guide, we will go through the entire process of creating an account using the Unique Network SDK.

Consider using how you can create or get an account using the NPM package [@unique-nft/account](https://www.npmjs.com/package/@unique-nft/accounts)

You already know that you will need to come up with or generate a mnemonic phrase (this is a set of words that can be used to create and restore your wallet)

**WARNING**: Never share your mnemonic phrase with anyone. If someone gets access to your mnemonic phrase, they can steal your funds.



_**So the ways of creation**_
- [Generate new account](#generate-new-account)
- [Get account from mnemonic](#get-account-from-mnemonic)
- [Providers](#providers)

## Generate new account
An easy way to create a new account is to use the `generateAccount` function from the `@unique-nft/accounts` package:

```typescript
import { generateAccount, SignatureType } from "@unique-nft/accounts";

const account = await generateAccount({
  pairType: SignatureType.Sr25519,
  meta: {
    name: 'my_test_account'
  }
})

console.log(account);
```
<details><summary>Console log output</summary>

``` 
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
</details>

## Get account from mnemonic

If you already have a mnemonic phrase, you can use it to get an account.
Example:
```
affair spoon other impact target solve extra range cute myself float panda
```
But we consider how to create the simplest code.

```typescript
import { getAccountFromMnemonic } from '@unique-nft/accounts';

const account = await getAccountFromMnemonic({
  mnemonic: 'affair spoon other impact target solve extra range cute myself float panda',
});
console.log(account);
```
<details><summary>Console log output</summary>

```
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
</details>

Or use a phrase generator:

```typescript
import { getAccountFromMnemonic } from '@unique-nft/accounts';
import { mnemonicGenerate } from '@polkadot/util-crypto';

const mnemonicPhrase = mnemonicGenerate();
const account = await getAccountFromMnemonic({
  mnemonic: mnemonicPhrase,
});
```

## Providers

If you need to get an account from one specific provider, then it is not necessary to create an Accounts object, you can contact the provider directly:

```typescript
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

<details><summary>Keyring</summary>

The provider works directly with the chain using `KeyringPair` from the `@polkadotkeyring` package.
```typescript
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
</details>
<details><summary>KeyringLocal</summary>

```typescript
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
</details>
<details><summary>Polkadot extension</summary>

The provider uses [Polkadot extension](https://polkadot.js.org/extension) for the browser.
```typescript
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

</details>
<details><summary>Metamask extension</summary>

The provider uses the [Metamask extension](https://metamask.io/download) for the browser.
```typescript
import { Account } from '@unique-nft/accounts';
import { MetamaskProvider } from '@unique-nft/accounts/metamask';

const provider = new MetamaskProvider();
await provider.init();

const signer = await provider.first();
```

</details>


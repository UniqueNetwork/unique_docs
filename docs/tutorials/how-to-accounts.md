# How to work with accounts 

[[toc]]

## Creating a Substrate address via the browser extension

Unique Network, like most blockchains, is based on [accounts or addresses](/concepts/addresses/index.md). An address can own some QTZ or UNQ tokens, NFTs or some ERC-20 tokens. It can sign transactions to transfer these valuable assets to other addresses or to make some actions in Decentralized Apps (dApps). For example, an address can buy and sell NFTs on the NFT Marketplace.

A typical Quartz address looks like this: `yGHuU9CWnrHMUz8GJRmpA9MowmtMKZvnq2tLc5mk3zMFizW5X`

So, to purchase and sell tokens on the Market, you need to have a Unique Network account. To create a new account, you should get an address that can own NFTs and allow you to manage KSM. The best way to get an address is to install the **Polkadot{.js} browser extension** [for Chrome](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd) or [for Firefox](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/). This browser extension manages accounts and allows you to sign transactions with these accounts.

To create a Unique Network account:
1. Download the [Polkadot{.js} extension](https://polkadot.js.org/extension/) and add it to your browser.
2. Click on the Polkadot{.js} extension in your browser.
3. In the **Authorize** window, read the disclaimer and click **Yes, allow this application access**.
4. Click the **Add Account** icon (**+**) and then click **Create new account**. This will generate your wallet address and the 12-word mnemonic seed – the series of words that can be used to restore your wallet. :warning: Copy this seed and keep it a safe place. :warning:
 ![Seed](./images/seed.png)
5. Select "I have saved my mnemonic seed safely" and click **Next step**.
6. On the next screen, in the _NETWORK_ drop-down menu, select **Allow use on any chain**. Add a name for your account and create a new password by entering the password twice.
 ![AccountName](./images/acc-name.png)
7. Click **Add the account with the generated seed**. Your newly created account is now displayed in the Accounts window.               
   ![AccountList](./images/acc-list.png)

Each account has an icon displayed next to the account name. Clicking this icon, you copy the account address to the clipboard.


## Create an account via code

In this tutorial, we will go through the entire process of creating an account using the Unique Network SDK.

Consider using how you can create or get an account using the [Accounts](https://www.npmjs.com/package/@unique-nft/accounts) package.

You will need to come up with or generate a mnemonic phrase (this is a set of words that can be used to create and restore your wallet).

:warning: Never share your mnemonic phrase with anyone. If someone gets access to your mnemonic phrase, they can steal your funds.

### Generate a new account

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

<Details><template v-slot:header>
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

### Get an account from mnemonic

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

<Details><template v-slot:header>
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

### Providers

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


## Get and display accounts and balances

### Get accounts

You can use the [Accounts](https://www.npmjs.com/package/@unique-nft/accounts) package to work with accounts easily.

The package allows connecting with different accounts. To get an accounts list, you need to create an instance of the `Accounts` class and connect the necessary providers to it:

```typescript:no-line-numbers
import { Accounts } from '@unique-nft/accounts';
import { KeyringLocalProvider } from '@unique-nft/accounts/keyring-local';
import { PolkadotProvider } from '@unique-nft/accounts/polkadot';

const accounts = new Accounts();
await accounts.addProvider(KeyringLocalProvider);
await accounts.addProvider(PolkadotProvider);

const accountsList = await accounts.getAccounts();

```
This will give us a list of available accounts. You can read a little more about accounts in the Polkadot docs - [Keyring](https://polkadot.js.org/docs/ui-keyring) and [Extension](https://polkadot.js.org/docs/extension). 


### Get balances

To get the balance of available accounts, we need to use [SDK](https://www.npmjs.com/package/@unique-nft/sdk). All we need to do is to pass the account address, whose balance we want to know, as an argument.

```typescript:no-line-numbers
import { Sdk, Options } from '@unique-nft/sdk';

const options: Options = {
    baseUrl: '<REST API URL>'
};
const sdk = new Sdk(options);

const { address, availableBalance, lockedBalance, freeBalance } = sdk.balance.get({ address });
```

As a result, we get the following data: 

`address` - current address.

`availableBalance` - transferable balance.

`lockedBalance` - locked balance.

`freeBalance` - full balance.

## Create an account via web form

In this tutorial, we will create a userform for adding a new account right in your web UI.

To work with accounts, we will need the ``Accounts`` object and a provider, such as ``KeyringLocalProvider``,
which saves accounts in a secure store using the ``@polkadot/ui-keyring`` package.

First of all, we need to initialize the provider:

```typescript:no-line-numbers
import { Accounts } from '@unique-nft/accounts';
import { KeyringLocalProvider } from '@unique-nft/accounts/keyring-local';

... 

const options: KeyringLocalOptions = {
  type: 'sr25519', // 
  passwordCallback: async (keyring: KeyringPair) => {
	... // here you need to ask the user to enter a password to sign the transaction and return it from this callback
  },
};

const provider = new KeyringLocalProvider(options);
await provider.init();
```

Next, we need to associate it with the ``Accounts`` instance:

```typescript:no-line-numbers
const accounts = new Accounts();
await accounts.addProvider(provider);
```

Finally, let’s create a web form which will use this code. Please find below a code sample on React.
The user interface contains two fields: a mnemonic phrase and a password that must be filled.
Optionally, you can offer to fill in the account name.

```jsx:no-line-numbers
<form onSubmit={onSubmit} className='create-account-form'>
  <div>
    <label htmlFor="mnemonic">Mnemonic phrase*</label>
    <input id={'mnemonic'} value={mnemonicPhrase} onChange={(e) => setMnemonicPhrase(e.target.value)}/>
  </div>
  <div>
    <label htmlFor="name">Account name</label>
    <input id={'name'} value={name} onChange={(e) => setName(e.target.value)} />
  </div>
  <div>
    <label htmlFor="password">Password*</label>
    <input id={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
  </div>
  <button type='submit' onClick={onSubmit} >Create</button>
</form>
```

Using the ``mnemonicGenerate`` method from the ``@polkadot/util-crypto`` library, you can generate a new mnemonic:

```typescript:no-line-numbers
const newMnemonicPhrase = mnemonicGenerate();
```

In the ``onSubmit`` function, we will add an account through a provider this way:

```typescript:no-line-numbers
const onSubmit = () => {
  provider.addUri(mnemonicPhrase, password, { name });
}
```

After that, the account will be added to the local storage and it will be possible to get it through the ``getAccounts`` method:

```typescript:no-line-numbers
const accountsList = await accounts.getAccounts();
```

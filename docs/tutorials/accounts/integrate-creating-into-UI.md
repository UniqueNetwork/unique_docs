# How to integrate creating into your UI

Ok, now we are ready to create a userform for adding a new account.

To work with accounts, we definitely need the Accounts class and a provider, such as KeyringLocalProvider, which saves accounts in a secure store using the @polkadot/ui-keyring package.

And first of all, we need to initialize the provider in advance:

```typescript
import { Accounts } from '@unique-nft/accounts';
import {
  KeyringLocalProvider
} from '@unique-nft/accounts/keyring-local';

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

Next, you need to associate it with an instance of the Accounts class:

```typescript
const accounts = new Accounts();
await accounts.addProvider(provider);
```

Finally, let’s create an account creation form. 

At a minimum, to create an account through the user interface, the user must fill out a form consisting of two fields: a mnemonic phrase and a password. Optionally, you can offer to fill in the name of the account.

```JSX
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

Using mnemonicGenerate from the @polkadot/util-crypto library, you can generate random mnemonic:

```typescript
const newMnemonicPhrase = mnemonicGenerate();
```

In onSubmit, we will add an account through a provider like this:

```typescript
const onSubmit = () => {
  provider.addUri(mnemonicPhrase, password, { name });
}
```

After that, the account will be added to the local storage and it will be possible to get it through the getAccounts method:

```typescript
const accountsList = await accounts.getAccounts();
```

# Create an account via web form

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

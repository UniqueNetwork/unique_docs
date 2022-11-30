# Tools



### Accounts

[[toc]]

#### About accounts
The package is required to connect different accounts and create signatures for them. To get a list of accounts, you need to create an instance of the Accounts class and connect the necessary providers to it:

```typescript
import { Account, Accounts, SdkSigner } from '@unique-nft/accounts';
import { KeyringLocalProvider } from '@unique-nft/accounts/keyring-local';
import { PolkadotProvider } from '@unique-nft/accounts/polkadot';

const accounts = new Accounts();
await accounts.addProvider(KeyringLocalProvider);
await accounts.addProvider(PolkadotProvider);

const accountsList = await accounts.getAccounts();

const signer = accountsList[0];
```

#### Providers

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

* [Keyring](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/keyring)
* [KeyringLocal](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/keyring-local)
* [Polkadot extension](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/polkadot)
* [Metamask extension](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/metamask)

#### Generate new account

```typescript
import { generateAccount, SignatureType } from "@unique-nft/accounts";

const account = await generateAccount({
  password: '123456',
  pairType: SignatureType.Sr25519,
  meta: {
    name: 'my_test_account'
  }
})
```

#### Get account from mnemonic

```typescript
import { getAccountFromMnemonic } from '@unique-nft/accounts';

const account = await getAccountFromMnemonic({
  mnemonic: 'your mnemonic phrase',
});
```

- [Аккаунты](#Аккаунты)
- [Провайдеры](#Провайдеры)
- [Generate new account](#generate-new-account)
- [Get account from mnemonic](#get-account-from-mnemonic)

## Аккаунты
Пакет необходим для подключения разных аккаунтов и создания подписей к ним.
Чтобы получить список аккаунтов, необходимо создать экземпляр класса `Accounts` и подключить к нему необходимые провайдеры:
```typescript
import { Account, Accounts, SdkSigner } from '@unique-nft/accounts';
import { KeyringLocalProvider } from '@unique-nft/accounts/keyring-local';
import { PolkadotProvider } from '@unique-nft/accounts/polkadot';

const accounts = new Accounts();
await accounts.addProvider(KeyringLocalProvider);
await accounts.addProvider(PolkadotProvider);

const accountsList = await accounts.getAccounts();

const account: Account = accountsList[0];

const signer: SdkSigner = account.getSigner();
```

## Провайдеры
Если вам необходимо получить аккаунт с одного определенного провайдера, тогда не обязательно создавать объект Accounts, можно обращаться напрямую к провайдеру:
```typescript
import { Account } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { KeyringOptions } from '@polkadot/keyring/types';

const options: KeyringOptions = {
  type: 'sr25519',
};
const provider = new KeyringProvider(options);
await provider.init();
provider.addSeed('<seed of account>');

const account: Account | undefined = await provider.first();
const signer = account?.getSigner();
```

Поддерживаются следующие провайдеры:
 * [Keyring](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/keyring)
 * [KeyringLocal](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/keyring-local)
 * [Polkadot extension](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/polkadot)
 * [Metamask extension](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/metamask)

## Generate new account

```typescript
import { generateAccount, SignatureType } from '@unique-nft/accounts';

const account = await generateAccount({
  password: '123456',
  pairType: SignatureType.Sr25519,
  meta: {
    name: 'my_test_account',
  },
});
```

## Get account from mnemonic

```typescript
import { getAccountFromMnemonic } from '@unique-nft/accounts';

const account = await getAccountFromMnemonic({
  mnemonic: 'your mnemonic phrase',
});
```

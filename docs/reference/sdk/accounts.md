- [Generate new account](#generate-new-account)
- [Get account from mnemonic](#get-account-from-mnemonic)
- [Sign](https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/accounts/sign)

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

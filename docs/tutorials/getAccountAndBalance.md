# Get and display accounts and balances

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
import Sdk, { Options } from '@unique-nft/sdk';

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
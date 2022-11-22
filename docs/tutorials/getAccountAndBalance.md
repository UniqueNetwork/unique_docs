# How to get and display accounts and balances

## Get accounts
You can use the [@unique-nft/accounts](https://www.npmjs.com/package/@unique-nft/accounts) package to make working with accounts easier.

The package is required to connect different accounts. To get a list of accounts, you need to create an instance of the Accounts class and connect the necessary providers to it:

```typescript
import { Accounts } from '@unique-nft/accounts';
import { KeyringLocalProvider } from '@unique-nft/accounts/keyring-local';
import { PolkadotProvider } from '@unique-nft/accounts/polkadot';

const accounts = new Accounts();
await accounts.addProvider(KeyringLocalProvider);
await accounts.addProvider(PolkadotProvider);

const accountsList = await accounts.getAccounts();
```
This will give us a list of available accounts. You can read a little more about accounts [here (Keyring)](https://polkadot.js.org/docs/ui-keyring) and [here (Extension)](https://polkadot.js.org/docs/extension)


## Get balance
To get the balance of available accounts, we need to use the [thin client](https://www.npmjs.com/package/@unique-nft/sdk) and pass in arguments the address of the account whose balance we want to know.

```typescript
import { Sdk, Options } from '@unique-nft/sdk';
const options: Options = {
    baseUrl: '<REST API URL>'
};
const sdk = new Sdk(options);

const { address, availableBalance, lockedBalance, freeBalance } = sdk.balance.get({ address });
```
As a result, we get the following data: 
1) address - current address;
2) availableBalance - transferable balance;
3) lockedBalance - locked balance;
4) freeBalance - full balance.
# Cookbook for working with accounts and signers

## Account as an entity

A blockchain account is an entity associated with a public blockchain address to identify a network participant and is used to sign transactions. In Web3, you digitally sign any transaction, or more generally, any message, using your private key.

To work with accounts in the front-end application, you will need to install the following libraries:

```sh:no-line-numbers
npm install @unique-nft/sdk @unique-nft/utils
```

In this guide, we will implement the connection of accounts stored in the local browser storage, as well as those supplied by browser extensions, such as Polkadot and Metamask. 

But let's start with creating an account interface in accordance with its abstraction:

```typescript
import { Signer } from "@unique-nft/sdk";

//define enum of signer types 
enum SignerTypeEnum {
    Local = 'Local',
    Polkadot = 'Polkadot',
    Metamask = 'Metamask'
}

interface Account {
  name: string; // human-readable name of account
  address: string; // address
  signerType: SignerTypeEnum; // type of account
  signer: Signer; // interface for sign transaction via SDK
}
```

The transaction signing mechanism in the SDK requires that the Signer interface contains the sign method:

```typescript
// @unique-nft/sdk
interface Signer {
    address?: string;
    sign(unsignedTxPayload: UnsignedTxPayloadBody): Promise<SignTxResultResponse>;
}
```

## Local Account

### Create local account

Creating an account begins with generating a random mnemonic. To generate an account in the UI, the user can be asked to enter a mnemonic in the field or generate a new one. To generate, we will use the `@unique-nft/sr25519` library:

```sh:no-line-numbers
npm install @unique-nft/sr25519
```

The `@unique-nft/sr25519` library is a specific implementation of the `SR25519` cryptographic algorithm. It provides a set of functions and utilities for working with the SR25519 keypair generation, signing, verification, and other related operations. `SR25519` is a cryptographic algorithm used in blockchain networks, particularly in Substrate-based systems like `Polkadot` and Kusama. This library enables developers to integrate and interact with the SR25519 cryptography in their applications or projects within those blockchain ecosystems.

To encrypt mnemonic pharase and save it in localStorage we use cryptographic library `tweetnacl-ts`:

```sh:no-line-numbers
npm install tweetnacl-ts 
```

We can get the mnemonic phrase:

```typescript
import { Sr25519Account } from '@unique-nft/sr25519';

const mnemonic = Sr25519Account.generateMnemonic()
```

It is also necessary to request the user’s password and, if desired, an account name (a human-readable name for better UX), after which we will encrypt mnemonic phrase by the password and save it in localStorage.

```typescript
import { StringUtils } from '@unique-nft/utils';
import { secretbox } from 'tweetnacl-ts';
import { algorithms } from '@unique-nft/utils/address';

// get passphrase hash
const passwordHash = algorithms.keccak_256(passphrase)

// encrypt mnemonic phrase
const boxed = secretbox(
  StringUtils.Utf8.stringToU8a(mnemonicPhrase), 
  NONCE, 
  passwordHash
);

// save 
localStorage.setItem(`account:${address}`, JSON.stringify({ 
  name, 
  secret: StringUtils.HexString.fromU8a(boxed) 
}));
```

The `secretbox` function in the `tweetnacl-ts` library is used for encrypting messages using symmetric-key encryption. It takes a message and a secret key as input and generates an encrypted message that can be transmitted over insecure communication channels. The `secretbox` function provides data confidentiality, allowing the sender and recipient to exchange information without the risk of it being read by a third party.

The 'nonce' constant in the secretbox function of the tweetnacl-ts library is a unique value used in symmetric-key encryption to ensure the uniqueness of each encrypted message. Nonce stands for "number used once."

Finally, let's define the complete function that creates the account:

```typescript
function addLocalAccount(name: string, mnemonicPhrase: string, passphrase: string) {
  const passwordHash = algorithms.keccak_256(passphrase)

  const { address } = Sr25519Account.fromUri(mnemonicPhrase); 
  
  const secret = secretbox(
    StringUtils.Utf8.stringToU8a(mnemonicPhrase), 
    NONCE, 
    passwordHash
  );

  localStorage.setItem(`account:${address}`, JSON.stringify({ 
    name, 
    secret: StringUtils.HexString.fromU8a(secret) 
  }));
}
```

### Getting a list of accounts
To fetch all accounts from localStorage, we will iterate all the keys, select accounts and add this account into a `Map<address, Account>`:

```typescript

function getLocalAccounts(askPassphraseCallback: AskPassphraseCallback) {
  const accounts = new Map<string, Account>();
  for (const key of Object.keys(localStorage)) {
    if(key && /^account:/.test(key)){
      const value = localStorage.getItem(key);
      if(!value) break;
      const address = key.split(':')[1];
      const { name, secret } = JSON.parse(value);
      
      accounts.set(address,  {
        name,
        address,
        signerType: SignerTypeEnum.Local,
        signer: new LocalAccountSigner(secret, askPassphraseCallback)
      });
    }
  }

  return accounts;
};
```

In the code above, the `askPassphraseCallback` argument passes the callback that will be needed to call the mechanism in the UI for obtaining a password from the user. This callback will be called in the sign method, display a password entry form in the UI and wait for the user’s response, in which we can also unlock the keyring of the account. To do this, we will pass it to the `LocalAccountSigner` constructor. In the next chapter we will describe the KeyringSigner class. In the meantime, let’s take a closer look at signing and calling the password entry form.

To understand the principle of calling a password entry form from a callback to the UI, here is a small example. Let's say we have this html:

```html
<html>
  <head></head>
  <body>
    <div>
        <!-- some UI, content, etc -->
        ... 
    </div>
    <!-- Ask password modal -->
    <div id='ask-password-modal'>
      <label for='ask-password-input'>give me your password</label>
      <input id='ask-password-input' type='password' />
      <button id='ask-password-submit'>submit</button>
    </div>
  </body>
</html>
```

Let's write a callback code that, when called, will show a modal window with a password input field and return a Promise awaiting the user's response:

```typescript
function showAskPasswordModal(decrypt: (password: string) => boolean) { 
  return new Promise((resolve) => {
    modal.classList.add('visible'); // show modal
  
    submitButton.onclick = () => {
      modal.classList.remove('visible'); // hide modal
      const password = passworInput.value; // get password
      if (decrypt(password)) { // decrypt 
        resolve();
      } 
    }
  });
}
```

### Sign a transaction via SDK

The SDK expects a signer object containing a method:

```typescript:no-line-numbers
// @unique-nft/sdk
async sign(unsignedTxPayload: UnsignedTxPayloadBody): Promise<SignTxResultResponse>
```
to sign a transaction. Let's describe a class for creating a signer object for local accounts:

```typescript
export class LocalAccountSigner implements Signer {
  secret: string;
  askPassphraseCallback: AskPassphraseCallback;

  constructor(secret: string, askPassphraseCallback: AskPassphraseCallback) {
    this.secret = secret;
    this.askPassphraseCallback = askPassphraseCallback;
  }

  private async getAccount() {
    let mnemonicPhrase: string | undefined;

    await this.askPassphraseCallback?.((passphrase: string) => {
      // get password hash
      const passwordHash = Address.algorithms.keccak_256(passphrase)

      // decrypt
      const mnemonicPhraseU8a = secretbox_open(
        StringUtils.HexString.toU8a(this.secret),
        NONCE,
        passwordHash
      );

      if (mnemonicPhraseU8a) {
        mnemonicPhrase = StringUtils.Utf8.u8aToString(mnemonicPhraseU8a);
      }

      return !!mnemonicPhrase;
    });
    if(!mnemonicPhrase) return;
    return Sr25519Account.fromUri(mnemonicPhrase);
  }

  public async sign(unsignedTxPayload: UnsignedTxPayloadBody): Promise<SignTxResultResponse> {
    const account = await this.getAccount();
    if(!account) throw new Error('No account');

    return await account.signer.sign(unsignedTxPayload);
  }
}
```

We now have two ways to pass signer to the SDK:

a. when initializing the SDK client (if there is only one account in the application or there is a default account):

```typescript
const sdk = new Sdk({
      baseUrl,
      signer: account.signer
    })
```

b. when creating a transaction:
```typescript
sdk?.balance.transfer.submitWaitResult({
  address: sender.address,
  destination: receiver.address,
  amount: 100,
}, {
  signer: sender.signer, // signer here
})
```

### Sign a message

Sometimes it becomes necessary to sign not only transactions but also some text messages. To do this, we’ll add the `signMessage` method to our class:

```typescript
export class LocalAccountSigner implements Signer {
  ...

  public async signMessage(message: string): Promise<string> {
    const account = await this.getAccount();
    if(!account) throw new Error('No account');

    const signatureU8a = account.sign(message);
    return StringUtils.HexString.fromU8a(signatureU8a);
  }
}
```

### Remove account

To delete a local account in the local storage just remove key:

```typescript
function deleteLocalAccount(address: string) { 
  localStorage.removeItem(`account:${address}`);
}
```

## Polkadot-extension Account
### Getting a list of accounts

To work with accounts in browser extensions, for example Polkadot extension, the `@unique-nft/utils` library provides a module:

```typescript
import { Polkadot } from '@unique-nft/utils/extension';

const { accounts } = await Polkadot.enableAndLoadAllWallets();
```

The `enableAndLoadAllWallets` method allows you to get an array of accounts, or triggers one of the errors:

```typescript
export const getPolkadotAccounts = async () => { 
  try {
    const { accounts } = await Polkadot.enableAndLoadAllWallets()

    return new Map<string, Account>(
      accounts.map(({ name, address, signer }) => {
        return [
          address, // address as map key
          {
              name,
              address,
              signerType: SignerTypeEnum.Polkadot,
              signer,
          }
        ]
      })
    );
  } catch(e: any) {
    if (e.extensionNotFound) {
      alert(`Please install some polkadot.js compatible extension`)
    } else if (e.accountsNotFound) {
      if (e.userHasWalletsButHasNoAccounts) {
        alert(`Please, create an account in your wallet`)
      } else if (e.userHasBlockedAllWallets) {
        alert(`Please, grant access to at least one of your accounts`)
      }
    } else {
      alert(`Connection to polkadot extension failed: ${e.message}`)
    }
  }
  return new Map();
};
```

### Sign a transaction via SDK

The accounts array element with type `IPolkadotExtensionAccount` already contains a signer object, it's ready for use with the SDK:

```typescript
const sdk = new Sdk({
      baseUrl,
      signer: account.signer
    })
```

Or when creating a transaction:

```typescript
sdk?.balance.transfer.submitWaitResult({
  address: sender.address,
  destination: receiver.address,
  amount: 100,
}, {
  signer: sender.signer, // signer here
})
```

### Sign a message
Also in the `IPolkadotExtensionAccount` interface there is a `signRaw` method:

```typescript
signRaw: (raw: SignerPayloadRawWithAddressAndTypeOptional | string) => Promise<SignerResult>
``` 

It will easily allow you to sign a string value.

## Metamask-extension Account
### Getting a list of accounts

For Ethereum browser extensions, like Metamask the `@unique-nft/utils` library provides a module Ethereum:

```typescript
import { Ethereum } from '@unique-nft/utils/extension'

try {
  const {address, chainId} = await Ethereum.requestAccounts()
} catch (e: IEthereumExtensionError) {
  if (e.extensionNotFound) {
    alert(`Please install some ethereum browser extension`)
  } else if (e.userRejected) {
    alert(`User rejected access`)
  } else {
    alert(`Connection to ethereum extension failed: ${e.message}`)
  }
}
```

### Sign and send a transaction
To create and sign transactions via the Ethereum-like extension, install the following libraries:

```sh:no-line-numbers
npm install ethers @unique-nft/solidity-interfaces
```

The `ethers` module is needed to create a Web3 provider, which is used to connect and interact with Ethereum nodes. 
The `@unique-nft/solidity-interfaces` library is a Solidity-specific library designed for creating and working with non-fungible tokens (NFTs) on the Ethereum blockchain. This library offers functionalities such as defining NFT contract interfaces, implementing NFT metadata and URI standards, handling token ownership and transfers, and managing token metadata storage. By using `@unique-nft/solidity-interfaces`, developers can efficiently build, deploy, and interact with NFT contracts in their Solidity projects, ensuring compatibility with other NFT-related applications and protocols.

Finally, we can transfer some tokens:

```typescript
import { ethers } from "ethers";
import { UniqueFungibleFactory } from "@unique-nft/solidity-interfaces"
import { Address } from "@unique-nft/utils"

//get ethers provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = await provider.getSigner(sender.address)

// convert addresses to CrossAccountId
const from = Address.extract.ethCrossAccountId(sender.address); 
const to = Address.extract.ethCrossAccountId(receiver.address);

// get factory
const uniqueFungible = await UniqueFungibleFactory(0, signer);

// make transsaction 
const contractTransaction = await uniqueFungible.transferFromCross(from, to, amountRaw, { from: sender.address }));

// wait
await contractTransaction.wait()
```

### Sign a message

Also, to sign a message, we can use `provider`:

```typescript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = await provider.getSigner(address)
const result = await signer.signMessage(message); 
```

## Subscription to balance changes via SDK

The SDK-client allows to subscribe on changing account balance:

```typescript
import { SocketClient, SubscriptionEvents } from '@unique-nft/sdk/full';
// connect client
const client: SocketClient = sdk.subscription.connect({
  transports: ['websocket']
});

// subscribe 
client.subscribeAccountCurrentBalance({ address: accountAddress });

client.on(SubscriptionEvents.ACCOUNT_CURRENT_BALANCE, (_, data) => {
 
 // update balance here

})
```

Argument `data` will be an object with the parameter `balance`:

```typescript
interface AccountCurrentBalanceData {
  extrinsic: Extrinsic;
  balance: AllBalancesResponse;
}
```

And AllBalancesResponse is:

```typescript
interface AllBalancesResponse {
  availableBalance: BalanceResponse; // transferable balance
  lockedBalance: BalanceResponse;    // any frozen balance: staking, vesting etc
  freeBalance: BalanceResponse;      // transferable + locked balance

  address: string;
}
```

Every balance contains this:

```typescript
interface BalanceResponse {
  /** @example 92485000000000000 */
  raw: string;
  /** @example 0.092485000000000000 */
  amount: string;
  /** @example 92.4850 m */
  formatted: string;
  /** @example UNQ */
  unit: string;
  /** @example 18 */
  decimals: number;
}
```

For example, we can extend the `Account` for saving balances:

```typescript
interface Account {
  // ...
  balances: AllBalancesResponse
}
```

Finally, we can update balances:

```typescript
client.on(SubscriptionEvents.ACCOUNT_CURRENT_BALANCE, (_, data) => {
  const { balance } = data; 

  accounts.get(balance.address).balances = balance;
})
```

## Examples of working with accounts

There are couple examples of use with popular front-end frameworks:

[React Example](https://github.com/UniqueNetwork/accounts-react-example)

[Vue Example](https://github.com/UniqueNetwork/accounts-vue-example)
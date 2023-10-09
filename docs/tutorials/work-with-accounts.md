# Cookbook for working with accounts and signers

## Account as an entity

A blockchain account is an entity associated with a public blockchain address to identify a network participant and is used to sign transactions. In Web3, you digitally sign any transaction, or more generally, any message, using your private key.

To work with accounts in the front-end application, you will need to install the following libraries:

```sh:no-line-numbers
npm install @polkadot/ui-keyring @polkadot/keyring @unique-nft/utils
```

We will also install the Unique SDK client to interact with the blockchain:

```sh:no-line-numbers
npm install @unique-nft/sdk
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

## Local Keyring Account
### Getting a list of accounts

To manage local accounts in a browser based on `@polkadot/keyring`, we use the `@polkadot/ui-keyring` wrapper, which allows you to generate, save and retrieve keyring pairs from local storage. 

```typescript
import keyring from '@polkadot/ui-keyring';

keyring.loadAll({ type: 'sr25519' }); // initializes the underlying @polkadot/keyring (only once)
```

The loadAll function in `@polkadot/ui-keyring` is used to retrieve all key pairs stored in the local keyring. It allows accessing and using previously saved keys for various operations, such as signing transactions or verifying identities within the Polkadot ecosystem. This function provides a convenient way to load and manage multiple key pairs without loading them individually. Option `type` needs to set `KeypairType`, which represents the type of key pair used for identification and transaction signing in the Polkadot network. A key pair consists of a private key and a public key. `KeypairType` determines the specific encryption algorithm used to create and work with this key pair. 

The next step - getting all accounts:

```typescript
const keyringAddresses = keyring.getAccounts();
```

Each account keyring contains the following properties:

```typescript
export interface KeyringAddress {
    readonly address: string;
    readonly meta: KeyringJson$Meta;
    readonly publicKey: Uint8Array;
}
```

From all this we need `address` and `meta.name`. Let’s wrap getting the account in a function that will convert the keyringAddresses array into a `Map<address, Account>` for ease of use in the future:

```typescript
function getLocalAccounts(askPassphraseCallback: AskPassphraseCallback) {
  const keyringAddresses = keyring.getAccounts();
  
  return new Map<string, Account>(
    keyringAddresses.map(({ address, meta,  }) => {
      return [
        address, // address as map key
        {
            name: meta.name || "untitled",
            address,
            signerType: SignerTypeEnum.Local,
            signer: new KeyringSigner(address, askPassphraseCallback)
        }
      ]
    })
  );
};
```

In the code above, the `askPassphraseCallback` argument passes the callback that will be needed to call the mechanism in the UI for obtaining a password from the user. This callback will be called in the sign method, display a password entry form in the UI and wait for the user’s response, in which we can also unlock the keyring of the account. To do this, we will pass it to the `KeyringSigner` constructor.

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
function showAskPasswordModal(keyringPair: KeyringPair) { 
  return new Promise((resolve) => {
    modal.classList.add('visible'); // show modal
  
    submitButton.onclick = () => {
      modal.classList.remove('visible'); // hide modal
      const password = passworInput.value; // get password
      keyringPair.unlock(password); // unlock
      resolve();
    }
  });
}
```

It is also recommended to wrap the call to the unlock(password) method in a try... catch construct and catch errors when unlocking.

### Sign a transaction via SDK

The SDK expects a signer object containing a method:

```typescript:no-line-numbers
// @unique-nft/sdk
async sign(unsignedTxPayload: UnsignedTxPayloadBody): Promise<SignTxResultResponse>
```
to sign a transaction. Let's describe a class for creating a signer object for local accounts:

```typescript
class KeyringSigner implements Signer {
  address: string;
  askPassphraseCallback: AskPassphraseCallback;

  constructor(address: string, askPassphraseCallback: AskPassphraseCallback) {
    this.address = address;
    this.askPassphraseCallback = askPassphraseCallback;
  }

  public async sign(unsignedTxPayload: UnsignedTxPayloadBody): Promise<SignTxResultResponse> {
    const keyringPair = keyring.getPair(this.address);
    // if pair is locked and we have callback for asking password
    if (keyringPair.isLocked && this.askPassphraseCallback) {
      await this.askPassphraseCallback(keyringPair); // show password form and wait 
    }
    // sign transaction
    const signature = keyringPair.sign(
      unsignedTxPayload.signerPayloadHex,
      {
        withType: true
      }
    );
    keyringPair.lock();
    // return SignTxResultResponse
    return {
      signature: HexString.fromU8a(signature),
      signatureType: keyringPair.type
    };
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
export class KeyringSigner implements Signer {
  ...
  public async signMessage(message: string): Promise<string> {
    const keyringPair = keyring.getPair(this.address);
    if (keyringPair.isLocked && this.askPassphraseCallback) {
      await this.askPassphraseCallback(keyringPair);
    }
    const signature = keyringPair.sign(
      message,
      {
        withType: true
      }
    );
    keyringPair.lock();

    return HexString.fromU8a(signature);
  }
}
```

### Create a new account

Creating an account begins with generating a random mnemonic of 12 words. To generate an account in the UI, the user can be asked to enter a mnemonic in the field or generate a new one. To generate, we will use the `@polkadot/util-crypto` library:

```sh:no-line-numbers
npm install @polkadot/util-crypto
```
We can get the mnemonic phrase:

```typescript
import { mnemonicGenerate } from '@polkadot/util-crypto';

const mnemonic = mnemonicGenerate(12);
```

It is also necessary to request the user’s password and, if desired, an account name (a human-readable name for better UX), after which we create an account using the `keyring.addUri` method

```typescript
const { pair } = keyring.addUri(mnemonic, password, { name });
```

The `addUri` function is used to add a new key pair to the local keyring by providing a URI. This URI typically includes the necessary information for generating a new key pair, such as a mnemonic phrase or a seed. After that, you can easily refetch existing accounts.

### Remove account

Deleting a local account in the local storage is performed by calling the method:

```typescript
keyring.forgetAddress(address);
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




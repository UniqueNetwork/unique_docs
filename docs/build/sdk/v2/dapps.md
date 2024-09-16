# Building DApps

This guide provides a walkthrough of how to get started building decentralized applications (dApps) using the [Unique Network React Template](https://github.com/UniqueNetwork/unique-react-template). This boilerplate is designed to simplify development for projects on the Unique Network, leveraging modern tools such as React, TypeScript, and the Unique SDK.

Check out the live [demo](https://plate.uniquenetwork.dev).

[[toc]]

## Quick Start
To get started with the boilerplate, follow these steps:

1. Create your repository with a GitHub template:

- On [GitHub](https://github.com/UniqueNetwork/unique-react-template), navigate to the repository's main page.
- Above the file list, click Use this template.
- Select Create a new repository.

... or just clone the repo with the following command:

```sh:no-line-numbers
git clone [<repository-url>](https://github.com/UniqueNetwork/unique-react-template)
```

2. Install dependencies:

```sh:no-line-numbers
yarn
```

3. Run the development server:

```sh:no-line-numbers
yarn start
```

## Working with the Unique SDK

The Unique SDK enables you to interact with Substrate-based networks, particularly focusing on NFT operations and tokenized assets. This section will cover the basic setup, configuration, and common operations using the SDK within the context of the provided boilerplate.

### SDK Overview
The Unique SDK (@unique-nft/sdk) is designed to abstract complexities when working with the blockchain and provides high-level functionality to create, manage, and query NFTs on the Unique Network.

The boilerplate already integrates the SDK through a global context provider. Let's break down how to configure and interact with the SDK.

#### Step 1: Initialization of the SDK

The SDK is initialized within the boilerplate in the `src/sdk/SdkContext.tsx` file. This context is used to provide access to the SDK throughout the application.

Example of SDK Initialization:

```ts
import { Sdk } from '@unique-nft/sdk';
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

interface ISdkContext {
  sdk: Sdk | null;
}

const SdkContext = createContext<ISdkContext>({ sdk: null });

export const SdkProvider = ({ children }: { children: ReactNode }) => {
  const [sdk, setSdk] = useState<Sdk | null>(null);

  useEffect(() => {
    const initializeSdk = async () => {
      const sdkInstance = await Sdk.create({
        baseUrl: 'https://rest.unique.network/v2/opal', // Example URL for testnet
      });
      setSdk(sdkInstance);
    };

    initializeSdk();
  }, []);

  return (
    <SdkContext.Provider value={{ sdk }}>
      {children}
    </SdkContext.Provider>
  );
};

export const useSdk = () => useContext(SdkContext);
```

- Base URL: This is the endpoint to which the SDK will connect. In this example, it connects to the Opal testnet, but you can change this URL to point to the mainnet or other environments. You can find the list of endpoints in the [reference section](../../../reference/sdk-endpoints.md).
- Provider Component: The SdkProvider component initializes the SDK and stores it in the global state using React.Context. This allows other components to easily access the SDK through the `useSdk` hook.


#### Step 2: Accessing the SDK in Components

Once the SDK is initialized, you can access it in any component using the useSdk hook. This enables you to perform operations like querying NFTs, creating collections, or transferring tokens.

Example Usage of SDK in a Component:

```ts
import { useSdk } from '../sdk/SdkContext';

const MyComponent = () => {
  const { sdk } = useSdk();

  const fetchNFT = async (tokenId: number) => {
    if (!sdk) return;

    try {
      const nft = await sdk.token.get({ collectionId: 123, tokenId });
      console.log('NFT Data:', nft);
    } catch (error) {
      console.error('Error fetching NFT:', error);
    }
  };

  return (
    <div>
      <button onClick={() => fetchNFT(1)}>Fetch NFT</button>
    </div>
  );
};

export default MyComponent;
```

## Connecting Accounts

The boilerplate comes preconfigured to support multiple wallet providers, including Polkadot-based wallets and WalletConnect (for EVM-based wallets). This section explains how to connect these wallets and manage user accounts in your dApp.

### Connecting Polkadot wallets

This section explains how to integrate Polkadot-based wallets into your dApp using the boilerplate provided. It supports a variety of wallets, such as Polkadot.js, SubWallet, Talisman, Enkrypt, and NovaWallet. By using the Polkadot Wallet class, users can easily connect their wallets, manage accounts, and sign transactions on the Unique Network.

#### Step-1. Polkadot Wallet Setup

The boilerplate provides a PolkadotWallet class that handles interaction with various Polkadot-based wallets. This class can be instantiated with the name of the wallet the user wants to connect to, and it provides methods for managing accounts and signing transactions.

Example of Polkadot Wallet Setup

```ts
import { PolkadotWallet } from './PolkadotWallet';

const polkadotWallet = new PolkadotWallet('polkadot-js');  // Instantiate with the wallet of choice
```

- PolkadotWallet: This class supports all Polkadot-compatible wallets like Polkadot.js, Subwallet, Talisman, etc.
- Wallet name: Pass the wallet name when instantiating the PolkadotWallet class. The following options are available: `polkadot-js` `subwallet-js` `talisman` `enkrypt` `novawallet`

#### Step-2. Connecting to a Polkadot Wallet

Once the wallet instance is created, you can request the user to connect their wallet and retrieve their accounts. The _accounts property within the class stores the accounts associated with the connected wallet.

Example: Connecting to Wallet and Retrieving Accounts

```ts
const connectAndFetchAccounts = async () => {
  try {
    await polkadotWallet.connect();  // Initiates connection
    const accounts = await polkadotWallet.getAccounts();  // Retrieves wallet accounts
    console.log('Connected accounts:', accounts);
  } catch (error) {
    console.error('Error connecting to wallet:', error);
  }
};
```

- `polkadotWallet.connect()`: Initiates the connection to the wallet. If the user approves, this method connects the wallet and prepares it for account management.
- `polkadotWallet.getAccounts()`: After the connection is established, this method retrieves the user's accounts from the wallet extension.

#### Step-3. Connecting to EVM wallets

The provided code integrates WalletConnect with the Unique Network boilerplate, allowing users to connect Ethereum-compatible wallets like MetaMask, to the dApp. Here's a breakdown of the key elements involved in this process, followed by a guide on how to use WalletConnect in your dApp.

The createWeb3Modal function creates a modal that enables users to connect their Ethereum wallets. Here's the basic setup:

```ts
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

const projectId = process.env.REACT_APP_PROJECT_ID;
const chains = [
  {
    id: parseInt(process.env.REACT_APP_CHAIN_ID ?? "8880", 10),
    name: process.env.REACT_APP_CHAIN_NAME ?? "Unique Mainnet",
    rpcUrls: { default: { http: [process.env.REACT_APP_CHAIN_RPC_URL] } },
    nativeCurrency: { name: "UNQ", symbol: "UNQ", decimals: 18 },
  },
];

const config = defaultWagmiConfig({ chains, projectId });

createWeb3Modal({ wagmiConfig: config, projectId });
```

To display the modal, you can trigger it with a button:

```ts
import { useWeb3Modal } from "@web3modal/wagmi/react";

const WalletConnectButton = () => {
  const web3Modal = useWeb3Modal();

  const connectWallet = () => {
    web3Modal.openModal();
  };

  return <button onClick={connectWallet}>Connect Ethereum Wallet</button>;
};

export default WalletConnectButton;
```

Once a wallet is connected, use wagmi to access the account information:

```ts
import { useAccount } from "wagmi";

const AccountDetails = () => {
  const { address, isConnected } = useAccount();

  return isConnected ? <p>Connected: {address}</p> : <p>No wallet connected</p>;
};

export default AccountDetails;
```

### Using Connected Account with SDK

To use the connected Polkadot account, you need to access it from the `AccountsContext`. This gives you the currently selected account, which you can then use in the SDK.

You can use `connectSdk` function to create an SDK instance connected to the account.

```ts
import { UniqueChain } from "@unique-nft/sdk";
import { Account, WalletsType } from "../accounts/types";

export const connectSdk = async (
  sdkEndpoint: string,
  account?: Account<WalletsType> 
) => {
  const uniqueChain = UniqueChain({
    baseUrl: sdkEndpoint,
    //@ts-ignore
    account,
  });

  return uniqueChain;
};
```

Putting it all together:

```ts
import { useContext } from 'react';
import { AccountsContext } from '../accounts/AccountsContext';

const MyComponent = () => {
  const { selectedAccount } = useContext(AccountsContext);

  const createNftCollection = async () => {
    const sdk = await connectSdk(baseUrl, selectedAccount);

    // ...
  }

  // ...
};
```


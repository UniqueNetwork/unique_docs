# Building DApps

This guide walks you through building a decentralized application (dApp) on Unique Network using Next.js and the Unique SDK for blockchain interactions.

[[toc]]

## Overview

We'll build a minimal dApp that allows users to:

- Connect their Polkadot wallet (Polkadot.js, SubWallet, Talisman, Enkrypt, etc.)
- View their account balance
- Execute transactions using the Unique SDK

This approach uses `@unique-nft/utils/extension`, which provides a simple interface for connecting to Polkadot-compatible wallets.

For a minimal working template, check out the [Unique Network Next.js Template](https://github.com/UniqueNetwork/unique-template).

## Project Setup

Create a new Next.js project:

```sh:no-line-numbers
npx create-next-app@latest my-unique-dapp
cd my-unique-dapp
```

When prompted, select:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes (optional)
- App Router: Yes

## Installing Dependencies

Install the required packages:

```sh:no-line-numbers
npm install @unique-nft/sdk
```

## Project Structure

Create the following structure:

```
app/
├── layout.tsx
└── page.tsx
context/
├── WalletContext.tsx
└── UniqueSDKContext.tsx
```

## Step 1: Create Wallet Context

Create `context/WalletContext.tsx` to manage wallet connection:

```tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  Polkadot,
  IPolkadotExtensionAccount,
  IPolkadotExtensionWalletInfo,
} from "@unique-nft/utils/extension";

interface WalletContextType {
  wallets: IPolkadotExtensionWalletInfo[];
  wallet: IPolkadotExtensionWalletInfo | null;
  accounts: IPolkadotExtensionAccount[];
  selectedAccount: IPolkadotExtensionAccount | null;
  isConnecting: boolean;
  connectWallet: (wallet: IPolkadotExtensionWalletInfo) => Promise<void>;
  selectAccount: (account: IPolkadotExtensionAccount) => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<IPolkadotExtensionWalletInfo[]>([]);
  const [wallet, setWallet] = useState<IPolkadotExtensionWalletInfo | null>(
    null
  );
  const [accounts, setAccounts] = useState<IPolkadotExtensionAccount[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<IPolkadotExtensionAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Load available wallets on mount
  useEffect(() => {
    Polkadot.listWallets().then((result) => setWallets(result.wallets));
  }, []);

  // ... implement connectWallet, disconnectWallet, selectAccount
}
```

Key points:

- `Polkadot.listWallets()` - Gets all installed wallet extensions
- `IPolkadotExtensionAccount` - Already includes a signer for transactions
- Accounts have `address`, `name`, and `signer` properties

## Step 2: Connecting a Wallet

Add the wallet connection logic to `WalletContext.tsx`:

```tsx
const connectWallet = useCallback(
  async (selectedWallet: IPolkadotExtensionWalletInfo) => {
    setIsConnecting(true);
    try {
      // Load wallet with accounts
      const wallet = await Polkadot.loadWalletByName(selectedWallet.name);

      if (!wallet || wallet.accounts.length === 0) {
        throw new Error("No accounts found in wallet");
      }

      setWallet(wallet);
      setAccounts(wallet.accounts);
      setSelectedAccount(wallet.accounts[0]); // Auto-select first account
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  },
  []
);
```

Key points:

- `Polkadot.loadWalletByName()` - Connects to wallet and retrieves accounts
- The returned wallet object contains accounts with signers ready to use
- Handle errors gracefully when wallet connection fails

## Step 3: Create SDK Context

Create `context/UniqueSDKContext.tsx` to initialize the SDK:

```tsx
"use client";

import { createContext, useContext } from "react";
import { AssetHub, AssetHubInstance } from "@unique-nft/sdk";

type SdkContextType = {
  sdk: AssetHubInstance;
};

const UniqueSDKContext = createContext<SdkContextType | undefined>(undefined);

export function UniqueSDKProvider({ children }: { children: React.ReactNode }) {
  const sdk = AssetHub({
    baseUrl: process.env.NEXT_PUBLIC_REST_URL || "http://localhost:3000",
  });

  return (
    <UniqueSDKContext.Provider value={{ sdk }}>
      {children}
    </UniqueSDKContext.Provider>
  );
}

export function useSdk() {
  const context = useContext(UniqueSDKContext);
  if (!context) throw new Error("useSdk must be used within UniqueSDKProvider");
  return context.sdk;
}
```

## Step 4: Update App Layout

Update `app/layout.tsx` to wrap your app with providers:

```tsx
import { WalletProvider } from "@/context/WalletContext";
import { UniqueSDKProvider } from "@/context/UniqueSDKContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UniqueSDKProvider>
          <WalletProvider>{children}</WalletProvider>
        </UniqueSDKProvider>
      </body>
    </html>
  );
}
```

**Important:** Wrap `WalletProvider` inside `UniqueSDKProvider` so both SDK and wallet are available throughout your app.

## Step 5: Run Your dApp

Start the development server:

```sh:no-line-numbers
npm run dev
```

## Using SDK with Connected Account

Once you have wallet connection working, you can perform blockchain operations. Here's how to execute transactions:

### Fetching Account Balance

```tsx
import { useSdk } from "@/context/UniqueSDKContext";
import { useWallet } from "@/context/WalletContext";

function BalanceDisplay() {
  const sdk = useSdk();
  const { selectedAccount } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!selectedAccount) return;

    const result = await sdk.balance.get({
      address: selectedAccount.address,
    });

    setBalance(result.availableBalance.amount);
  };

  // ... return JSX with balance display
}
```

### Executing Transactions

To execute transactions, pass the account signer to SDK methods:

```tsx
const sdk = useSdk();
const { selectedAccount } = useWallet();

// Transfer tokens example
const result = await sdk.extrinsics.submitWaitResult(
  {
    address: selectedAccount.address,
    section: "balances",
    method: "transferKeepAlive",
    args: [recipientAddress, amount],
  },
  selectedAccount.signer // Use account signer directly
);
```

Key points:

- `selectedAccount.signer` is ready to use with SDK methods
- All transaction methods accept the signer as the last parameter
- The signer handles signing prompts automatically through the wallet extension

## Additional Resources

- [Unique Network Documentation](https://docs.unique.network)
- [Unique SDK Reference](https://docs.unique.network/sdk)
- [Minimal Template Repository](https://github.com/UniqueNetwork/unique-template)
- [Polkadot.js API](https://polkadot.js.org/docs/)

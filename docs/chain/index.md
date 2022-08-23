# Chain

## Unique Mainnet on Polkadot

The Unique Mainnet is the production environment. The UNQ token has value and all NFTs, RFTs, and Fungible tokens may
have value and are never destroyed by the network updates.

| Parameter                      | Value                                                                                                                                                                  |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| WebSocket URL                  | wss://ws.unique.network <CopyButton data="wss://ws.unique.network"/>                                                                                                   |
| SS58 Prefix                    | 7391 <CopyButton :data="7391"/> (gives "un" at the beginning of an address)                                                                                            |
| EVM Network URL (RPC Endpoint) | https://rpc.unique.network <CopyButton data="https://rpc.unique.network"/> <Button title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.unique)"/> |
| Ethereum Chain ID              | 8880 <CopyButton :data="8880"/> (0x22b0)                                                                                                                               |
| Currency Symbol                | UNQ <CopyButton data="UNQ"/>                                                                                                                                           |
| Decimals                       | 18  <CopyButton :data="18"/>                                                                                                                                           |

## Quartz Mainnet on Kusama

The Quartz Mainnet is the production environment. The QTZ token has value and all NFTs, RFTs, and Fungible tokens may
have value and are never destroyed by the network updates.

| Parameter                      | Value                                                                                                                                                                                |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| WebSocket URL                  | wss://ws-quartz.unique.network <CopyButton data="wss://ws-quartz.unique.network"/>                                                                                                   |
| SS58 Prefix                    | 255 <CopyButton :data="255"/> (gives "yG" at the beginning of an address)                                                                                                            |
| EVM Network URL (RPC Endpoint) | https://rpc-quartz.unique.network <CopyButton data="https://rpc-quartz.unique.network"/> <Button title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.quartz)"/> |
| Ethereum Chain ID              | 8881  <CopyButton :data="8881"/> (0x22b1)                                                                                                                                            |
| Currency Symbol                | QTZ  <CopyButton data="QTZ"/>                                                                                                                                                        |
| Decimals                       | 18   <CopyButton :data="18"/>                                                                                                                                                        |

QTZ token can be obtained on [MEXC](https://www.mexc.com/ru-RU/exchange/QTZ_USDT) or
with [Karura SWAP](https://apps.karura.network/swap).

## Opal Testnet

Unique Network provides an Opal Testnet to it's users in order to play with all blockchain features in a safe and free
of network fees environment.&#x20;

| Parameter                      | Value                                                                                                                                                                          |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| WebSocket URL                  | wss://ws-opal.unique.network <CopyButton data="wss://ws-opal.unique.network"/>                                                                                                 |
| SS58 Prefix                    | 42 <CopyButton :data="42"/> (default, gives "5" at the beginning of an address)                                                                                                |
| EVM Network URL (RPC Endpoint) | https://rpc-opal.unique.network <CopyButton data="https://rpc-opal.unique.network"/> <Button title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.opal)"/> |
| Ethereum Chain ID              | 8882 <CopyButton data="8882"/> (0x22b2)                                                                                                                                        |
| Currency Symbol                | OPL <CopyButton data="OPL"/>                                                                                                                                                   |
| Decimals                       | 18  <CopyButton data="18"/>                                                                                                                                                    |

OPL token has no value and can be obtained from the Telegram faucet bot:&#x20;

[**@UniqueFaucetBot**](https://t.me/unique2faucet\_opal\_bot) **for Opal**

The NFTs, Fungible, and ReFungible tokens minted on the Opal Testnet should also have no value.

## Sapphire Mainnet [under construction, live in August]

The Sapphire Mainnet is the production environment. The QTZ token has value and all NFTs, RFTs, and Fungible tokens may
have value and are never destroyed by the network updates. Also, it's the mainnet with the quickest time to market.

| Parameter                      | Value                                                                                                                                                                                               |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| WebSocket URL                  | wss://ws-sapphire.unique.network <CopyButton data="wss://ws-sapphire.unique.network"/>                                                                                                              |
| SS58 Prefix                    | 8883 <CopyButton :data="8883"/> (gives "px" at the beginning of an address)                                                                                                                         |
| EVM Network URL (RPC Endpoint) | https://rpc-sapphire.unique.network <CopyButton data="https://rpc-sapphire.unique.network"/> <Button disabled title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.sapphire)"/> |
| Ethereum Chain ID              | 8883 <CopyButton data="8883"/> (0x22b3)                                                                                                                                                             |
| Currency Symbol                | QTZ <CopyButton data="QTZ"/>                                                                                                                                                                        |
| Decimals                       | 18  <CopyButton data="18"/>                                                                                                                                                                         |

Sapphire network shares QTZ token with the Quartz mainnet. I. e. transaction fees on Sapphire can be paid only with QTZ,
which can be obtained via transferring tokens from Quartz.

QTZ token can be obtained on [MEXC](https://www.mexc.com/ru-RU/exchange/QTZ_USDT) or
with [Karura SWAP](https://apps.karura.network/swap).

<script setup>
import {UNIQUE_CHAINS} from '_utils/constants';
import {addChainToMetamask} from '_utils/metamask';
</script>
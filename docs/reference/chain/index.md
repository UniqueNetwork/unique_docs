# Chain

## Unique Mainnet on Polkadot

The Unique Mainnet is the production environment. The UNQ token has value and all NFTs, RFTs, and Fungible tokens may have value and are never destroyed by the network updates.

| Parameter                      | Value                                                                            |
| ------------------------------ |----------------------------------------------------------------------------------|
| WebSocket URL                  | wss://ws.unique.network <CopyButton data="wss://ws.unique.network"/>             |
| EVM Network URL (RPC Endpoint) | https://rpc.unique.network <CopyButton data="https://rpc.unique.network"/> |
| Ethereum Chain ID              | 8880 <CopyButton data="8880"/>                                                  |
| Currency Symbol                | UNQ <CopyButton data="UNQ"/>                                                     |
| Decimals                       | 18  <CopyButton data="18"/>                                                     |
| AddToMetamask                  | <Button title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.unique)"/>                                        |

## Quartz Mainnet on Kusama

The Quartz Mainnet is the production environment. The QTZ token has value and all NFTs, RFTs, and Fungible tokens may have value and are never destroyed by the network updates.

| Parameter                      | Value                                                                                 |
| ------------------------------ |---------------------------------------------------------------------------------------|
| WebSocket URL                  | wss://ws-quartz.unique.network <CopyButton data="wss://ws-quartz.unique.network"/>    |
| EVM Network URL (RPC Endpoint) | https://rpc-quartz.unique.network <CopyButton data="https://rpc-quartz.unique.network"/> |
| Ethereum Chain ID              | 8881  <CopyButton data="8881"/>                                                      |
| Currency Symbol                | QTZ  <CopyButton data="QTZ"/>                                                         |
| Decimals                       | 18   <CopyButton data="18"/>                                                         |
| AddToMetamask                  | <Button title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.quartz)"/>                                        |



## Opal Testnet

Unique Network provides an Opal Testnet to it's users in order to play with all blockchain features in a safe and free of network fees environment.&#x20;

| Parameter                      | Value                                                               |
| ------------------------------ |---------------------------------------------------------------------|
| WebSocket URL                  | wss://ws-opal.unique.network <CopyButton data="wss://ws-opal.unique.network"/>                                       |
| EVM Network URL (RPC Endpoint) | https://rpc-opal.unique.network <CopyButton data="https://rpc-opal.unique.network"/> |
| Ethereum Chain ID              | 8882 <CopyButton data="8882"/>                                     |
| Currency Symbol                | OPL <CopyButton data="OPL"/>                                        |
| Decimals                       | 18  <CopyButton data="18"/>                                        |
| AddToMetamask                  | <Button title="Add to metamask" :onClick="() => addChainToMetamask(UNIQUE_CHAINS.opal)"/>                                        |

OPL token has no value and can be obtained from the Telegram faucet bot:&#x20;

[**@UniqueFaucetBot**](https://t.me/unique2faucet\_opal\_bot) **for Opal**

The NFTs, Fungible, and ReFungible tokens minted on the Opal Testnet should also have no value and may be destroyed with a network update.

<script setup>
import {UNIQUE_CHAINS} from '_utils/constants';
import {addChainToMetamask} from '_utils/metamask';
</script>
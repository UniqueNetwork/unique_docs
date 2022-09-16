# Chain

## Unique - Polkadot parachain

The Unique Mainnet is the production environment.  
The UNQ token has value and all NFTs, RFTs, and Fungible tokens may
have value and are never destroyed by the network updates.

<ChainTable :chainName="UNIQUE_CHAINS.unique"/>

## Quartz - Kusama parachain

The Quartz Mainnet is the production environment.  
The QTZ token has value and all NFTs, RFTs, and Fungible tokens may
have value and are never destroyed by the network updates.

<ChainTable :chainName="UNIQUE_CHAINS.quartz"/>

QTZ token can be obtained on [MEXC](https://www.mexc.com/ru-RU/exchange/QTZ_USDT) or
with [Karura SWAP](https://apps.karura.network/swap).


## Sapphire - solochain

::: danger Under construction
Sapphire mainnet is under construction, live in September
:::

The Sapphire Mainnet is the production environment.  
It is the mainnet with the quickest time to market (usually, 1 week after Opal testnet).

<ChainTable :chainName="UNIQUE_CHAINS.sapphire" disableMetamask/>

Sapphire network shares QTZ token with the Quartz mainnet. I.e. transaction fees on Sapphire can be paid only with QTZ,
which can be obtained via transferring tokens from Quartz.

QTZ token can be obtained on [MEXC](https://www.mexc.com/ru-RU/exchange/QTZ_USDT) or
with [Karura SWAP](https://apps.karura.network/swap).


## Opal - testnet

Unique Network provides an Opal Testnet to its users to play with all blockchain features in a safe and free
of network fees environment.&#x20;

<ChainTable :chainName="UNIQUE_CHAINS.opal"/>

OPL token has no value and can be obtained from the Telegram faucet bot:&#x20;

[**@UniqueFaucetBot**](https://t.me/unique2faucet\_opal\_bot) **for Opal**

The NFTs, Fungible, and ReFungible tokens minted on the Opal Testnet should also have no value.

<script setup>
import {UNIQUE_CHAINS} from '_utils/constants';
import {addChainToMetamask} from '_utils/metamask';
</script>
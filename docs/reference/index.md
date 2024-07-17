# Networks list

## Unique - Polkadot parachain

The Unique Mainnet is the production environment.  
The UNQ token has value and all NFTs, RFTs, and Fungible tokens may
have value and are never destroyed by the network updates.

To obtain UNQ: Visit our [Ecosystem page](https://unique.network/ecosystem/#dex) for the list of exchanges.

<ChainTable :chainName="UNIQUE_CHAINS.unique"/>

## Quartz - Kusama parachain

The Quartz Mainnet is the production environment.  
The QTZ token has value and all NFTs, RFTs, and Fungible tokens may
have value and are never destroyed by the network updates.

To obtain QTZ: Visit our [Ecosystem page](https://unique.network/ecosystem/#dex) for the list of exchanges.

<ChainTable :chainName="UNIQUE_CHAINS.quartz"/>


## Opal - testnet

Unique Network provides an Opal Testnet to its users to play with all blockchain features in a safe and free
of network fees environment.&#x20;

To obtain OPL: Use the Telegram faucet bot [@UniqueFaucetBot](https://t.me/UniqueFaucetBot)

<ChainTable :chainName="UNIQUE_CHAINS.opal"/>

<script setup>
import {UNIQUE_CHAINS} from '_utils/constants';
import {addChainToMetamask} from '_utils/metamask';
</script>
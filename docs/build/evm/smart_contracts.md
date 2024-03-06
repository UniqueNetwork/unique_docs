# Smart contracts

## Static smart contracts

::: warning Smart contract sponsoring
Smart contract may be sponsored, but when web3 or ethers.js
perform the transaction, they are using EIP1559 transactions
and set gas price as double of default gas price.  
This causes the sponsoring of this transaction to be disabled
to prevent manipulation of the transaction queue at the expense of the sponsor.

So if you enabled sponsoring for your smart contract,
the gas price should be set explicitly in every transaction
you want to be sponsored.  
The best option here is just pass the default gas price of the provider:

ethers: `await provider.getGasPrice()`  
web3: `await web3.eth.getGasPrice()`

Otherwise, the caller will be charged for the transaction.
:::

Also can be interesting these two smart contract stubs:

### ContractHelpers 
Kind of «static» smart contract in our chain with some helper functions
[ContractHelpers.sol](https://github.com/UniqueNetwork/unique-chain/blob/develop/pallets/evm-contract-helpers/src/stubs/ContractHelpers.sol)

### UniqueNFT - NFT
[UniqueNft.sol documentation](UniqueNFT.md) 

## Marketplace smart contract

Marketplace smart contract could be found here:

[MarketPlace.sol](https://github.com/UniqueNetwork/unique-marketplace-api/blob/master/market/MarketPlace.sol)
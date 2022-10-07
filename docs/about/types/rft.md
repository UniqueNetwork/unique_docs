# Re-Fungible Tokens (RFTs)

## What is it? 

A re-fungible token (RFT) is essentially a non-fungible token (NFT) with a unique ability: partial ownership. You may have heard about the “fractional ownership” of NFTs, which is when an NFT smart contract is deployed to generate ERC20 (the standard used to create fungible tokens) tokens which are linked to a non-fungible ERC721 token, which is the standard token for NFTs. This allows anyone holding one of the ERC20 tokens to own a percentage of a single NFT.

Re-fungible tokens function rather similarly; they can be minted and then partially transferred to multiple owners. However, in the case of Unique Network, the process of ownership and tokenization is slightly different. Still, re-fungibility allows users to share ownership of a specific token.

## How it works?

Ideally, to create fractional ownership on Ethereum, we need to lock NFTs into smart contracts and split the ERC-721 token into many fractions of ERC-20 tokens. Unfortunately, this can lead to issues with safety and a poor user experience.

Quartz RFTs take a different approach. We don’t have to lock our NFTs in contracts and mint ERC-20 tokens. We can use our native RFT pallet, which allows us to create fractional ownership using native minting. We can then mint RFT tokens from scratch and sell fractional ownership to token holders. It’s a safer and simpler option for our users because they don’t need to use complicated services or create smart contracts.

When creating a collection, the user can choose between creating NFT or RFT collections. After that, they can specify data about the collection (name, description, symbol, attributes) and the number of ownership shares specific to each RFT. Users can create tokens divided into 100,000 shares and then sell them to the community. Each RFT-token holder can re-sell their share or buy more shares of their token.
# Fractional NFTs

## Overview

A Fractional NFT (Re-fungible Token or RFT) is essentially a non-fungible token (NFT) that allows partial ownership. 

## How Does it Work?

Traditionally, creating fractional ownership on Ethereum requires locking NFTs into smart contracts and splitting the ERC-721 token into many fractions of ERC-20 tokens. This method can lead to safety issues and a poor user experience.

Unique Network takes a different approach. We do not need to lock our NFTs in contracts or mint ERC-20 tokens. Instead, we use our native RFT pallet, which allows us to create fractional ownership through native minting. This method enables us to mint RFT tokens from scratch and sell fractional ownership to token holders. It is a safer and simpler option for our users, as it eliminates the need for complex services or creating smart contracts.

## Creating and Managing Fractional NFTs

When creating a collection, users can choose between NFT or RFT collections. They can then specify data about the collection (name, description, symbol, attributes) and the number of ownership shares specific to each RFT. For example, users can create tokens divided into 100,000 shares and then sell them to the community. Each RFT holder can re-sell their share or buy more token shares.

NFT owners can also fractionalize their tokens to create RFTs. The owner of all RFT parts can de-fractionalize their RFT back to the original NFT and operate with it as a standard NFT.

## Related Articles

- [Token Types overview](./coins.md)
- [Coins](./coins.md)
- [NFTs](./nft.md)

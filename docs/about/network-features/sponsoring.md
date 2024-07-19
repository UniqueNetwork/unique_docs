# Sponsoring 

In Unique Network, transactions can be sponsored. This allows shielding end-users from the hassles of fee processing. For example, in the Unique Marketplace, users do not have to pay fees for listing NFTs. This eliminates the need for users to obtain or own any native fungible tokens to participate in the market.

## Key Benefits of Sponsoring

- **User-Friendly Experience**: By sponsoring transactions, users can engage with the platform without worrying about transaction fees, making it more accessible.
- **Enhanced Accessibility**: Users can participate in NFT marketplaces and other activities without needing to acquire native tokens, lowering the barrier to entry.

## Types of Sponsored Transactions

Unique Network supports sponsoring various types of transactions to enhance user experience and platform accessibility:

- Minting NFTs
- NFT Transfers
- Smart Contract Calls

## Preventing Attacks

One potential risk with sponsoring transactions is the possibility of DOS attacks, where malicious actors deplete sponsor funds by sending numerous "free" transactions. Unique Network addresses this issue by implementing rate limits. Rate Limiting Strategies:

1. **Time limits**: Set a rate limit where an NFT transferred will be sponsored only once every X block. This prevents excessive transactions in a short period.
2. **Allow Lists**: Implement a rate limit based on an allow list, ensuring only trusted transactions are processed frequently.

## Learn More

To discover more about the benefits of sponsoring transactions on Unique Network and how to implement it, visit our [Build section](../../build/sdk/sponsoring.md). Here, you'll find comprehensive guides and documentation to help you make the most of our platform.

<br>
<br>

---

## Related Articles
- [Our approach to NFTs](../approach.md)
- [NFT Features Overview](../token-types/nft.md)
- [Marketplace](./marketplace.md)

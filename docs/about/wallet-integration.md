# Wallet integration

### Scan API

[Scan API for Unique parachain](https://api-unique.uniquescan.io/v1/graphql) <CopyButton data="https://api-unique.uniquescan.io/v1/graphql"/>

[Scan API for Quartz parachain](https://api-quartz.uniquescan.io/v1/graphql) <CopyButton data="https://api-quartz.uniquescan.io/v1/graphql"/>

[Scan API for Opal testnet](https://api-opal.uniquescan.io/v1/graphql) <CopyButton data="https://api-opal.uniquescan.io/v1/graphql"/>

[Scan API for Sapphire solochain](https://api-sapphire.uniquescan.io/v1/graphql) <CopyButton data="https://api-sapphire.uniquescan.io/v1/graphql"/>

Every endpoint provides a GraphQL playground.

## Examples

In all code examples at this page we assume that the `$ownerNormalized` variable should be one of:
- a Substrate address in default (42) format, like `"5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX"`
- an Ethereum address in __lowercase__, like `"0xeabbf89e7a3866183c49366dc30c10837c073a6f"`

### Collections

How to obtain a list of collections where the address is owner or owns at least one NFT:

```graphql
query MyCollections($ownerNormalized: String) {
  collections(
    where: {
      _or: [
        {owner_normalized: {_eq: $ownerNormalized}},
      	{tokens: {owner_normalized: {_eq: $ownerNormalized}}},
      ]
    },
    order_by: {collection_id: asc}
    offset: 0
    limit: 10
  ) {
    count
    timestamp
    data {
      collection_id
      type
      token_prefix
      name
      collection_cover
      description
    }
  }
}
```

### Tokens

How to obtain a list of tokens where the address is owner.

`collection_id` param is optional, it's here just for example how to obtain NFTs from specific collections.

```graphql
query MyTokens($ownerNormalized: String) {
  tokens(
    where: {
      owner_normalized: {_eq: $ownerNormalized}, 
      collection_id: {_in: [123]}
    },
    order_by: {collection_id: desc, token_id: asc}
    offset: 0
    limit: 10
  ) {
    count
    timestamp
    data {
      collection_id
      token_id
      token_name
      image
      owner_normalized
      date_of_creation
    }
  }
}
```

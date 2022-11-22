# Wallet integration

## GraphQL API

To connect a wallet, you can use our Hasura-based GraphQL API.

[Testnet - Opal GraphQL API endpoint](https://api-opal.uniquescan.io/v1/graphql)

[Mainnet for Kusama - Quartz GraphQL API endpoint](https://api-quartz.uniquescan.io/v1/graphql)


[//]: # ([Mainnet for Polkadot - Unique GraphQL API endpoint]&#40;https://hasura.unique.network/v1/graphql&#41;)

```graphql:no-line-numbers
query MyQuery {
  collections(
    where: {
      tokens: {
        owner: {
          _in: [
            "5GbjEGWbTFV7f2XN6z7TBUyW4YidWTHmaw1ekNFCtWGuEmTT",
            "yGHGXr2qCKygrxFw16XXEYRLmQwQt8RN8eMN5UuuJ17ZFPosP"
          ]
        }
      }
    },
    order_by: {
      collection_id: asc
    }
  ) {
    collection_id
    token_prefix
    name
    schema_version
    offchain_schema
    variable_on_chain_schema
  }
}
```

```graphql:no-line-numbers
query MyQuery {
  collections(where: {collection_id: {_eq: "354"}}) {
    collection_id
    name
    owner
    schema_version
    offchain_schema
    variable_on_chain_schema
    tokens(where: {
      owner: {
        _in: [
          "5GbjEGWbTFV7f2XN6z7TBUyW4YidWTHmaw1ekNFCtWGuEmTT",
          "yGHGXr2qCKygrxFw16XXEYRLmQwQt8RN8eMN5UuuJ17ZFPosP"
        ]
      }
    }, order_by: {token_id: asc}) {
      token_id
      owner
      data
    }
  }
}
```


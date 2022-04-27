# Guide

## GraphQL API for wallets

To get all collections where the address have at least one token please call such method:

```graphql
query MyQuery {
  collections(where: {tokens: {owner: {_eq: "yGHGXr2qCKygrxFw16XXEYRLmQwQt8RN8eMN5UuuJ17ZFPosP"}}}) {
    collection_id
    token_prefix
    name
    schema_version
    offchain_schema
    variable_on_chain_schema
  }
}
```


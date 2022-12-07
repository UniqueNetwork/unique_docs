# ScanAPI. How to get collections and tokens.

You can get some data about collections and tokens using our [ScanAPI](#todo). 

Let's say you want to get the list of collections of your own. You just need to write correct GraphQL query and connect to correct blockchain ScanAPI [endpoint](#todo).   

Or you can query data in your browser using [GraphQL console](https://scan-api.opal.uniquenetwork.dev/v1/graphql/).

## Get collections that you own

Let's say your address is `5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr`.

To get your collections, you should do query like this:

```graphql:no-line-numbers
query {
    collections (where: {
        {
            owner: {
                _eq: "5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr"
            }
        }
    }) {
        data {
            collection_id
            name
            token_prefix
        }
    }
}
```  

## Get all your collections and all collections with tokens that you own

If you want to extend the list of your own collections by collections that contain tokens that you own, you should add corresponding condition into _where_ part of your GraphQL query:

```graphql:no-line-numbers
query {
  collections (where: { 
    _or: [
        # Collection owner filter
        {
            owner: {
                _eq: "5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr"
            }
        },
        # Collection tokens by owner filter 
        {
            tokens: { 
                owner: { 
                    _eq: "5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr" 
                }
            }
        }
    ]
  }) {
    data {
        collection_id
        name
        token_prefix
    }
  }
}
```

## Get all my tokens within a specific collection

If you want to check all (address is still `5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr`) tokens within a specific collection, you can specify a collection ID (**1336**) like this:

```graphql:no-line-numbers
query {
    tokens (where: { 
        collection_id: { _eq: 1336 },
        owner: { _eq: "5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr" }
    }) {
        count
        data {
            token_id
            token_name
            token_prefix
        }
    }
}
```

## Get all my tokens (with pagination)

If you want to get the list of all NFT tokens of your own regardless of the collection they belong to, you should also consider using pagination. This is, because the list could be potentially huge. To use the pagination, just remove the _collection\_id_ condition from previous query, and add the _limit_ and _offset_ arguments.

```graphql:no-line-numbers
query {
    tokens (
        limit: 20
        offset: 0
        where: {
            owner: { _eq: "5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr" }
        }
    ) {
        count
        data {
            token_id
            token_name
            token_prefix
        }
    }
}

```
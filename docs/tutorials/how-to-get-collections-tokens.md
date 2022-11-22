# ScanAPI. How to get collections and tokens

You can get some data about collections and tokens using our [ScanAPI](#todo). 

Let's say you want to get the list of collections of your own. You just need to write correct GraphQL query and connect to correct blockchain ScanAPI [endpoint](#todo).   

Or you can query data in your browser using [GraphQL console](https://scan-api.opal.uniquenetwork.dev/v1/graphql/).

## How to get all collections that you own

Let's say your address is _"5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr"_.

To get your own collections you should do query like this:

```graphql
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

## How to get all your collections and all collections with tokens that you own

If you want to extend the list of your own collections by collections that contain tokens that you own, you should add corresponding condition into _where_ part of your GraphQL query:

```graphql
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

## How to get all my tokens within some exact collection

If I want to check all my (address is still _"5Gzff3r5hs59WPcCK1cvdDtobYb2bf5sw9pAmVbaRicfF5Qr"_) tokens within collection with collection ID equal _1336_, I can do like this:
```graphql
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

## How to get all my tokens (with pagination)

If you want to get the list of all NFT tokens of your own regardless of the collection it belongs, you should also consider using pagination, because the list could be very large. Just remove from previous query _collection\_id_ condition, and add _limit_ and _offset_ arguments.

```graphql
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
# Fetching NFT

This article demonstrates the basics of fetching NFT data using GraphQL. We are going to share some code examples. We hope this could become a starting point for creating your own queries with different filters and sortings. This might be useful in the following cases:

1) Interacting with pagination and infinite scrolling;
2) Making different filters, including dynamic conditions;
3) Requesting limited and distinct data;
4) ...and in other things, for which necessary to obtain and handle arrays of data.

### Basic example

In this example, only main NFTs fields like id, prefix, and name are included in a request.

```graphql:no-line-numbers
query tokens_query {
  tokens {
    data {
      token_id
      token_name
      token_prefix
    }
    count
  }
}
```

The request returns all existing tokens, but probably you'd like to make some filtering because handling big arrays of data might be expensive for both back-end and front-end parts of your application.
For this reason, we will define a limit value in our query:

```graphql:no-line-numbers
query tokens_query {
  tokens(limit: 10) {
    data {
      token_id
      token_name
      token_prefix
    }
    count
  }
}
```

From a response, you can get NFT data and total number (count) of the tokens:

```json:no-line-numbers
{
  "data": {
    "tokens": {
      "data": [
        {
          "token_id": 1,
          "token_name": "FPBase #1",
          "token_prefix": "FPBase"
        },
        ...
        {
          "token_id": 10,
          "token_name": "FPBase #10",
          "token_prefix": "FPBase"
        }
      ],
      "count": 7286
    }
  }
}
```

### Pagination

Let's make our query a little bit more complex by adding offset and limit parameters. It might be your first step to implement pagination and requests that depend on external arguments.

Arguments:

```json:no-line-numbers
{
  "offset": 100,
  "limit": 20
}
```

Request:

```graphql:no-line-numbers
query tokens_query($limit: Int, $offset: Int) {
  tokens(limit: $limit, offset: $offset) {
    data {
      token_id
      token_name
      token_prefix
    }
    count
  }
}
```

### DistinctOn and OderBy statements

If you'd like to get a sorted list or different data (e.g. without duplicates), you can use the `distinct_on` or `order_by` statements.

Arguments:

```json:no-line-numbers
{
  "offset": 0,
  "limit": 20,
  "distinct_on": "collection_id",
  "order_by_creation_data": {"date_of_creation": "desc"}
}
```

Request:

```graphql:no-line-numbers
query tokens_query(
  $limit: Int
  $offset: Int
  $distinct_on: TokenEnum
  $order_by_creation_data: TokenOrderByParams
) {
  tokens(
    limit: $limit
    offset: $offset
    distinct_on: $distinct_on
    order_by: $order_by_creation_data
  ) {
    data {
      token_id
      token_name
      token_prefix
      collection_id
      date_of_creation
    }
    count
  }
}
```

### Search and filter

In this section, you will learn how to search and filter NFTs. Below request selects NFTs that are filtered by a collection name.

Arguments:

```json:no-line-numbers
{
  "offset": 0,
  "limit": 20,
  "distinct_on": "collection_id",
  "order_by_creation_data": {"date_of_creation": "desc"},
  "where": {"collection_name": {"_eq": "chelobrick"}}
}
```

Request:

```graphql:no-line-numbers
query tokens_query(
  $limit: Int
  $offset: Int
  $distinct_on: TokenEnum
  $order_by_creation_data: TokenOrderByParams
  $where: TokenWhereParams
) {
  tokens(
    limit: $limit
    offset: $offset
    distinct_on: $distinct_on
    order_by: $order_by_creation_data
    where: $where
  ) {
    data {
      token_id
      token_name
      token_prefix
      collection_id
      collection_name
      date_of_creation
    }
    count
  }
}
```

The following examples contains the "where" argument which adds a search by name:

```json:no-line-numbers
{
  "offset": 0,
  "limit": 20,
  "distinct_on": "collection_id",
  "order_by_creation_data": {"date_of_creation": "desc"},
  "where": {
    "_and": {
      "collection_name": {"_eq": "chelobrick"}, 
      "token_name": {"_ilike": "che%"}
    }
  }
}
```

You can define any conditions for your needs using available fields and operators: `_or`, `_and`, `_eq`, `_like`, `_ilike`, etc. 

In our wallet, we use React library called Apollo for convenient interaction with the Graphql queries. Its hooks help to make dynamic queries, watch a current query status, refetch queries, handle data and errors easier, and do a lot of other useful things.
If you'd like to know more about it, you can visit [Apollo](https://www.apollographql.com/docs/)

### To learn next

In this article, we got acquainted with the basics of fetching NFT data.
The same principles you can use to make requests into other tables.
If you are interested in more information, we suggest you to read about [Apollo](https://www.apollographql.com/docs/), [React Query](https://tanstack.com/query/v4/docs/examples/react/basic-graphql-request), or another state management library available for working with GraphQL.

In addition, if you are interested about deeper fundamental knowledge, you can read [GraphQL](https://graphql.org/learn/) documentation. 
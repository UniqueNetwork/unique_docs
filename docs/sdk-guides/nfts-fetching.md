# NFTs fetching

This article shows the basics of fetching NFTs data with GraphQL. We are going to share some code examples are accompanied by explanations and could be a starting point for creating your own queries with different filters and sortings. It might be useful in the following cases:

1) Interacting with pagination and infinite scrolling;
2) Making different filters, including dynamic conditions;
3) Requesting limited and distinct data;
4) ...and in other things, for which necessary to obtain and handle arrays of data.

## Basic example

In the first example, just main NFTs fields like id, prefix, and name are included in a request.

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

It returns all existing tokes from your scan, but probably you'd like to make some limitations because handling big arrays of data might be expensive for both back-end and front-end parts of your application.
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

From a response you can directly get NFTs data and total number (count) of them in your scan:

```json
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

## Pagination

Let's make our query a little bit more complicated by adding offset and limit parameters. It might be your first step to implement pagination and requests are dependent on external arguments.

Arguments:

```json
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

## Distinct and OderBy statements

If you'd like a list of sorted or different data (without duplicates), you can use "distinct_on" or "order_by" statements.

Arguments:

```json
{
  "offset": 0,
  "limit": 20,
  "distinct_on": "collection_id",
  "order_by_creation_data": {"date_of_creation": "desc"}
}
```

Request:

```graphql:no-line-number
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

## Search and filters

In this paragraph, you can learn how to make search and filtration of NFTs. Below request selects NFTs are filtered by collection name.

Arguments:

```json
{
  "offset": 0,
  "limit": 20,
  "distinct_on": "collection_id",
  "order_by_creation_data": {"date_of_creation": "desc"},
  "where": {"collection_name": {"_eq": "chelobrick"}}
}
```

Request:

```graphql:no-line-number
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

The following "where" argument contains a search by name in addition the previous condition:

```json
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

You can define conditions for your own aims using available fields and operators like "_or", "_and", "_eq", "_like", "_ilike", etc. In our wallet, we use Apollo react library for convenient interaction with Graphql queries. Its hooks help to make dynamic queries, watch a current query's status, refetch queries, handle data and errors easier, and a lot of other useful things.
If you'd like to know more about it, you can visit [Apollo](https://www.apollographql.com/docs/)

## Conclusion

In this article, we got acquainted with the basics of fetching NFTs data.
The same principles you can use to make requests into other tables.
If you are interested in more information, we suggest you to read about [Apollo](https://www.apollographql.com/docs/) or [react-query](https://tanstack.com/query/v4/docs/examples/react/basic-graphql-request), or another state management library available for working with graphql.
In addition, if you are curious about more fundamental knowledge, you can read [graphql](https://graphql.org/learn/) documentation. And we hope you found this article helpful.
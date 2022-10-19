# How to get and display NFTs and collections

To getting collections or NFTs use Apollo client for react. The Apollo Client API reference can be found at: <br/>
[https://www.apollographql.com/docs/react/api/apollo-client/](https://www.apollographql.com/docs/react/api/apollo-client/)

First, create two files:

<details><summary>_types.ts_</summary>

```typescript
// QueryResponse interface
export interface QueryResponse<T = void> {
  [key: string]: {
    data?: T[];
  };
}

// Collection's full interface
export interface Collection {
  collection_id: number; // Id of collection
  collection_name: string; // Collection name
  collection_cover: string; // Cover image
  date_of_creation: number; // Creation date
  description: string; // Description text
  owner: string; // Owner's address
  owner_mormalized: string; // Same as owner's address
  owner_can_destroy: boolean; // Shows if collection can be burned
  token_prefix: string; // Token prefix (up to 4 characters)
  tokens_count: number; // Number of tokens in the each collection
  token_limit: number; // Number of tokens limit
  name: string; // Collection name
  sponsorship: string; // Sponsor's address
}

export interface Token {
  token_id: number; // Token id
  token_name: string; // Token name
  token_prefix: number; // Token prefix (up to 4 characters)
  owner: string; // Owner's address
  owner_mormalized: string; // Same as owner's address
  attributes: Record<string, Attribute>; // Token attributes
  date_of_creation: number; // Creation date
  // Token image
  image?: {
    fullUrl: string | null;
    ipfsCid: string | null;
  };

  collection_id: number; // Id of the collection containing the token
  collection_name: string; // The name of the collection containing the token
  collection_cover: string; // Cover image of the collection containing the token
  collection_description: string; // Description of the collection containing the token
}
```
</details>

and

<details><summary>_utils.ts_</summary>

```typescript
// Utilite for getting image path

/* Data image cover different formats:
 * 1) 'QmbuyQebXVQcZbaGmP4maWUqRiKYeAAyYZEiqL3rnev8i4'
 * 2) https://www.ipfs-server/QmbuyQebXVQcZbaGmP4maWUqRiKYeAAyYZEiqL3rnev8i4
 * 3) "{\"ipfs\":\"QmZCuWx72x1ukhehLsg1qNjKhVj3d1feJjadUPJbyYfmpY\",\"type\":\"image\"}"
 * */
export const formatCoverSrc = (
  imagePath: string | null | undefined,
): string | undefined => {
  if (!imagePath) {
    return undefined;
  }

  const buildPath = (url: string) => {
    if (isValidHttpUrl(url)) {
      return url;
    }
    return `https://ipfs.uniquenetwork.dev/ipfs/${url}`;
  };

  try {
    const deserializedImagePath: unknown = JSON.parse(imagePath);

    if (IPFSGateway && isImagePath(deserializedImagePath) && deserializedImagePath.ipfs) {
      return buildPath(deserializedImagePath.ipfs);
    }
  } catch {
    return buildPath(imagePath);
  }

  return undefined;
};
```
</details>

## Get NFTs

Create _useGqlTokens.ts_:

```typescript
import { gql, useQuery } from '@apollo/client';
import { QueryResponse, Token } from 'types';

// gql request
const OWNER_TOKENS_QUERY = gql`
  query owner_tokens_query(
    $where: TokenWhereParams
  ) {
    tokens(
      where: $where
      order_by: { token_id: "asc" }
    ) {

      # You can add keys from Token interface above
      data {
        token_id
        token_name
        collection_name
        collection_id
        image
      }
    }
  }
`;

// hook
export const useGqlTokens = (
  ownerAddress: string | undefined
) => {
  const {
    data: response,
    error,
  } = useQuery<QueryResponse<Token>>(OWNER_TOKENS_QUERY, {
    skip: !ownerAddress,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      where: {
        _or: [
          { owner: { _eq: ownerAddress } },
          { owner_normalized: { _eq: ownerAddress } },
        ]
      },
    },
  });

  return {
    tokens: response?.tokens.data || [],
    error,
  };
};
```

## Display NFTs

Create _tokens.ts_:

```typescript jsx
import { formatCoverSrc } from 'utils';
import { useGqlTokens } from './hooks/useGqlCollections';
import { Token } from 'types';

// NFTs list component
export const TokensList = ({ ownerAddress } : {
  ownerAddress: string | undefined
}) => {
  const { tokens } = useGqlTokens('5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX');
  
  if (!tokens) {
    return <p>No data to display</p>;
  }
  
  return (
    <>
      <h1>List of NFTs</h1>
      <ul>
        {tokens.map((item: Token) => (
          <li key={item.token_id}>
            <h4>{item.token_name} [{item.token_id}]</h4>
            <img
              src={item.image?.fullUrl || undefined}
              alt={item.token_name}
            />
            <p>
              Collection: {item.collection_name} [{item.collection_id}]
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};
```

## Get collections

Create file _hooks/useGqlCollections.ts_:

```typescript
import { gql, useQuery } from '@apollo/client';
import { Collection, QueryResponse } from 'types';

// gql request
const COLLECTIONS_BY_ACCOUNT_QUERY = gql`
  query collections_by_account_query(
    $where: CollectionWhereParams
  ) {
    collections(order_by: { collection_id: "asc" }, where: $where) {

      # You can add keys from Collection interface above
      data {
        name
        description
        collection_cover
        collection_id
        owner_normalized
        tokens_count
      }
    }
  }
`;

// hook
export const useGqlCollections = (
  accountAddress: string | undefined
) => {
  const {
    data: response,
    error,
  } = useQuery<QueryResponse<Collection>>(COLLECTIONS_BY_ACCOUNT_QUERY, {
    skip: !accountAddress,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      where: {
        _or: [
          { owner: { _eq: accountAddress } },
          { owner_normalized: { _eq: accountAddress } },
        ],
      },
    },
  });

  return {
    collections: response?.collections.data ?? [],
    error,
  };
};
```

## Display collections

Create _collections.tsx_:

```typescript jsx
import { formatCoverSrc } from 'utils';
import { useGqlCollections } from './hooks/useGqlCollections';
import { Collection } from 'types';

// Create some functional component for displaying collections list:
export const CollectionsList = () => {
  const { collections } = useGqlCollections('5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX');

  if (!collections) {
    return <p>Nothing to show</p>;
  }

  return (
    <>
      <h1>List of collections</h1>
      <ul>
        {collections.map((item: Collection) => (
          <li key={item.collection_id}>
            <h4>{item.name} [{item.collection_id}]</h4>
            <img
              src={formatCoverSrc(item.collection_cover)}
              alt={item.name}
            />
            <p>{item.description}</p>
            <p>
              Owner: {item.owner_normalized}<br/>
              Tokens count: {item.tokens_count}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
```

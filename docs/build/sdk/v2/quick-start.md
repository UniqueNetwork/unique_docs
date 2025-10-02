# Unique SDK quick start

The SDK facilitates seamless integration of Unique Network's capabilities into the web3 application, bypassing the need for direct low-level API interaction. It enables you to effortlessly mint collections and tokens, manage account balances, and more.

[[toc]]

## Getting started

### Installation

Install `@unique-nft/sdk` for Unique Network interaction and `@unique-nft/sr25519` for account management.

<CodeGroup>
 <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/sdk @unique-nft/sr25519
```

 </CodeGroupItem>
 <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/sdk @unique-nft/sr25519
```

 </CodeGroupItem>
</CodeGroup>

### Import and initialize the SDK

To begin using the Unique SDK, you need to import the required modules, set the base URL for the API, and optionally configure the default signer account.

You can find the list of public endpoints in the [reference section](../../../reference/sdk-endpoints.md).

<!-- TODO set production baseUrl -->

```typescript:no-line-numbers
import { UniqueChain } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";


const mnemonic = "SET THE MNEMONIC SEED PHRASE FOR THE DEFAULT SIGNER HERE";
const account = Sr25519Account.fromUri(mnemonic);

// set "account" as a default signer
const sdk = UniqueChain({
  baseUrl: "https://rest.unique.network/v2/unique",
  account,
});
```

### Make some requests

```typescript:no-line-numbers
...

const balanceQuery = await sdk.balance.get({address: account.address});
console.log("Account's total balance:", balanceQuery.total);
```

The Unique SDK currently supports the following modules:

- `collection`: create, update, and manage NFT collections.
- `token`: mint, transfer, and manage individual NFTs.
- `fungible`: mint, transfer, and manage fungible tokens.
- `refungible`: mint, transfer, and manage refungible tokens.
- `balance`: manage and query account balances.
- `account`: get account info.
- `utility`: utility methods.
- `evm`: deploy and invoke smart contracts, call precompiles.
- `extrinsic`: build, sign, submit any extrinsic.
- `options`: configure SDK options.

## Run your own HTTP proxy

Instead of using public SDK endpoints, you can easily run your own HTTP proxy. Create a docker-compose.yml with the following content, and run `docker compose up`.

### Sample HTTP proxy configuration for Unique Network mainnet

```yml:no-line-numbers
services:
  substrate-proxy:
    image: uniquenetwork/substrate-proxy-http-proxy:master
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - CHAIN=unique # or wss://ws.unique.network
      - MIN_LOG_LEVEL=info
      - EXTRINSIC_MORTAL_BLOCK_LENGTH=32
      - OPENAPI_SERVER_URL=http://localhost:3000
      - OPENAPI_SERVER_DESCRIPTION="Local development server"
      - EXTRINSICS_STORAGE_MAX_BLOCKS_COUNT=100
```

## Full development stack

Or you even can run all services including dev blockchain node, indexer, and HTTP proxy with a single command.

This is the recommended way for local development and testing.

List of services:

- `scan-crawler`: Indexer that syncs data from the chain to the database.
- `scan-api`: Indexer API that provides read-only access to the indexed data.
- `http-proxy`: HTTP proxy that provides access to the chain and indexer via REST API.
- `postgres`: PostgreSQL database for the indexer.
- `chain`: Unique Network node in dev mode.

Create a docker-compose.yml with the following content, and run `docker compose up`.

```yml:no-line-numbers
services:

  scan-crawler:
    image: uniquenetwork/substrate-proxy-scan-crawler:master
    environment:
      - DB_URL=postgres://db_user:db_password@postgres:5432/scan_db
      - CHAIN=ws://chain:9833

  scan-api:
    image: uniquenetwork/substrate-proxy-scan-api:master
    ports:
      - 3001:3001
    environment:
      - DB_URL=postgres://db_user:db_password@postgres:5432/scan_db
      - PORT=3001
      - OPENAPI_SERVER_URL=http://localhost:3001/
      - OPENAPI_SERVER_DESCRIPTION="This server"
      - OPENAPI_SERVER_PUBLIC_PATH=/

  http-proxy:
    image: uniquenetwork/substrate-proxy-http-proxy:master
    ports:
      - 3000:3000
    environment:
      - PORT=3000
      - CHAIN=ws://chain:9833
      - MIN_LOG_LEVEL=info
      - EXTRINSIC_MORTAL_BLOCK_LENGTH=64
      - OPENAPI_SERVER_URL=http://localhost:3000/
      - OPENAPI_SERVER_DESCRIPTION="This server"
      - OPENAPI_SERVER_PUBLIC_PATH=/

  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: db_user
      POSTGRES_PASSWORD: db_password
      POSTGRES_DB: scan_db
    ports:
      - "5432:5432"
    volumes:
      - scan-postgres:/var/lib/postgresql/data

  chain:
    image: uniquenetwork/unique-node-public:latest
    command:  >
      --dev
      --idle-autoseal-interval 2000
      --disable-autoseal-on-tx
      --autoseal-finalization-delay 2000
      --state-pruning archive
      --blocks-pruning archive
      --base-path /unique/data
      --port 30333
      --rpc-port 9833
      --no-prometheus
      --no-mdns
      --no-telemetry
      --unsafe-rpc-external
      --rpc-cors=all
    ports:
      - 9833:9833
      - 40333:40333
      - 30333:30333
    volumes:
      - chain-data:/chain/data

volumes:
  chain-data:
  scan-postgres:

```

# Environment Setup

Before you start building with the Unique SDK, you need to set up your development environment. Instead of using testnets, we offer a comprehensive local development environment that gives you everything you need in one place.

[[toc]]

## Why Local Development Environment?

Traditional blockchain development often requires connecting to testnets, which can be slow, unreliable, or have limited resources. Our local development stack provides:

- **Full blockchain node** - Your own Unique Network node in dev mode
- **SDK REST server** - HTTP proxy for easy API access
- **Indexer** - Fast queries for blockchain data
- **Simple UI** - Visual interface to check your NFTs and collections

This setup gives you complete control, faster development cycles, and independence from external services.

## Local Development Stack (Recommended)

This is the recommended way for local development and testing. Run all services with a single command using Docker Compose.

### Services Included

- `chain`: Unique Network node in dev mode
- `http-proxy`: HTTP proxy that provides access to the chain via REST API
- `scan-crawler`: Indexer that syncs data from the chain to the database
- `scan-api`: Indexer API that provides read-only access to the indexed data
- `postgres`: PostgreSQL database for the indexer

### Configuration

Create a `docker-compose.yml` file with the following content:

```yml:no-line-numbers
services:

  scan-crawler:
    image: uniquenetwork/substrate-proxy-scan-crawler:master
    restart: unless-stopped
    depends_on:
      - postgres
      - chain
    environment:
      - DB_URL=postgres://db_user:db_password@postgres:5432/scan_db
      - CHAIN=ws://chain:9833

  scan-api:
    image: uniquenetwork/substrate-proxy-scan-api:master
    restart: unless-stopped
    depends_on:
      - postgres
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
    restart: unless-stopped
    depends_on:
      - chain
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
    restart: unless-stopped
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
    platform: linux/amd64
    restart: unless-stopped
    command:  >
      --dev
      --idle-autoseal-interval 2000
      --disable-autoseal-on-tx
      --autoseal-finalization-delay 1
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

### Starting the Stack

Run the following command in the directory containing your `docker-compose.yml`:

```bash:no-line-numbers
docker compose up
```

After starting the full development stack, you can access:

- **HTTP Proxy (SDK endpoint)**: http://localhost:3000
- **Indexer API**: http://localhost:3001
- **Chain RPC**: ws://localhost:9833
<!-- TODO: UI -->

## Next Steps

Once your environment is set up, proceed to the [Quick Start guide](./quick-start.md) to learn how to use the Unique SDK.

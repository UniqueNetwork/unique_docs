

# Intro

Extrinsic is a request to change data in the blockchain.

https://docs.substrate.io/v3/concepts/extrinsics/

https://polkadot.js.org/docs/substrate/extrinsics/

To make changes to the blockchain, it is necessary to form a request (extrinsic) with certain parameters, which consists of 3 parts:
1) Blockchain section
2) Method section
3) Array of arguments

Once an extrinsic has been generated, it must be signed in order for the chain to complete the requested changes.


## Table of Contents

- [Getting started](#sdk-deployment---getting-started-guide)
  - [Install](#install)
  - [Environment Variables](#environment-variables)
  - [Swagger](#swagger)


- [Unique SDK HTTP API Methods:](#methods)
  - [Main Methods](#main-methods)
    - [Extrinsic build](#build-unsigned-extrinsic)
    - [Extrinsic sign](#sign-an-extrinsic)
    - [Extrinsic verify-sign](#verify-sign)
    - [Extrinsic submit](#submit-extrinsic)
  - [Additional Methods](#additional-methods)
    - [Сhain](#get-chain-properties)
    - [Balance](#get-balance)
    - [Collection](#get-collection)
    - [Token](#get-token)

# SDK Deployment - Getting Started Guide


- [How to install](#install)
- [How to configure – environment variables](#environment-variables)
- [Where to try - Swagger](#swagger)
## Install
Choose install approach: [Docker](#docker), [Source code](#git) or [Public endpoints](#public-endpoints)

### Docker

```bash
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://quartz.unique.network uniquenetwork/web:latest
```

<a href="https://hub.docker.com/r/uniquenetwork/web" target="_blank">See hub.docker.com page</a>

### Git

```git
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:web
npm start
```

### Public endpoints

You can use public endpoints for access Unique Web:

#### Opal
```
https://web-opal.unique.network
```

#### Quartz
```
https://web-quartz.unique.network
```

## Environment Variables

#### Required
```bash
CHAIN_WS_URL=wss://quartz.unique.network
```

<a href="https://docs.unique.network/unique-and-quartz-wiki/build/get-started/testnet-and-mainnet" target="_blank">See official Unique Network documentation</a>

#### Optional

##### Use `SIGNER_SEED` for [sign](#sign-an-extrinsic) method
```bash
SIGNER_SEED=type mnemonic here
SIGNER_SEED=//Alice
```

##### Port (default 3000)
```bash
PORT=3000
```

##### IPFS Gateway
```bash
IPFS_GATEWAY_URL=https://ipfs.unique.network/ipfs/
```

##### Cache manager
Extrinsics cache time:
```bash
CACHE_TTL=600
```

To set up the Redis store to cache extrinsics:
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

## Swagger
```
https://web-quartz.unique.network/swagger
```

# Methods

## Main methods

Using these universal methods, you can create any extrinsic you want.

- [Build extrinsic](#build-unsigned-extrinsic)
- [Sign extrinsic](#sign-an-extrinsic)
- [Verify sign](#verify-sign)
- [Submit extrinsic](#submit-extrinsic)

### Build unsigned extrinsic

```
POST /extrinsic/build
```

Build and returns unsigned extrinsic.
Next you must sign it and send with sign
to [/extrinsic/submit](#post-extrinsicsubmit) method
to apply the blockchain change.

#### Request body

```json
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "section": "balances",
  "method": "transfer",
  "args": [
    "yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK",
    100000000
  ]
}
```

<details>
 <summary>▶ CURL Example</summary>
  
  ```bash
  curl -X 'POST' \
    'https://web-quartz.unique.network/extrinsic/build' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "section": "balances",
    "method": "transfer",
    "args": [
      "yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK",
      100000000
    ]
  }'
  ```

</details>

#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
 {
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>

---

### Sign an extrinsic

```
POST /extrinsic/sign
```

In order to execute request you have two options:
- You may set `SIGNER_SEED` environment variable.
- Or you may set the `Authorization` request header to the mnemonic seed phrase: `Seed <Mnemonic seed phrase here>`

Returns sign for extrinsic. Next, you need to add a signature to the transaction object to be sent to the blockchain using `/extrinsic/submit` method. 

#### Request body

```json
{
  "signerPayloadHex": "string"
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/extrinsic/sign' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadHex": "string"
  }'
```
</details>

#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signature": "string",
  "signatureType": "sr25519"
}
```

</details>

---

### Verify sign

```
POST /extrinsic/verify-sign
```

Check the signature of the extrinsic

#### Request body 

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signature": "string",
  "signatureType": "sr25519"
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/extrinsic/verify-sign' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signature": "string",
  "signatureType": "sr25519"
}'
```
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "isValid": true,
  "errorMessage": "string"
}
```

</details>

---

### Submit extrinsic

```
POST /extrinsic/submit
```

Send the signed extrinsic to the chain.

#### Request body

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signature": "string",
  "signatureType": "sr25519"
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
   "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signature": "string",
  "signatureType": "sr25519"
}'
```
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "hash": "string"
}
```

</details>


  
## Additional Methods

Syntactic sugar for the most important methods.

- [Chain](#get-chain-properties)
- [Balance](#get-balance)
- [Collection](#get-collection)
- [Token](#get-token)

### Get chain properties
```
GET /chain/properties
```

Requests the service fields required to work with the blockchain

<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/chain/properties' \
  -H 'accept: application/json'
```
  
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "SS58Prefix": 255,
  "token": "QTZ",
  "decimals": 18,
  "wsUrl": "wss://ws-quartz.unique.network",
  "genesisHash": "0xe9fa5b65a927e85627d87572161f0d86ef65d1432152d59b7a679fb6c7fd3b39"
}
```

</details>
 
---

### Get balance

```
GET /balance
```

Returns the account balance in formatted and unformatted form

#### Query Parameters

- **address** - substrate account

<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/balance?address=yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' \
  -H 'accept: application/json'
```
  
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "amount": "411348197000000000000",
  "formatted": "411.3481 QTZ"
}
```

</details>

---

### Transfer coins

```
POST /balance/transfer
```

Creates an unsigned extrinsic for a transfer of a certain amount of coins. The amount should be past in integer or fractional part of the coin (UNQ or QTZ), and **not in wei**.

#### Request body

```json
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/balance/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}'
```

</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>

---

### Get collection

```
GET /collection
```

Returns information about the collection by id

#### Query Parameters

- **collectionId** - collection identifier

<details>
 <summary>▶ CURL Example</summary>


```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/collection?collectionId=1' \
  -H 'accept: application/json'
```

</details>
  
#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "mode": "Nft",
  "access": "Normal",
  "schemaVersion": "ImageURL",
  "name": "Sample collection name",
  "description": "sample collection description",
  "tokenPrefix": "TEST",
  "mintMode": true,
  "offchainSchema": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png",
  "sponsorship": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "isConfirmed": true
  },
  "limits": {
    "accountTokenOwnershipLimit": null,
    "sponsoredDataSize": null,
    "sponsoredDataRateLimit": null,
    "tokenLimit": null,
    "sponsorTransferTimeout": null,
    "sponsorApproveTimeout": null,
    "ownerCanTransfer": null,
    "ownerCanDestroy": null,
    "transfersEnabled": null
  },
  "constOnChainSchema": {
    "nested": {
      "onChainMetaData": {
        "nested": {
          "NFTMeta": {
            "fields": {
              "ipfsJson": {
                "id": 1,
                "rule": "required",
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  "variableOnChainSchema": "{}",
  "metaUpdatePermission": "ItemOwner",
  "id": 1,
  "owner": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm"
}
```

</details>

---

### Create collection

```
POST /collection
```

Generates an unsigned extrinsic to create a collection with certain parameters

#### Request body

```json
{
  "mode": "Nft",
  "access": "Normal",
  "schemaVersion": "ImageURL",
  "name": "Sample collection name",
  "description": "sample collection description",
  "tokenPrefix": "TEST",
  "mintMode": true,
  "offchainSchema": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png",
  "sponsorship": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "isConfirmed": true
  },
  "limits": {
    "accountTokenOwnershipLimit": null,
    "sponsoredDataSize": null,
    "sponsoredDataRateLimit": null,
    "tokenLimit": null,
    "sponsorTransferTimeout": null,
    "sponsorApproveTimeout": null,
    "ownerCanTransfer": null,
    "ownerCanDestroy": null,
    "transfersEnabled": null
  },
  "metaUpdatePermission": {},
  "mintMode": true,
  "name": "string",
  "offchainSchema": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png",
  "owner": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "sponsorship": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "isConfirmed": true
  },
  "tokenPrefix": "string"
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
   curl -X 'POST' \ 
  'https://web-quartz.unique.network/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "mode": "Nft",
  "access": "Normal",
  "schemaVersion": "ImageURL",
  "name": "Sample collection name",
  "description": "sample collection description",
  "tokenPrefix": "TEST",
  "mintMode": true,
  "offchainSchema": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png",
  "sponsorship": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "isConfirmed": true
  },
  "limits": {
    "accountTokenOwnershipLimit": 0,
    "sponsoredDataSize": 0,
    "sponsoredDataRateLimit": 0,
    "tokenLimit": 0,
    "sponsorTransferTimeout": 0,
    "sponsorApproveTimeout": 0,
    "ownerCanTransfer": true,
    "ownerCanDestroy": true,
    "transfersEnabled": true
  },
  "constOnChainSchema": {
    "nested": {
      "onChainMetaData": {
        "nested": {
          "NFTMeta": {
            "fields": {
              "ipfsJson": {
                "id": 1,
                "rule": "required",
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  "variableOnChainSchema": "{}",
  "metaUpdatePermission": "ItemOwner",
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm"
}'
```
</details>



#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>

---

### Burn collection

```
DELETE /collection
```

Generates an unsigned extrinsic to delete the selected collection

#### Request body
```json
{
  "collectionId": 1,
  "address": "string"
}
```
  

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'DELETE' \
  'https://web.uniquenetwork.dev/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 1,
  "address": "string"
}'
```

</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>

---

### Transfer collection

```
PATCH /collection/transfer
```

Generates an unsigned extrinsic for transferring rights to collections

#### Request body
  
```json
{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}
```
  

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'PATCH' \
  'https://web-quartz.unique.network/collection/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}'
```

</details>
  

#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>

---

### Get token

```
GET /token
```

Returns information about the token by the id of the collection and token

#### Query Parameters

- **collectionId** - collection identificator
- **tokenId** - id of token


<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/token?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```
  
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "id": 1,
  "owner": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 1,
  "constData": {
    "ipfsJson": "{\"ipfs\":\"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb\",\"type\":\"image\"}",
    "gender": "Male",
    "traits": [
      "TEETH_SMILE",
      "UP_HAIR"
    ]
  },
  "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
}
```
</details>

---

### Create token

```
POST /token
```

Creates an unsigned extrinsic to create a token inside the collection

#### Request body

```json
{
  "collectionId": 1,
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "constData": {
    "ipfsJson": "{\"ipfs\":\"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb\",\"type\":\"image\"}",
    "gender": "Male",
    "traits": [
      "TEETH_SMILE",
      "UP_HAIR"
    ]
  }
}
```

<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 0,
  "address": "string",
  "constData": {}
}'
```

</details>
  

#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>

---

### Burn token

```
DELETE /token
```

Generates an unsigned extrinsic to delete the selected token

#### Request body

```json
{
  "collectionId": 1,
  "tokenId": 1,
  "address": "string"
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'DELETE' \
  'https://web.uniquenetwork.dev/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 1,
  "tokenId": 1,
  "address": "string"
}'
```

</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>

---

### Transfer token
```
PATCH /token
```

Generates an unsigned extrinsic for transferring rights to a token

#### Request body

```json
{
  "collectionId": 1,
  "tokenId": 1,
  "from": "string",
  "to": "string"
}
```

<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'PATCH' \
  'https://web-quartz.unique.network/token/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 1,
  "tokenId": 1,
  "from": "string",
  "to": "string"
}'
```
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

</details>
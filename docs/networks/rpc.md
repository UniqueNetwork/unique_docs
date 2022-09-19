# Unique Palette - RPC calls 

### :small_blue_diamond:**_accountBalance_**

**Description**

Gets the number of tokens that belong to the specified account in the specified collection. 

**Declaration**

`accountBalance(collection, account, at)`

`collection [u32]` - an ID of the collection which will be checked. 

`account [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.  

**Code Example**
```javascript
api.rpc.unique.accountBalance(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'})
api.rpc.unique.accountBalance(5, {Ethereum: '0x1C9d253C8f9f4b25d32F107B0460aEEb4b6fefb5'}, 0x6897ebb348679a45f8adb75f62a80d)
```

**Result**

```
3
```

### :small_blue_diamond:**_accountTokens_**

**Description**

Gets the IDs of the tokens that belong to the specified account in the specified collection.

**Declaration**

`accountTokens(collection, account, at)`

`collection [u32]` - an ID of the collection which will be checked.

`account [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.accountTokens(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'})
api.rpc.unique.accountTokens(5, {Ethereum: '0x1C9d253C8f9f4b25d32F107B0460aEEb4b6fefb5'}, 0x6897ebb348679a45f8adb75f62a80d)
```

**Result**

```
[
  1
  2
  3
]
```

### :small_blue_diamond:**_adminlist_**

**Description**

Gets the list of administrators for the specified collection. 

**Declaration**

`adminlist(collection, at)`

`collection [u32]` - an ID of the collection which will be checked.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.adminlist(2)
api.rpc.unique.adminlist(5, 0x6897ebb348679a45f8adb75f62a80d)
```

**Result**

```
{
  Substrate: yGF5zc2jiMXsGTcAzMe6Qq4euW2yGLHTevcyfgoT1riK2zhov
}
```

### :small_blue_diamond:**_allowance_**

**Description**

:question:  - Get allowed amount -  Checks whether a token can be sent. 

**Declaration**

`allowance(collection, sender, spender, tokenId, at)`

`collection [u32]` - an ID of the collection which will be checked.

`sender [PalletEvmAccountBasicCrossAccountIdRepr]` - The account which sends a token. An object represents the set of the address type and its value.

`spender [PalletEvmAccountBasicCrossAccountIdRepr]` - The account which pays for sending tokens. An object represents the set of the address type and its value.

`tokenId [u32]` - a token ID which will be used. 

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.allowance(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, {Substrate: '5CiDszFdQ7jDhPwRNBLc4EZHAgbYyhGMbNSaJDQgmYibzm44'}, 1)
```

**Result**

```
0 ? 
```

### :small_blue_diamond:**_allowed_**

**Description**

Check if a user is allowed to use a collection. Returns `true` or `false`. 

**Declaration**

`allowed(collection, account, at)`

`collection [u32]` - an ID of the collection which will be checked.

`account [PalletEvmAccountBasicCrossAccountIdRepr]` - An object represents the set of the address type and its value.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.allowed(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}) 
```

**Result**

```
false
```

### :small_blue_diamond:**_allowlist_**

**Description**

Gets the addresses that are in the specified collection allow list. 

**Declaration**

`allowlist(collection, at)`

`collection [u32]` - an ID of the collection which will be checked.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.allowList(2) 
```

**Result**

```
{
  Substrate: yGF5zc2jiMXsGTcAzMe6Qq4euW2yGLHTevcyfgoT1riK2zhov
}
```

### :small_blue_diamond:**_balance_**

**Description**

Gets amount of specific token owned by the specified account. 

**Declaration**

`balance(collection, account, tokenId, at)`

`collection [u32]` - an ID of the collection which will be checked.

`account [PalletEvmAccountBasicCrossAccountIdRepr]` - An object represents the set of the address type and its value.

`tokenId [u32]` - a token ID which will be used.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.balance(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 1)
api.rpc.unique.balance(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 1, 0x6897ebb348679a45f8adb75f62a80d) 
```

**Result**

```
1
```

### :small_blue_diamond:**_collectionById_**

**Description**

Get the collection details. 

**Declaration**

`collectionById(collection, at)`

`collection [u32]` - an ID of the collection which will be checked.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.collectionById(2)
```

**Result**

<details>
  <summary>click to expand</summary>

```
{
  owner: yGHGXr2qCKygrxFw16XXEYRLmQwQt8RN8eMN5UuuJ17ZFPosP
  mode: NFT
  name: [
    70
    114
    111
    103
    32
    109
    101
    109
    101
    115
  ]
  description: []
  tokenPrefix: FROG
  sponsorship: {
    Unconfirmed: yGCvfciMQmcx3NW1HRdA48EnSffqzrUggjeW6trA2HHwh1vEj
  }
  limits: {
    accountTokenOwnershipLimit: null
    sponsoredDataSize: null
    sponsoredDataRateLimit: null
    tokenLimit: null
    sponsorTransferTimeout: 0
    sponsorApproveTimeout: 0
    ownerCanTransfer: false
    ownerCanDestroy: true
    transfersEnabled: null
  }
  permissions: {
    access: Normal
    mintMode: false
    nesting: {
      tokenOwner: false
      collectionAdmin: false
      restricted: null
    }
  }
  externalCollection: false
}
```

</details>

### :small_blue_diamond:**_collectionStats_**

**Description**

Gets the statistics of the collections on the chain. 

**Declaration**

`collectionStats(at)`

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.collectionStats()
api.rpc.unique.collectionStats(0x6897ebb348679a45f8adb75f62a80d)
```

**Result**

```
{
created: 472
destroyed: 133
alive: 339
}
```

### :small_blue_diamond:**_collectionTokens_**

**Description**

Get tokens (IDs) contained in a collection.

**Declaration**

`collectionTokens(collection, at)`

`collection [u32]` - an ID of the collection which will be checked.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.collectionTokens(2)
```

**Result**

```
[
  1
  2
  3
]
```

### :small_blue_diamond:**_effectiveCollectionLimits_**

**Description**

Gets effective collection limits. 

**Declaration**

`effectiveCollectionLimits(collection, at)`

`collection [u32]` - an ID of the collection which will be checked.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.effectiveCollectionLimits(2)
```

**Result**

```
{
  accountTokenOwnershipLimit: 100,000
  sponsoredDataSize: 2,048
  sponsoredDataRateLimit: SponsoringDisabled
  tokenLimit: 4,294,967,295
  sponsorTransferTimeout: 0
  sponsorApproveTimeout: 0
  ownerCanTransfer: false
  ownerCanDestroy: true
  transfersEnabled: true
}
```

### :small_blue_diamond:**_lastTokenId_**

**Description**

Gets the last token ID.  

**Declaration**

`lastTokenId(collection, at)`

`collection [u32]` - an ID of the collection which will be checked.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.lastTokenId(10)
```

**Result**

```
3
```

### :small_blue_diamond:**_nextSponsored_**

**Description**

Get the number of blocks when the sponsored transaction is available. 

**Declaration**

`nextSponsored(collection, account, tokenId, at)`

`collection [u32]` - an ID of the collection which will be checked.

`account [PalletEvmAccountBasicCrossAccountIdRepr]` - An object represents the set of the address type and its value.

`tokenId [u32]` - a token ID which will be used.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.nextSponsored(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 1)
api.rpc.unique.nextSponsored(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 1, 0x6897ebb348679a45f8adb75f62a80d) 
```

**Result**

```
0 ? 
```

### :small_blue_diamond:**_tokenExists_**

**Description**

Check if a token exists in a collection. Returns `true` or `false`. 

**Declaration**

`tokenExists(collection, tokenId, at)`

`collection [u32]` - an ID of the collection which will be checked.

`tokenId [u32]` - a token ID which will be used.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.tokenExists(2, 1)
api.rpc.unique.tokenExists(2, 1, 0x6897ebb348679a45f8adb75f62a80d) 
```

**Result**

```
true
```

### :small_blue_diamond:**_tokenOwner_**

**Description**

Gets an owner of a token in a collection. 

**Declaration**

`tokenOwner(collection, tokenId, at)`

`collection [u32]` - an ID of the collection which will be checked.

`tokenId [u32]` - a token ID which will be used.

`at [hash] Optional` - allows to specify at which moment of the chain (block hash) you need to perform the check. If you leave it empty, the result will be for the last block of the chain.

**Code Example**
```javascript
api.rpc.unique.tokenOwner(2, 1)
api.rpc.unique.tokenOwner(2, 1, 0x6897ebb348679a45f8adb75f62a80d) 

```
**Result**

```
{
  Substrate: yGF5zc2jiMXsGTcAzMe6Qq4euW2yGLHTevcyfgoT1riK2zhov
}
```
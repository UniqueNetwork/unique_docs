# Unique Pallet - Extrinsics 

### :small_orange_diamond:**_addCollectionAdmin_**

**Description**

Adds an admin of the specified collection. 

**Declaration** 

`addCollectionAdmin(collectionId, newAdminId)`

`collectionId [u32]` - an ID of the collection which will be affected. 

`newAdminId [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value. 

**Code Example** 
```javascript
api.tx.unique.addColletionAdmin(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'})
api.tx.unique.addColletionAdmin(5, {Ethereum: '0x1C9d253C8f9f4b25d32F107B0460aEEb4b6fefb5'})
```

### :small_orange_diamond:**_addToAllowList_**

**Description**

Adds an address to collection allow list. 

**Declaration**

`addToAllowList(collectionId, newAdminId)`

`collectionId [u32]` - an ID of the collection which will be affected.

`newAdminId [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

**Code Example**
```javascript
api.tx.unique.addToAllowList(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'})
api.tx.unique.addToAllowList(5, {Ethereum: '0x1C9d253C8f9f4b25d32F107B0460aEEb4b6fefb5'})
```

### :small_orange_diamond:**_approve_**

**Description**

Sets, changes or remove approved address to transfer the ownership of an NFT. 

**Declaration**

`approve(spender, collectionId, itemId, amount)`

`spender [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

`collectionId [u32]` - an ID of the collection which will be affected.

`itemId [u32]` - token Id that will be affected. 

`amount [u128]` - use `1` for NFT.

**Code Example**
```javascript
api.tx.unique.approve({Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 10, 200, 1)
```

### :small_orange_diamond:**_burnFrom_**

**Description**

Destroys a concrete instance of NFT on behalf of the specific user.

**Declaration**

`burnFrom(collectionId, from, itemId, value)`

`collectionId [u32]` - an ID of the collection which will be affected.

`from [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

`itemId [u32]` - token Id that will be affected.

`value [u128]` - use `1` for NFT.

**Code Example**
```javascript
api.tx.unique.burnFrom(10, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 200, 1) 
```

### :small_orange_diamond:**_burnItem_**

**Description**

Destroys a concrete instance of NFT on behalf of the owner.

**Declaration**

`burnItem(collectionId, itemId, value)`

`collectionId [u32]` - an ID of the collection which will be affected.

`itemId [u32]` - token Id that will be affected.

`value [u128]` - use `1` for NFT.

**Code Example**
```javascript
api.tx.unique.burnItem(10, 200, 1) 
```

### :small_orange_diamond:**_changeCollectionOwner_**

**Description**

Changes the collection owner to the specified address.  

**Declaration**

`changeCollectionOwner(collectionId, newOwner)`

`collectionId [u32]` - an ID of the collection which will be affected.

`newOwner [string]` - the new owner address in the Substrate format. Returns boolean (true on success, false on fail).

**Code Example**
```javascript
api.tx.unique.changeCollectionOwner(10, '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21')
```

### :small_orange_diamond:**_confirmSponsorship_**

**Description**

Confirms consent to sponsor the collection on behalf of the signer. Returns bool true on success.

**Declaration**

`confirmSponsorship(collectionId)`

`collectionId [u32]` - an ID of the collection which will be used.

**Code Example**
```javascript
const result = api.tx.unique.confirmSponsorship(10)
await result.sign(keyring) 
```

### :small_orange_diamond:**_createCollection_**

**Description**

_Deprecated_. Please use the [createCollectionEx](#createCollectionEx) method. 

### :small_orange_diamond:**_createCollectionEx_**

**Description**

Creates a new collection on the chain. The signer must have sufficient funds to create the collection. Returns a UniqueNFTCollection object from the created collection

**Declaration**

`createCollectionEx(collectionOptions)`

`collectionOptions [UpDataStructsCreateCollectionData]` - structure that contains the data in the JSON format. See below.

<details>
    <summary>click to expand</summary>

```javascript   
   collectionOptions: {
      name: string,
      description: string,
      tokenPrefix: string,
      pendingSponsor?: string,
      permissions: {
      access?: "AllowList" | "Normal",
      mintMode?: boolean,
      nesting: {collectionAdmin: boolean, tokenOwner: boolean, restricted: null | Number[]}
      },
      limits?: ChainLimits,
      properties?: ({key: string, value: string})[],
      tokenPropertyPermissions?: ({key: string, permission: {mutable?: boolean, collectionAdmin?: boolean, tokenOwner?: boolean}})[]
   }
```
</details>

**Code Example**
```javascript
api.tx.unique.createCollectionEx({name: 'test', description: 'test description', tokenPrefix: 'tst'})
```

### :small_orange_diamond:**_createItem_**

**Description**

This method creates an item in the NFT collection and assigns it to the specified owner.

**Declaration**

`createItem(collectionId, owner, data)`

`collectionId [u32]` - an ID of the collection which will be affected.

`owner [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

`data [UpDataStructsCreateItemData]` - structure that contains the token data in the JSON format. See below. 

<details>
    <summary>click to expand</summary>

```javascript   
  collectionOptions: {
      name: string,
      description: string,
      tokenPrefix: string,
      pendingSponsor?: string,
      permissions: {
      access?: "AllowList" | "Normal",
      mintMode?: boolean,
      nesting: {collectionAdmin: boolean, tokenOwner: boolean, restricted: null | Number[]}
      },
      limits?: ChainLimits,
      properties?: ({key: string, value: string})[],
      tokenPropertyPermissions?: ({key: string, permission: {mutable?: boolean, collectionAdmin?: boolean, tokenOwner?: boolean}})[]
  }
```
</details>

**Code Example**
```javascript
api.tx.unique.createItem(1, {Substrate: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'}, {key: 'name', value: 'Alice'})
```

### :small_orange_diamond:**_createMultipleItems_**

**Description**

_Deprecated_. Please use the [createMultipleItemsEx](#createMultipleItemsEx) method. 

### :small_orange_diamond:**_createMultipleItemsEx_**

**Description**

Creates several new tokens at once in the specified collection (up to 100 at a time). All property keys must be present in the collection. Returns an object with the transaction result.

**Declaration**

`createMultipleItemsEx(collectionId, data)`

`collectionId [u32]` - an ID of the collection which will be affected.

`data [UpDataStructsCreateItemExData]` - structure that contains the address and token data in the JSON format. See below. 

<details>
  <summary>click to expand</summary>

```javascript
data: ({
    owner: {Substrate?: string, Ethereum?: string},
    properties?: ({key: string, value: string})[]
  )[]
```
</details>

**Code Example**
```javascript
api.tx.unique.createMultipleItemsEx(1, [
  {{Substrate: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'}, {key: 'name', value: 'Alice'}},
  {{Substrate: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'}, {key: 'name', value: 'Bob'}}
])
```

### :small_orange_diamond:**_deleteCollectionProperties_**

**Description**

Deletes on-chain properties from the collection. Returns bool true on success.

**Declaration** 

`deleteCollectionProperties(collectionId, propertyKeys)`

`collectionId [u32]` - an ID of the collection which will be affected.

`propertyKeys [PropertyKeys vector]` - the array of the properties that will be deleted.

**Code example**
```javascript
api.tx.unique.deleteCollectionProperties(1, ['is_substrate'])
```

### :small_orange_diamond:**_deleteTokenProperties_**

**Description**

Deletes properties from an NFT token. Returns bool true on success.

**Declaration**

`deleteTokenProperties(collectionId, tokenId, propertyKeys)`

`collectionId [u32]` - an ID of the collection which will be affected.

`tokenId [u32]` - token Id that will be affected.

`propertyKeys [PropertyKeys vector]` - the array of the properties that will be deleted.

**Code example**
```javascript
api.tx.unique.deleteTokenProperties(6, 200, ['name'])
```

### :small_orange_diamond:**_destroyCollection_**

**Description**

Destroys a collection if there are tokens in it and if the signer has sufficient permissions. 

**Declaration** 

`destroyCollection(collectionId)`

`collectionId [u32]` - an ID of the collection which will be affected.

**Code Example**
```javascript
api.tx.unique.destroyCollection(7)
```

### :small_orange_diamond:**_removeCollectionAdmin_**

**Description**

Removes a collection administrator. An admin address can remove itself. Returns bool true on success.

**Declaration**

`removeCollectionAdmin(collectionId,accountId)`

`collectionId [u32]` - an ID of the collection which will be affected.

`accountId [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

**Code Example**
```javascript
api.tx.unique.removeCollectionAdmin(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'})
api.tx.unique.removeCollectionAdmin(5, {Ethereum: '0x1C9d253C8f9f4b25d32F107B0460aEEb4b6fefb5'})
```

### :small_orange_diamond:**_removeCollectionSponsor_**

**Description**

Removes the collection sponsor. Switch back to the pay-per-own-transaction model.

**Declaration**

`removeCollectionSponsor(collectionId)`

`collectionId [u32]` - an ID of the collection which will be affected.

**Code Example**
```javascript
api.tx.unique.removeCollectionSponsor(7)
```

### :small_orange_diamond:**_removeFromAllowList_**

**Description**

Remove an address from the allow list.

**Declaration**

`removeFromAllowList(collectionId, address)`

`collectionId [u32]` - an ID of the collection which will be affected.

`address [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

**Code Example**
```javascript
api.tx.unique.removeFromAllowList(2, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'})
api.tx.unique.removeFromAllowList(5, {Ethereum: '0x1C9d253C8f9f4b25d32F107B0460aEEb4b6fefb5'})
```

### :small_orange_diamond:**_setCollectionLimits_**

**Description**

Sets the limits of the collection. At least one limit must be specified for a correct call. Returns bool true on success.

**Declaration**

`setCollectionLimits(collectionId, newLimit)`

`collectionId [u32]` - an ID of the collection which will be affected.

`limits [UpDataStructsCollectionLimits]` - structure that contains the limits for the collection. See below. 

<details> 
  <summary>click to expand</summary>

```javascript
limits: {
    accountTokenOwnershipLimit?: Number,
    sponsoredDataSize?: Number,
    sponsoredDataRateLimit?: Number,
    tokenLimit?: Number,
    sponsorTransferTimeout?: Number,
    sponsorApproveTimeout?: Number,
    ownerCanTransfer?: boolean,
    ownerCanDestroy?: boolean,
    transfersEnabled?: boolean
}
```
</details>

**Code Example**
```javascript
api.tx.unique.setCollectionLimits(7, {transfersEnabled: false})
```

### :small_orange_diamond:**_setCollectionPermissions_**

**Description**

Sets on-chain permissions for selected collection. Returns bool true on success.

**Declaration**

`setCollectionPermissions(collectionId, newLimit)`

`collectionId [u32]` - an ID of the collection which will be affected. 

`newLimit [UpDataStructsCollectionPermissions]` - structure that contains the permissions for a collection. See below.

<details> 
  <summary>click to expand</summary>

```javascript
permissions: {
    access?: 'Normal' | 'AllowList',
    mintMode?: boolean,
    nesting?: {tokenOwner: boolean, collectionAdmin: boolean, restricted: null | Number[]}
}
```
</details>

**Code Example**
```javascript
api.tx.unique.setCollectionPermissions(6, {mintMode: false})
```

### :small_orange_diamond:**_setCollectionProperties_**

**Description**

Sets on-chain properties for the specified collection. Returns bool true on success.

**Declaration**

`setCollectionProperties(collectionId, properties)`

`collectionId [u32]` - an ID of the collection which will be affected. 

`properties [UpDataStructsProperty vector]` - array of the structures that represent a collection property. 

**Code Example**
```javascript
api.tx.unique.setCollectionProperties(6, [{key: 'name', value: 'Alice'}, {key: 'is_substrate', value: 'true'}])
```

### :small_orange_diamond:_**setCollectionSponsor**_

**Description**

Sets a sponsor address for a collection. 

**Declaration**

`setCollectionSponsor(collectionId, newSponsor)`

`collectionId [u32]` - an ID of the collection which will be affected.

`newSponsor [string]` - the new sponsor address in the Substrate format. Returns boolean (true on success, false on fail).

**Code Example**
```javascript
api.tx.unique.setCollectionSponsor(10, '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21')
```

### :small_orange_diamond:**_setTransfersEnabledFlag_**

**Description**

Set the _transfers_enabled_ value for a specified collection.

**Declaration**

`setTransfersEnabledFlag(collectionId, value)`

`collectionId [u32]` - an ID of the collection which will be affected.

`value [boolean]` - true or false depending on whether you want to enable/disable the flag.

**Code Example**
```javascript
api.tx.unique.setTransfersEnabledFlag(7, true)
```

### :small_orange_diamond:**_setTokenProperties_**

**Declaration**

`setTokenProperties(collectionId, tokenId, properties)`

`collectionId [u32]` - an ID of the collection which will be affected.

`tokenId [u32]` - token Id that will be affected.

`properties [UpDataStructsProperty vector]` - an array of structures that contains properties for a token. 

**Code Example**
```javascript
api.tx.unique.setTokenProperties(6, 200, [{key: 'name', value: 'Alice'}])
```

### :small_orange_diamond:**_setPropertyPermissions_**

**Description**

Sets permissions for the token properties. The token can contain only properties with permissions. Returns bool true on success.

**Declaration**

`setPropertyPermissions(collectionId, propertyPermissions)`

`collectionId [u32]` - an ID of the collection which will be affected.

`propertyPermissions [UpDataStructsPropertyKeyPermission vector]` - an array of structures that contains permissions for properties.  

<details>
<summary>click to expand</summary>

```javascript
tokenPropertyPermissions: {
      key: string, 
      permission: {
          mutable?: boolean, 
          collectionAdmin?: boolean, 
          tokenOwner?: boolean
    }
}
```
</details>

**Code Example**
```javascript
api.tx.unique.setTokenPropertyPermissions(1, [{key: 'name', permission: {mutable: true, collectionAdmin: true, tokenOwner: true}}])
```

### :small_orange_diamond:**_transfer_**

**Description**

Transfers an NFT token from signer to a given address (Substrate or Ethereum). Returns bool true on success.

**Declaration**

`transfer(recipient, collectionId, itemId, value)`

`recipient [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.

`collectionId [u32]` - an ID of the collection which will be affected.

`itemId [u32]` - token Id that will be affected.

`value [u128]` - use `1` for NFT.

**Code Example**
```javascript
api.tx.unique.transfer({Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 10, 200, 1)
```

### :small_orange_diamond:**_transferFrom_**

**Description**

Transfers NFT token from given address (Substrate or Ethereum) to given address (Substrate or Ethereum). The signer must be authorized to do so. Returns bool true on success.

**Declaration**
`transferFrom(from, recipient, collectionId, itemId, value)`

`from [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value. You need to specify the account which sends a token.

`recipient [PalletEvmAccountBasicCrossAccountIdRepr]` - an object which represents the set of the address type and its value.You need to specify the account which receives a token.

`collectionId [u32]` - an ID of the collection which will be affected.

`itemId [u32]` - token Id that will be affected.

`value [u128]` - use `1` for NFT.

**Code Example**
```javascript
api.tx.unique.transferFrom({Substrate: '5CiDszBRQ7jDhPwGtrSa4EZHAgbEwhGMbNSaJDQgmYibzy44'}, {Substrate: '5CiDszBRQ7jDhPwRNBLc4EZHAgbEwhGMbNSaJDQgmYibzm21'}, 10, 200, 1)
```

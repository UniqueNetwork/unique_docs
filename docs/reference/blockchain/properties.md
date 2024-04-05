# Collection and Token Properties

Properties of NFT collections and tokens are implemented in the blockchain as a BTreeMap data storage block.

Furthermore, this BTreeMap consists of a unique set of keys and values that are defined by the owner or administrator of a collection.

Each token of a collection inherits a list of common key/value pairs that can be set for that token and that are defined for that collection (listed in `tokenPropertyPermissions` - see below). A token cannot be attributed to an arbitrary key; only a key from this list can be added. But the setting of a key's value is optional and can remain 'unset,' i.e., there is no default value that is automatically set for a newly created token. If the user has the permissions that allow the setting of properties, they may set and change the values of the token's keys.

The parameter block is restricted by both the data size and the number of keys. The maximum number of keys is 64 for both the collections and tokens. The maximum size of a parameter data block (keys and values) for a collection is 40kB, and for a token, 32kB.

Key naming is restricted to a limited set of the following characters: Latin letter any case, numbers, dot, hyphen, and underscore (regex: ^[0-9a-zA-Z\.\-_]).

Only the owner and designated administrators can modify the properties of a collection.

Access to changing token properties is based on access rights to token keys stored in the collection (`tokenPropertyPermissions`).

Only the owner and designated administrators of a collection can add and modify keys.

Keys can only be added. To avoid token corruption, a key cannot be removed once it is created/added. Although keys can't be deleted, we can delete the values attributed to a key if the key is mutable.

The value of a key can be changed by the owner/administrator only if it has not been declared as an immutable key ('mutable' attribute set to _false_).

A note on the mutability attribute: if it is set to _false_, token data can only be set once. Immutable data stays immutable forever. Furthermore, the mutable attribute can be changed only from _true_ to _false_. Changing it from _false_ to _true_ is not possible.

In summary, the configuration or permissions to create and modify properties of a collection is carried out using three keys - `mutable,` `collectionAdmin`, and `tokenOwner.`

- `mutable` attribute sets the immutability attribute.
- `collectionAdmin` grants the designated collection administrator and the collection owner 'write/modify' access
- `tokenOwner` grants the token owner 'write/modify' access


## RPC Methods

### 🔶 collectionProperties

Obtain collection properties array.

```javascript
api.rpc.unique.collectionProperties(collectionId)
```

Returns an array of objects: `{key: string, value: string}`

### 🔶 propertyPermissions

Get property permissions array.

```javascript
api.rpc.unique.propertyPermissions(collectionId)
```

Returns an array of objects: `{key: string, permission: {mutable: bool, tokenOwner: bool, collectionAdmin: bool}}`

### 🔶 tokenData

Get token data.

Invoke:

```javascript
api.rpc.unique.tokenData(collectionId, tokenId)
```
with key `properties`.

### 🔶 tokenProperties

Token properties can also be obtained via the dedicated `tokenProperties` method:

```javascript
api.rpc.unique.tokenProperties(collectionId, tokenId)
```

Returns an array of objects: `{key: string, value: string}`

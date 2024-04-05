# Collection data

[[toc]]

## name, description, tokenPrefix

These properties define the basic metadata required for each collection.

- `name` - 64 bytes max
- `description` - 256 bytes max
- `tokenPrefix` - 16 bytes max

## mode

<!-- TODO link to main articles -->
- `NFT` - Non-fungible tokens format by Unique Network. ERC-721 compatible.
- `ReFungible` - essentially a non-fungible token (NFT) with a unique ability: partial ownership
- `Fungible` - fungible tokens format by Unique Network. ERC-20 compatible.

## limits
<!-- TODO link to sponsoring -->
#### `accountTokenOwnershipLimit: u32`
The maximum number of tokens that one address can own

#### `sponsoredDataSize: u32`

The maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode

#### `sponsoredDataRateLimit: UpDataStructsSponsoringRateLimit`

Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored

#### `tokenLimit: u32`

The total amount of tokens that can be minted in this collection

#### `sponsorTransferTimeout: u32`

The time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored

#### `sponsorApproveTimeout: u32`

The time interval in blocks defines once per how long a non-privileged user approve transaction can be sponsored.

#### `ownerCanTransfer: bool`

Boolean value that tells if the collection owner or admins can transfer or burn tokens owned by other non-privileged users
#### `ownerCanDestroy: bool`
Boolean value that shows whether the collection owner can destroy it
#### `transfersEnabled: bool`

The flag that defines whether token transfers between users are currently enabled

## permissions

#### `access`
- `Normal` - default value. No extra permissions or limitations
- `AllowList` - only accounts added to the allow list (`unique.addToAllowList`) can own tokens. Also, these accounts can mint tokens if mint mode permission is set to true.
#### `mintMode`
Default to false. Add permission to mint tokens to addresses added to the AllowList
#### `nesting`
- `tokenOwner` - default to false. Allows nesting to token owner
- `collectionAdmin` - default to false. Allows nesting to collection administrators and collection owner
- `restricted` - default to null. Specifies collection IDs allowed for nesting

Read more about [nesting](./nesting.md)

## tokenPropertyPermissions

Defines two main aspects:

- Lists the properties that an NFT can have. A maximum of 64 properties can be set
- Defines who can or cannot change these properties

This permission affects the following groups of methods in the unique pallet:
- Token creation: `createItem`, `createMultipleItems`, `createMultipleItemsEx`
- Token property management: `deleteTokenProperties`, `setTokenProperties`

Here’s what these permissions mean:
- `mutable` – whether a token’s property can be set or overwritten after minting. It only makes sense if at least one of the following properties is set to true.
- `collectionAdmin` – whether a collection administrator can set a token’s property.
- `tokenOwner` – whether a token’s owner can set its property.

Examples:
1) `{mutable: false, collectionAdmin: true, tokenOwner: false}`
Only the collection administrator can set the token’s property at the time of token creation.

2) `{mutable: true, collectionAdmin: true, tokenOwner: true}`
The collection administrator and the token owner can set the token’s property at the time of the collection’s creation and through token property management methods.

3) `{mutable: true, collectionAdmin: false, tokenOwner: true}`
Only the token owner can set the token’s property. If an administrator mints a token to their own address, they can set the property as the token owner. If the administrator mints a token to another address, only the new owner can set the property after the token is created.

4) `{mutable: false, collectionAdmin: false, tokenOwner: false}`
No one can ever set the token’s property.

Read more about [token properties](./properties.md)

## properties

Set of key/value pairs defined on a collection level. The maximum number of keys is 64. The maximum size of a parameter data block (keys and values) is 40kB.

Read more about [collection properties](./properties.md)

## adminList

The list of privileged accounts. Read more about [roles and access rights](./owner-admin-roles.md)


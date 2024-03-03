# Limitations

Here's a list of typical restrictions you might come across.

## NFTs minted at once

Unique API provides a method for minting multiple NFTs in one transaction; for bare API - `unique.createMultipleItemsEx`, or using SDK - `sdk.token.createMultiple`. However, there is a limit for a block weight which could lead to `1010: Invalid Transaction: Transaction would exhaust the block limits` error.

<!-- TODO update this limit  -->
The safe limit is **35 NFTs minted at once**.
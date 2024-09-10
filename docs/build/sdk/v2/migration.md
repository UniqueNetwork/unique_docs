# Migration from SDK V1 to SDK V2

This guide provides instructions on migrating from SDK V1 to SDK V2, highlighting key changes and improvements.


## Working with Balances

The method signature for retrieving balances has remained the same.

```ts
const alice = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

// V1
const balanceV1 = await sdkV1.balance.get({ address: alice });

// V2
const balanceV2 = await sdkV2.balance.get({ address: alice });
```

However, the format of the returned balance object has been simplified. All balances are now returned in raw format, leaving it to the application to format the value as needed.


```ts
// V1
console.log(balanceV1.availableBalance.amount); // 6994.40616

// V2
console.log(balanceV2.available); // 6994406160000000000000
```

For token transfers, SDK V2 requires the amount to be specified in raw format instead of a formatted number.


```ts
// V1
sdkV1.balance.transfer({ amount: 2.3, destination: alice });

// V2
sdkV2.balance.transfer({ amount: "2300000000000000000", to: alice });

// or
sdkV2.balance.transfer({ amount: 2.3, to: alice, isAmountInCoins: true });
```

## Working with Collections and Tokens


### Reading Collections

There are only minor changes in how collections are retrieved.

```ts
// V1
const collectionV1 = await sdkV1.collection.get({ collectionId: 665 });

// V2
const collectionV2 = await sdkV2.collection.get({ collectionId: 665 });

// or collection may be retrieved by address
const collectionV2_ = await sdkV2.collection.get({ collectionId: '0x17C4E6453cc49aaAAeaCA894E6D9683E00000299' });

```

### Reading Tokens

The method signature for retrieving tokens has no changes.

```ts
// V1
const tokenV1 = await sdkV1.token.get({ collectionId: 1, tokenId: 1 });

// V2
const tokenV2 = await sdkV2.token.get({ collectionId: 1, tokenId: 1 });

// collectionId may be replaced with collection address
const tokenV2_ = await sdkV2.token.get({ collectionId: '0x17C4e6453cC49AAaaEaCA894E6D9683e00000001', tokenId: 1 });
```

However, the response format has changed significantly. SDK V2 returns attributes in the Unique Schema V2 format, even for tokens created using Unique Schema V1.


Attributes in SDK V1:


```
"0": {
 name: {
 _: "gender",
 },
 value: {
 en: "Female",
 _: "Female",
 },
 isArray: false,
 type: "string",
 rawValue: 0,
 isEnum: true,
},
"1": { ... }
```

Attributes in SDK V2:

```
[
 {
 trait_type: "gender",
 value: "Female",
 },
 { ... }
]
```

### Extrinsics

The extrinsic methods for transferring, burning, and nesting tokens remain unchanged.


## What If the Application Create Tokens in SDK-V1 Collections

If your application creates tokens in collections originally created with SDK-V1, you should continue using SDK-V1 for this purpose.

However, if your application also reads collections and tokens created by other users, it is recommended to use V2 methods for reading. This ensures that attributes are displayed correctly for new collections and tokens.


```ts
// Getting collections
sdkV1.collection.get({ collectionId: 1 });   // before
sdkV1.collection.getV2({ collectionId: 1 }); // after

// Getting tokens
sdkV1.token.get({ collectionId: 1, tokenId: 1 });   // before 
sdkV1.token.getV2({ collectionId: 1, tokenId: 1 }); // after
```


# Metadata, attributes, properties: deep dive

[[toc]]

## What is metadata?

Metadata is structured information that tells wallets, marketplaces, and block explorers how to display your NFT - the image, name, description, and traits like "rarity" or "power".

Without proper metadata, your NFT won't show images in wallets or display traits in marketplaces.

## Why metadata standards matter

Different blockchains store NFT data differently. To make your NFTs work across platforms (Unique Scan, OpenSea-compatible marketplaces, wallets), you need a metadata standard - an agreement that everyone understands.

Unique Metadata 2.0 is:

- OpenSea-compatible - follows widely accepted standards
- Stored on-chain - no broken IPFS links
- Automatically handled by SDK - you don't manage low-level properties manually

## Understanding the architecture

Let's revise what we've learned about collections and NFTs in Unique Network, focusing on how metadata fits into the bigger picture:

### 1. Collection defines structure

When you create a collection, you define `tokenPropertyPermissions` - which properties tokens can have:

```typescript
await sdk.collection.create({
  name: "Game Characters",
  tokenPropertyPermissions: [
    {
      key: "A",
      permission: { mutable: true, collectionAdmin: true, tokenOwner: true },
    },
    {
      key: "B",
      permission: { mutable: false, collectionAdmin: true, tokenOwner: false },
    },
    {
      key: "level",
      permission: { mutable: true, collectionAdmin: false, tokenOwner: true },
    },
  ],
});
```

### 2. Tokens are key-value pairs

At the blockchain core level, tokens are just a bunch of properties - key-value pairs:

```typescript
// This is what's actually stored on the blockchain
{
  "A": "value A",
  "B": "value B",
  "level": "5",
}
```

### 3. Unique Metadata is a special property

Unique Metadata is stored in a property called `tokenData`. This is an agreement - a standardized place where different UIs (wallets, marketplaces, block explorers) know to find and parse metadata.

The `tokenData` property stores structured JSON as a string:

```typescript
// tokenData property contains structured JSON
tokenData: {
  name: "Warrior #1",
  image: "https://example.com/warrior.png",
  attributes: [
    {trait_type: "Class", value: "Warrior"},
    {trait_type: "Power", value: 95}
  ]
}
```

### 4. SDK creates tokenData automatically

When using the SDK, you don't need to create the `tokenData` property manually. The SDK handles all the JSON serialization and property management automatically:

```typescript
// You write this (clean, structured)
await sdk.token.mintNFTs({
  collectionId,
  tokens: [
    {
      data: {
        name: "Warrior #1",
        image: "https://example.com/warrior.png",
        attributes: [{ trait_type: "Power", value: 95 }],
      },
    },
  ],
});

// SDK automatically:
// 1. Converts to Unique Metadata 2.0 JSON
// 2. Stores in tokenData property
// 3. Sets schemaName and schemaVersion properties
```

## Properties vs Metadata

This is the critical distinction:

| Aspect              | Properties                       | Metadata                                |
| ------------------- | -------------------------------- | --------------------------------------- |
| **What**            | Raw blockchain key-value storage | Structured data in `tokenData` property |
| **Level**           | Blockchain core                  | Application-level agreement             |
| **Format**          | Any string value                 | Standardized JSON (Unique 2.0)          |
| **Third-party UIs** | Won't interpret custom keys      | Automatically parsed and displayed      |
| **Use case**        | Application-specific logic       | Cross-platform NFT display              |

## Custom properties vs metadata attributes

Rule of thumb:

- Store everything important for third-party UIs (wallets, marketplaces) in metadata attributes
- Store everything important for rarity and traits in metadata attributes
- Store everything that's application-specific only in custom properties

Here's a practical example showing when to use each approach:

```typescript
await sdk.token.mintNFTs({
  collectionId,
  tokens: [
    {
      // METADATA: For wallets, marketplaces, rarity tools
      data: {
        name: "Warrior #1",
        image: "https://example.com/warrior.png",
        attributes: [
          { trait_type: "Class", value: "Warrior" }, // Rarity trait
          { trait_type: "Power", value: 95 }, // Rarity trait
          { trait_type: "Level", value: 5 }, // Display trait
          { trait_type: "Experience", value: 1250 }, // Display trait
        ],
      },

      // PROPERTIES: For your application logic only
      properties: [
        { key: "last_battle_timestamp", value: "1704672000" },
        { key: "cooldown_expires", value: "1704675600" },
        { key: "equipped_weapon_id", value: "sword_001" },
        { key: "internal_game_state", value: "active" },
      ],
    },
  ],
});
```

**Why separate level and experience into attributes?**

- Marketplaces can filter "Level > 10"
- Rarity tools can calculate "Only 5% of warriors have Level 5+"
- Users see traits in wallets
- Your game still reads them from metadata

**Why keep cooldown and timestamps in properties?**

- Not relevant for rarity or marketplace display
- Change frequently (metadata updates are more expensive)
- Only your game logic needs them
- Faster to read/write as simple properties

### Querying properties

```typescript
// Get token with properties
const token = await sdk.token.get({ collectionId, tokenId });

// Access custom properties
const cooldownProp = token.properties.find((p) => p.key === "cooldown_expires");
console.log("Cooldown expires:", cooldownProp?.value);
```

### Mutating properties

```typescript
// Update custom property (if mutable)
await sdk.token.setProperties({
  collectionId,
  tokenId,
  properties: [
    { key: "last_battle_timestamp", value: String(Date.now()) },
    { key: "cooldown_expires", value: String(Date.now() + 3600000) },
  ],
});
```

## Images and media

Unique Metadata 2.0 properly supports multiple media types:

```typescript
await sdk.token.mintNFTs({
  collectionId,
  tokens: [
    {
      data: {
        name: "Epic Character",
        image: "https://example.com/character.png", // Main image

        media: {
          video: {
            type: "video",
            url: "https://example.com/animation.mp4",
            poster: { url: "https://example.com/poster.png" },
          },
          soundtrack: {
            type: "audio",
            url: "https://example.com/theme.mp3",
            thumbnail: { url: "https://example.com/album-art.png" },
          },
        },
      },
    },
  ],
});
```

## Metadata mutability

Metadata mutability is defined on the collection level. Remember, metadata is stored in the `tokenData` property, and its mutability is controlled by `tokenPropertyPermissions`.

By default, when you create a collection with SDK, `tokenData` is mutable by collection admin only.

```typescript
// Create collection with mutable metadata
await sdk.collection.create({
  name: "Evolving Characters",
  tokenPropertyPermissions: [
    {
      key: "tokenData",
      permission: { mutable: true, collectionAdmin: true, tokenOwner: false },
    },
  ],
});

// Later, update metadata
await sdk.token.updateNft({
  collectionId,
  tokenId,
  data: {
    attributes: [
      { trait_type: "Power", value: 120 }, // Evolved!
      { trait_type: "Level", value: 10 },
    ],
  },
});
```

For immutable collections (like art), set `mutable: false` for `tokenData`.

## Working with metadata

### Minting with metadata

```typescript
await sdk.token.mintNFTs({
  collectionId,
  tokens: [
    {
      data: {
        name: "Warrior #1",
        description: "A legendary warrior from the Fire Kingdom",
        image: "https://example.com/warrior.png",

        attributes: [
          { trait_type: "Class", value: "Warrior" },
          { trait_type: "Power", value: 85 },
          { trait_type: "Element", value: "Fire" },
        ],

        media: {
          animation: {
            type: "video",
            url: "https://example.com/warrior-animation.mp4",
            poster: { url: "https://example.com/poster.png" },
          },
          theme: {
            type: "audio",
            url: "https://example.com/theme.mp3",
          },
        },

        royalties: [{ address: account.address, percent: 5.0 }],
      },
    },
  ],
});
```

### Querying metadata

```typescript
const token = await sdk.token.get({ collectionId, tokenId });

// SDK automatically parses tokenData
console.log(token.name); // "Warrior #1"
console.log(token.image); // "https://example.com/warrior.png"
console.log(token.attributes); // [{trait_type: "Class", value: "Warrior"}, ...]

// Raw properties also available
console.log(token.properties); // [{key: "tokenData", value: "{...}"}, ...]
```

### Updating metadata

If metadata is mutable (controlled by `tokenData` property permissions), you can update it:

```typescript
// Only works if tokenData property is mutable
await sdk.token.updateNft({
  collectionId,
  tokenId,
  data: {
    name: "Warrior #1 [Evolved]",
    attributes: [
      { trait_type: "Class", value: "Warrior" },
      { trait_type: "Power", value: 100 }, // Increased!
      { trait_type: "Evolution", value: "Stage 2" }, // New trait
    ],
  },
});
```

## Next steps

For complete technical reference of all metadata fields and types, see:

- [Unique Metadata Format Reference](./metadata-reference.md) - Complete field definitions, types, and advanced features

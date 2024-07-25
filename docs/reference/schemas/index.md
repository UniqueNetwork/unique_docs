# Unique Schema

## Overview

Unique is an NFT-oriented blockchain built on Substrate, featuring both Substrate and EVM (Ethereum Virtual Machine) capabilities. Unique emphasizes its NFT functionality, with collections and NFTs as first-class entities within the blockchain. The latest metadata schema, Unique V2, offers a modern and enhanced way to handle NFT metadata, drawing inspiration from industry standards.

[[toc]]

#### On-Chain Metadata Storage

Unlike other blockchains that rely on off-chain storage for metadata, Unique stores metadata directly on-chain using a key-value storage system called properties.

So, the Collection and NFT metadata are stored directly on the blockchain, not externally on IPFS or elsewhere.  Storing metadata on-chain enhances decentralization, which is highly valued in the crypto community. On-chain storage ensures data immutability and greater security, aligning with the ethos of blockchain technology.

## Unique Metadata Schema V2

Unique Schema V2 is an evolution from previous binary and compact encoding versions (v0 and v1), adopting a human-readable format similar to the widely accepted Ethereum NFT metadata standards. This new schema is completely compatible with the OpenSea metadata format and includes several enhancements.

#### Enhancements in Unique V2

1. **Improved Media Handling**: The new schema properly supports media files, eliminating the misuse of fields like `animation_url`. This includes fields for various media types such as images, videos, and audio.
2. **Customizable NFTs**: Unique V2 introduces customization capabilities, where one NFT can own and modify another NFT. For example, a character NFT can wear a hat NFT, with detailed instructions on how to overlay images and other content types.

The Unique Metadata Schema V2 offers a robust and flexible way to handle NFT metadata, aligning with industry standards while providing significant enhancements. This schema ensures compatibility and ease of use, making it a powerful tool for developers and users in the NFT space.

NFTs created previously in schemaVersion v0 and v1 are returned in the new format.

[Examples how to create collections NFTs in Schema V2](/tutorials/createCollectionV2)

## Schema V2 Detailed Description

First of all, [Schema V2 NFT Example](https://rest.unique.network/unique/v1/tokens/v2?collectionId=654&tokenId=1)

For using the Unique Schema V2, you may find this official library useful: [unique-nft/schemas](https://www.npmjs.com/package/@unique-nft/schemas/v/2.1.6)

Next, let's take a detailed look at all the fields of the schema.

::: tip Tip: All fields are optional

Of course, it doesn't make sense to create NFT without, for example, `image` field but the schema doesn't require any field to present.

This rule applies only to the top-level fields. Some nested fields may be required. For example, when providing the image details, specifying the image length implies that you also need to provide the image width.

:::

### Common fields

- **name** `string` - NFT token name.  
Example: `{image: "Substrapunk #1234"}`

- **description** `string` - NFT token description.  
Example: `{description: "A unique Substrapunk character with a rare hat."}`

- **image** `string` - URL to the main image associated with the NFT.  
Example: `{image: "https://example.com/artwork.png"}`

- **image_details**: [IV2ImageDetails](#iv2imagedetails) - Additional details about the main image.  
Example:
```json5:no-line-numbers
{
  image_details: {
    name: "Artwork",
    type: "image",
    format: "PNG",
    bytes: 1048576,
    width: 1000,
    height: 1000,
    sha256: "0x1234...",
  }
}
```

- **attributes**: Array of [IV2Attribute](#iv2attribute) - Array of attributes associated with the NFT.  
Example:  
```json5:no-line-numbers
{
  attributes: [
    {
      trait_type: "Color",
      value: "Red"
    },
    {
      trait_type: "Size",
      value: "Large"
    }
  ]
}
```

- **animation_url**: `string` - URL to a multi-media attachment for the item.  
  Example: `{animation_url: "https://example.com/animation.gif"}`

Since it's widely used for attaching files of any format (audio, video, etc), we recommend using the `media` field instead of `animation_url`.

- **animation_details**: [IV2ImageDetails](#iv2imagedetails) - Additional details about the animation from the `animation_url` field.
Example is the same as in the `image_details` field.

- **youtube_url**: `string` - URL to a YouTube video associated with the NFT.  
  Example: `{youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}`

- **created_by**: `string` - Address of the creator of the NFT.  
  Example: `{created_by: "0x1234..."}`

- **external_url**: `string` - URL to an external resource providing more information about the NFT.  
  Example: `{external_url: "https://example.com/nft"}`

- **background_color**: `string` - Background color of the NFT.    
Example: `{background_color: "#00BFFF"}`

- **locale**: `string` - Locale of the NFT.  
Example: `{locale: "en"}`

### Media field

- **media**: Dictionary of [IV2Media](#iv2media) - Media elements associated with the NFT.  

The `media` property is a dictionary that allows the storage of multiple media elements associated with the NFT. Each media element is represented by a key-value pair, where the key is a string identifier and the value is an instance of the [IV2Media](#iv2media) interface. This type of storage allows extremely simple control over complex media stacks within the collection. When you need to mint NFTs automatically, you can use any key for media elements, for example, `media_1`, `media_2`, etc.


::: tip Media key naming
Media keys can be any string that fits the JSON key requirements. For example, `media_1`, `media_2`, `cat`, `dog`, `hat`, etc. The key should be unique within the `media` dictionary.
:::

Example:
```json5:no-line-numbers
{
  media: {
    media_1: {
      type: "image",
      url: "https://example.com/first_image.png",
    },
    cat: {
      type: "video",
      url: "https://example.com/meow.mp4",
      // additional media details...
    },   
  }
}
```
 
To ensure optimal compatibility and performance, it is important to adhere to certain best practices and formats for both browser and mobile device support. For example, when incorporating video files, please consider using the MP4 format for broad compatibility across platforms. Similarly, when including images, it is advisable to use widely supported formats such as PNG or JPEG.

### Royalties field

Royalty fields:
- **address**: `string` - The address of the royalty recipient. May be Substrate SS-58 encoded or Ethereum address.
- **percent**: `number` - The percentage of the sale price that the recipient will receive. Valid values range is 0.00% - 99.99%.
- **isPrimaryOnly**: `boolean` - Indicates whether the royalty should be paid only on the primary sale or on primary and secondary sales. Default value is `false` which means that the royalty will be paid on both primary and secondary sales.

Example:
```json5
{
  royalties: [
    {
      address: "5HTC7UFtTbBkC7dWWFt6ec3db5LEahCHMqw6LBN5hXEeqDHm",
      percent: 1.5 // 1.5%
    },
    {
      address: "0xee53Ae81b06Ed39Ac05B2cF2311F4b399E104Ba3",
      percent: 10 // 10% 
    }
  ]
}
```

### Customizable NFT Fields

#### customizing: `Customizing`  
  Customizing options for the NFT.
  - **You need it if you want:** To allow users to visually enhance and modify base NFTs by equipping other NFTs, creating dynamic and interactive digital assets.

  - **Use case:**
    The process involves two types of collections:
    - **Base Collection:** This is the primary collection.
    - **Equip Collections:** These collections (one or more) are designed to interact with and modify the Base Collection.

    There are endless options for how Equip NFTs can customize a Base NFT:
    - **Overlay Placement for the images:** Placing the equip image over a specific part of the base image while:
      - **Layering:** Ordering and reordering layers.
      - **Precise Placement:** Placing at the desired point or area (Offset).
      - **Scaling:** Adjusting the size of both Base and Equip NFTs.
      - **Rotation:** Rotating both Base and Equip NFTs.
      - **Opacity Adjustment:** Adjusting the transparency of both Base and Equip NFTs.
    - **Customizable Backgrounds:** Setting specific backgrounds for the NFTs.
    - **Pattern or Texture Application:** Applying various patterns or textures.
    - **Morphing or Transformation:** Changing the shape or form of the images and other media types. Examples include:
      - Changing the character's hairstyle.
      - Morphing facial features.
      - Slowing the audio.
    - **Audio/Video/3D Integration:** Adding multimedia elements to images and other media types. Examples include:
      - Jingle sound with jewelry.
      - Theme music with a heroic cape.
      - Mixing audio tracks.
      - Adding subtitles to videos.

  - **Tips and best practices:** When using equip collections to enhance base NFTs, consider how each modification adds value and interest. Ensure that modifications are meaningful and enhance the overall user experience without overwhelming the base NFT.

  Interfaces for customizing:
  ```typescript
  interface Customizing {
      self: CustomizingFileInfo;
      slots?: CustomizingSlot[];
      /** @example ["mutator1","mutator2"] */
      mutators?: any[][];
      mutator_reactions?: MutatorReaction[];
  }

  interface CustomizingFileInfo {
      type: 'image' | 'animation' | 'video' | 'audio' | 'spatial' | 'pdf' | 'document' | 'other';
      url: string;
      name?: string;
      details?: MediaDetails;
      image_overlay_specs?: CustomizingImageOverlaySpecs;
      placeholder?: ImageWithDetails;
      tag?: string;
  }

  interface CustomizingSlot {
      type: 'image' | 'animation' | 'video' | 'audio' | 'spatial' | 'pdf' | 'document' | 'other';
      collections?: (string | number)[];
      name?: string;
      image_overlay_specs?: CustomizingImageOverlaySpecs;
  }

  interface MutatorReaction {
      /** @example 1 */
      layer?: number;
      /** @example 1 */
      order_in_layer?: number;
      offset?: Coordinates;
      opacity?: number;
      rotation?: number;
      scale?: Scale;
      mount_point?: Coordinates;
      parent_mount_point?: Coordinates;
      url: string;
      details?: ImageDetails;
  }

  interface Coordinates {
      x: number;
      y: number;
  }

  interface Scale {
      x: number;
      y: number;
      unit?: 'px' | '%';
  }

  interface CustomizingImageOverlaySpecs {
      /** @example 1 */
      layer?: number;
      /** @example 1 */
      order_in_layer?: number;
      offset?: Coordinates;
      opacity?: number;
      rotation?: number;
      scale?: Scale;
      mount_point?: Coordinates;
      parent_mount_point?: Coordinates;
  }
  ```

#### customizing_overrides: `CustomizingOverrides`  
  Overrides for customizing options.

  ```typescript
  interface CustomizingOverrides {
      self?: CustomizingFileInfo;
      slots?: CustomizingSlot[];
      mutators?: string[];
      mutator_reactions?: MutatorReaction[];
  }
  ```

### Optional fields

#### schemaName `string` - optional
Default value: `unique`.   
*Should be omitted when encoding tokens via Library `@unique-nft/schemas`.*

The name of the schema used for the metadata. When creating new NFTs, this should be 'unique'. This property defines the specific set of rules and attributes that the NFT adheres to. For older NFTs, created before the implementation of the 'unique' schema. This ensures backward compatibility and helps in identifying the origin and structure of the metadata associated with the NFT.

#### schemaVersion: `string` - optional
Default value: `2.0.0`.  
*Should be omitted when encoding tokens via Library `@unique-nft/schemas`.*

#### originalSchemaVersion: `string` - readonly
**Readonly field.   
Applicable only for old tokens (v0 an v1) in decoded format.**   
The original version of the schema. This property indicates the schema under which the NFT was initially created.


## Types

#### IV2Attribute

```typescript:no-line-numbers
type IV2Attribute = {
  trait_type: string
  value: string | number
  display_type?: string
}
```

#### IV2ImageDetails

*All fields are optional*

```typescript:no-line-numbers
type IV2ImageDetails = Partial<{
  name: string // name of the image (for captions, etc.)
  type: 'image' | 'animation' | 'video' | 'audio' | 'spatial' | 'pdf' | 'document' | 'other'  // type of the 
  bytes: number // size of the image file in bytes
  format: string // format of the image file (e.g., PNG, JPEG)
  sha256: string // SHA-256 hash of the image file
  width: number // width of the image in pixels
  height: number // height of the image in pixels
  order: number // order of the image
}>
```


#### IV2Media

```typescript:no-line-numbers
type IV2Media = {
  type: 'image' | 'animation' | 'video' | 'audio' | 'spatial' | 'pdf' | 'document' | 'other'
  url: string
  name?: string // name of the media (for captions, etc.)
  details?: IV2ImageDetails & Partial<{
    duration: number // duration of the media in seconds (for videos, audio, etc - where applicable)
    codecs: string[] // codecs used in the media file
    loop: boolean // whether the media should loop
  }>
  thumbnail?: { // thumbnail image for the media
    url: string,
    details?: IV2ImageDetails
  }
  poster?: { // poster image for the media (for videos - where applicable)
    url: string,
    details?: IV2ImageDetails
  }
}
```

Tips:
- The `type` and `url` fields are required.
- The `details` field extends the base type [IV2ImageDetails](#iv2imagedetails) and provides additional information about the media, such as duration, codecs, and whether the animation/video/audio should be looped in the player.
- The `thumbnail` field may be used for the thumbnail image of the media or as a cover image for an audio file.
- The `poster` field is used for the poster image of a video.

---

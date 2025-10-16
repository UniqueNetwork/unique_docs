# Unique Metadata Format

## Overview

Unique is an NFT-oriented blockchain built on Substrate, featuring both Substrate and EVM (Ethereum Virtual Machine) capabilities. Unique emphasizes its NFT functionality, with collections and NFTs as first-class entities within the blockchain. The latest metadata format, Unique 2.0, offers a modern and enhanced way to handle NFT metadata, drawing inspiration from industry standards.

[[toc]]

#### On-Chain Metadata Storage

Unlike other blockchains that rely on off-chain storage for metadata, Unique stores metadata directly on-chain using a key-value storage system called properties.

So, the Collection and NFT metadata are stored directly on the blockchain, not externally on IPFS or elsewhere. Storing metadata on-chain enhances decentralization, which is highly valued in the crypto community. On-chain storage ensures data immutability and greater security, aligning with the ethos of blockchain technology.

## Unique Metadata Metadata 2.0

Unique Metadata 2.0 is an evolution from previous binary and compact encoding versions (v0 and v1), adopting a human-readable format similar to the widely accepted Ethereum NFT metadata standards. This new metadata format is completely compatible with the OpenSea metadata format and includes several enhancements.

#### Enhancements in Unique V2

1. **Improved Media Handling**: The new metadata format properly supports media files, eliminating the misuse of fields like `animation_url`. This includes fields for various media types such as images, videos, and audio.
2. **Customizable NFTs**: Unique V2 introduces customization capabilities, where one NFT can own and modify another NFT. For example, a character NFT can wear a hat NFT, with detailed instructions on how to overlay images and other content types.

The Unique Metadata Format 2.0 offers a robust and flexible way to handle NFT metadata, aligning with industry standards while providing significant enhancements. This metadata format ensures compatibility and ease of use, making it a powerful tool for developers and users in the NFT space.

NFTs created previously in schemaVersion v0 and v1 are returned in the new format.

<!-- [Examples how to create collections NFTs in Schema V2](/tutorials/createCollectionV2) -->

## NFT Token Metadata Format 2.0 Detailed Description

First of all, [Metadata 2.0 NFT Example](https://rest.unique.network/v2/unique/token?collectionId=654&tokenId=1&withChildren=false)

For using the Unique Metadata 2.0, you may find this official library useful: [unique-nft/schemas](https://www.npmjs.com/package/@unique-nft/schemas/v/2.1.6)

Next, let's take a detailed look at all the fields of the meatadata.

::: tip Tip: All fields are optional

Of course, it doesn't make sense to create NFT without, for example, `image` field but the metadata doesn't require any field to present.

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

The field `royalties` is an array of royalty recipients and their respective percentages. This field is used to define the royalty structure for the NFT, specifying the recipients who will receive a percentage of the sale price when the NFT is sold. The `royalties` field is an array of the `IV2Royalty` objects, where each object represents a royalty recipient and their respective percentage. The `royalties` field is optional and can be used to define the royalty structure for the NFT.

Royalties item (`IV2Royalty`) fields:

- **address**: `string` - The address of the royalty recipient. May be Substrate SS-58 encoded or Ethereum address.
- **percent**: `number` - The percentage of the sale price that the recipient will receive. Valid values range is 0.00% - 99.99%.
- **isPrimaryOnly**: `boolean` - Indicates whether the royalty should be paid only on the primary sale or on primary and secondary sales. Default value is `false` which means that the royalty will be paid on both primary and secondary sales.

Example:

```json5:no-line-numbers
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

NFTs in Unique can contain other NFTs through a process known as nesting.
This is achieved by transferring one NFT to the address of another NFT (each NFT in Unique has its own address).
In this way, one NFT owns another, and transitively, the owner of the root NFT owns the entire tree.  
This allows the creation of an NFT tree where elements can customize each other.
The leaves can influence the nodes, and so on, up to the root.

**Unique provides this functionality through the `customizing` field**

This field contains the customization image details of the NFT itself and "slots" for customization, which can be utilized by nested NFTs.

For example, let's say we have an NFT "character" with customization slots like "hat" and "pet".  
We can nest an NFT of a hat and an NFT of a pet within the character NFT,
thereby modifying the base character image to show the character wearing a hat and accompanied by a pet.

All customizing NFT fields lay down inside the `customizing` field. This field consists of 4 subfields:

```typescript:no-line-numbers
interface IV2Customizing {
  self: IV2CustomizingFileInfo
  slots?: IV2CustomizingSlot[]
  mutators?: Record<string, IV2CustomizingMutatorReaction>
  mutator_reactions?: string[]
}
```

- The `self` field is used to store and describe this NFT's customization file and settings.
- The `slots` field is used to describe the customization slots available for nested NFTs.
- The `mutators` field is used to describe the mutators available for the NFT.
- The `mutator_reactions` field is used to describe how this NFT should react to descendant mutators.

##### self

The `self` field is used to describe the NFT's own customization file. It is separated from the main NFT image
because it may differ significantly. For example, the main NFT image might be a showcase or ad-like image, while
the actual overlaying image should be clear and well-suited for overlaying. Additionally, the `self` field contains
not only the link to the image but also the overlaying specifications, such as the order of overlaying, offsets,
and other relevant details.

###### IV2CustomizingFileInfo

```typescript:no-line-numbers
interface IV2CustomizingFileInfo {
  type: 'image' | 'animation' | 'video' | 'audio' | 'spatial' | 'pdf' | 'document' | 'other'
  url: string
  name?: string
  details?: IV2MediaDetails
  image_overlay_specs?: IV2CustomizingImageOverlaySpecs
  placeholder?: {
    url: string
    details?: IV2ImageDetails
  }
  tag?: string;
}
```

Types used: [IV2MediaDetails](#iv2mediadetails), [IV2ImageDetails](#iv2imagedetails) and IV2CustomizingImageOverlaySpecs:

###### IV2CustomizingImageOverlaySpecs

The type `IV2CustomizingImageOverlaySpecs` is used to define the overlay specifications for an image. This type includes the following fields:

_All fields are optional_

```typescript:no-line-numbers
type IV2CustomizingImageOverlaySpecs = {
  layer?: number
  order_in_layer?: number
  offset?: { x: number, y: number }
  opacity?: number
  rotation?: number
  scale?: { x: number, y: number, unit?: 'px' | '%' /* default - % */ }
  anchor_point?: { x: number, y: number }
  parent_anchor_point?: { x: number, y: number }
}
```

##### slots

The `slots` field is used to describe the customization slots available for nested NFTs.
Each slot is described by the `IV2CustomizingSlot` type.

```typescript:no-line-numbers
interface IV2CustomizingSlot {
  type: 'image' // now only 'image' type is supported
  collections?: Array<string | number>
  name?: string
  image_overlay_specs?: IV2CustomizingImageOverlaySpecs
}
```

`image_overlay_specs` has the type [IV2CustomizingImageOverlaySpecs](#iv2customizingimageoverlayspecs) which is the same as in the `self` field.

##### mutator_reactions

The `mutator_reactions` field is used to describe how this NFT should react to descendant mutators.
It is used when the image needs to be modified based on ancestor or descendant NFTs.
For example, the image's offset might change if an ancestor has a non-standard size,
or the image might be replaced by another if the descendant has a significant power-up.

This field is a dictionary where the key is the mutator name and the value is the reaction to it.

The key should meet the requirements of regular JSON key.

The value is the type `IV2CustomizingMutatorReaction` which is an extended type [IV2CustomizingImageOverlaySpecs](#iv2customizingimageoverlayspecs) with the `url` and `details` fields (alike the NFT first-level `media` field).

```typescript:no-line-numbers
interface IV2CustomizingMutatorReaction extends IV2CustomizingImageOverlaySpecs {
  url: string
  details?: IV2ImageDetails
}
```

##### mutators

Array of strings which are the names of mutators available for the NFT.

### Customizing Overrides

This field allows overriding the default customization options for the NFT.
It is rarely used and is typically reserved for specific cases where the main `customizing` field needs to be locked and set as readonly.

The difference from the `IV2Customizing` type is that the requirements for this field are much more flexible.

```typescript:no-line-numbers
interface IV2CustomizingOverrides {
  self?: Partial<IV2CustomizingFileInfo> & {tag?: string}
  slots?: Partial<IV2CustomizingSlot>[]
  mutators?: Record<string, Partial<IV2CustomizingMutatorReaction>>
  mutator_reactions?: string[]
}
```

### Optional fields

#### schemaName `string` - optional

Default value: `unique`.  
_Should be omitted when encoding tokens via Library `@unique-nft/schemas`._

The name of the schema used for the metadata. When creating new NFTs, this should be 'unique'. This property defines the specific set of rules and attributes that the NFT adheres to. For older NFTs, created before the implementation of the 'unique' schema. This ensures backward compatibility and helps in identifying the origin and structure of the metadata associated with the NFT.

#### schemaVersion: `string` - optional

Default value: `2.0.0`.  
_Should be omitted when encoding tokens via Library `@unique-nft/schemas`._

#### originalSchemaVersion: `string` - readonly

**Readonly field.  
Applicable only for old tokens (v0 an v1) in decoded format.**  
The original version of the schema. This property indicates the schema under which the NFT was initially created.

---

## NFT Collection Schema V2

Collection in Unique may contain such fields:

- **cover_image**: [IV2ImageWithDetailsAndThumbnail](#iv2imagewithdetailsandthumbnail) - Cover image for the collection

- **default_token_image**: [IV2ImageWithDetailsAndThumbnail](#iv2imagewithdetailsandthumbnail) - Default image for the tokens in the collection

- **potential_attributes**: Array of [IV2Attribute](#iv2attribute) - Potential attributes for the collection. An instruction for the NFT generator/creator which attributes can be used for the NFTs in this collection. Just a hint, not a requirement.

The structure of this field is similar to the NFT `attributes` field, with the key difference being that it does not include a `value` field. Instead, it has an optional `values` field, which is an array of potential values.

```typescript:no-line-numbers
type IV2PotentialAttributeValues = {
  trait_type: string
  display_type?: string
  values?: string[]
}
```

- **royalties**: Array of [IV2Royalty](#iv2royalty) - Royalties for the collection. The same as for the NFTs.

- **customizing**: Customization options for the collection. Defines the relationships between collections, specifying which NFTs can be customized by the NFTs in this collection.

```typescript:no-line-numbers
{
  slots?: IV2CustomizingSlot[]
  customizes?: Array<string | number>
}
```

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

_All fields are optional_

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

#### IV2MediaDetails

All fields from the [IV2ImageDetails](#iv2imagedetails) and additional fields: `duration`, `codecs`, `loop`.

_All fields are optional as well_

```typescript:no-line-numbers
type IV2MediaDetails = Partial<{
  name: string // name of the image (for captions, etc.)
  type: 'image' | 'animation' | 'video' | 'audio' | 'spatial' | 'pdf' | 'document' | 'other'  // type of the
  bytes: number // size of the image file in bytes
  format: string // format of the image file (e.g., PNG, JPEG)
  sha256: string // SHA-256 hash of the image file
  width: number // width of the image in pixels
  height: number // height of the image in pixels
  order: number // order of the image
  duration: number // duration in seconds
  codecs: string[] // codecs used in the media file
  loop: boolean // whether the media should loop
}>
```

#### IV2Media

```typescript:no-line-numbers
type IV2Media = {
  type: 'image' | 'animation' | 'video' | 'audio' | 'spatial' | 'pdf' | 'document' | 'other'
  url: string
  name?: string // name of the media (for captions, etc.)
  details?: IV2MediaDetails
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

#### IV2ImageWithDetailsAndThumbnail

```typescript:no-line-numbers
type IV2ImageWithDetailsAndThumbnail = {
  url: string
  details?: IV2ImageDetails
  thumbnail?: {
    url: string
    details?: IV2ImageDetails
  }
}
```

#### IV2Royalty

```typescript:no-line-numbers
type IV2Royalty = {
  address: string
  percent: number
  isPrimaryOnly?: boolean
}
```

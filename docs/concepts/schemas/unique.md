# Unique Schema 1.0.0

Unique schema defines how to store information about NFTs on chain. All the information is stored inside token properties and can be split into two groups:
- Attributes - all the metadata for NFT
- Media - defines where and how media is stored (image/audio/video urls)

To check chain properties you can use: ```rpc.unique.collectionProperties``` and ```rpc.unique.tokenProperties```

### Collection properties should have:
- attributesSchemaVersion - ```1.0.0``` is current latest version
- schemaName - ```unique```
- schemaVersion - ```1.0.0``` is current latest version
- attributes - added at the root of collection.properties as ```a.*index*```
- URL_TEMPLATE? - added at the root as ``` { key: image.urlTemplate } ```. Optional, since can be ignored for fullUrl media type.

We might update our schemas to change how some parts of them are defined or add new one. In that case we will update corresponding versions for schemas.

### Token properties should have:
- attributes? - only if described in collection.schema
- i.c - media url

More detailed information on types can be found [here](https://github.com/UniqueNetwork/ts_api/blob/master/src/schema/types.ts)

## Media
We use more complex way to store links to our NFTs compared to other such as ERC721. We achieve that by stroing all the data on chian inside tokens and by using strict URL defining rules. These rules define how to treat links to NFTs. Instead of only using plain url we provide more robust and flexible solutions:

Our schema is designed to support next ```media.type```'s:
- Image
- Video
- Audio

We provide 3 ways of setting up media:

### Infix
Url is predetermened for all tokens, but a part of it will be replaced with value from the token.

Very usefull to work with big collections. Name all images as "1.png", "2.png" etc. then place it somewhere and use ifnixes to dynamicly set urls for your media.

<details><summary>Infix url:</summary>
<CodeGroup>
<CodeGroupItem title="SDK">

Prerequisits: requires property "```media.type```.urlTemplate" to be prefilled in collection. The end of urlTemplate should contain ```{infix}``` that will be replaced by value provided in token properties.

**i.c** stands for "image cover". Image that should be used for display.

**h.c** stands for "video cover". Image that should be used as a preview for videos. This one is optional.


_Example of token image_:
collection
```
{ key: coverPicture.ipfsCid value: QmNiBHiAhsjBXj5cXShDUc5q1dX23CJYrqGGPBNjQCCSXQ } # image of collection
{ key: image.urlTemplate value: https://ipfs.uniquenetwork.dev/ipfs/{infix} } # template for token image
```
token
```
{ key: i.c value: QmUivANsMSGhPtdkEaJH5XMVwuXmYWsm6qrbsMgj8CzLJB }
```

_Example of token video with image preview_
collection
```
{ key: image.urlTemplate value: https://ipfs.unique.network/ipfs/{infix} }
{ key: video.urlTemplate value: https://bafybeib5lxymirwhmoj6ofppxealqh7eyw5bu7wmvk64mll5dvcqfzykwu.ipfs.nftstorage.link/videos/{infix}.mp4 }
```
token
```
{ key: i.c value: QmQrC7a1yiYLMHGABBBc4VxqCEpWe7Y8HWrfHLiZxLrQj5 }
{ key: v.i value: 22 }
```
</CodeGroupItem>
</CodeGroup>
</details>

### Url
Full url to be used as is. Provided in token properties and requires no prerequisites in collection.

Simpliest of solutions.
<details><summary>Plain url:</summary>
<CodeGroup>
<CodeGroupItem title="SDK">

_Example_:
```
image: { url: example.com }
```

Should be converted to: ```example.com```

</CodeGroupItem>
</CodeGroup>
</details>

### IpfsCid
If collection.urlTemplate is not provided - should be used with "ipfs://" from token.image["i.c"] ``` `ipfs://${token["i.c"]}` ```.

If provided - behaves exactly the same is infix, replacing {infix} inside collection.templateUrl

<details><summary>Ipfs cid:</summary>
<CodeGroup>
<CodeGroupItem title="SDK">
Prerequisite: collection should not have any image properties provided.
Just provide a Cid string to token.image.ipfsCid and it will be converted to full url.

_Example_:
```
image: {
  ipfsCid:  image.cid,
}
```

Shuold be converted to:
```
`ipfs://${token.image.ipfsCid}`
```
</CodeGroupItem>
</CodeGroup>
</details>

## Attributes
Attributes define some unique properties for each NFT. They should be defined on collection.schema and used on token[a.*index*] afterwards.

**Note that all "string" properties in tokens should have localization key provided at all times. For default use "_".**

### Schema
Schema defines which attributes can be stored on any token of the collection. Attributes in tokens that are not provided in collection.schema can't be used. Attributes should respect "optional" param from collection attribute as well as type - if condition not met NFT can't be created. 

<details><summary>Attributes schema definition:</summary>
<CodeGroup>
<CodeGroupItem title="SDK">
On chain schema for attributes _in collection_ is defined as ```
{ key: attributeSchema.*index*, 
  value: { 
    name: string, 
    optional: boolean, 
    isArray: boolean, 
    type: AttributeType, 
    enumValues?: {  [K: number]: LocalizedStringOrBoxedNumberWithDefault } 
  }
} ```

_name_ - attribute name. Note, that we reference attributes by index, not by name.
_optional_ - whether value is required in tokens or can be skipped
_isArray_ - defines whether can store multiple values
_type_ - which type can be stored, see supported types below
_enumValues_ - if provided, can't use values only from provided list

<details><summary>Supported attribute types:</summary>
<CodeGroup>
<CodeGroupItem title="SDK">
- integer
- float
- boolean
- timestamp
- string
- url
- isoDate
- time
- colorRgba
</CodeGroupItem>
</CodeGroup>
</details>

<details><summary>Attributes schema in collection example:</summary>
<CodeGroup>
<CodeGroupItem title="SDK">
```
[
  {
    key: attributesSchema.0
    value: {type:string,name:{_:a0_free_string_opt},optional:true,isArray:false}
  }
  {
    key: attributesSchema.1
    value: {type:string,name:{_:a1_free_string_req},optional:false,isArray:false}
  }
      {
      key: 'attributesSchema.2',
      value: '{"type":"string","name":{"_":"a2_select_opt"},"optional":true,"isArray":false,"enumValues":{"0":{"_":"1"},"1":{"_":"2"},"2":{"_":"3"},"3":{"_":"eng"},"4":{"_":"рус"},"5":{"_":"人 "}}}'
    }
    {
      key: 'attributesSchema.3',
      value: '{"type":"string","name":{"_":"a3_select_example"},"optional":false,"isArray":false,"enumValues":{"0":{"_":"a3_example_0"},"1":{"_":"a3_example_1"},"2":{"_":"a3_example_2"},"3":{"_":"a3_example_3"},"4":{"_":"a3_example_4"}}}'
    }
    {
      key: 'attributesSchema.4',
      value: '{"type":"string","name":{"_":"a4_multiselect_opt"},"optional":true,"isArray":true,"enumValues":{"0":{"_":"a4_example_0"},"1":{"_":"a4_example_1"},"2":{"_":"a4_example_2"},"3":{"_":"a4_example_3"},"4":{"_":"a4_example_4"}}}'
    }
  {
    key: attributesSchemaVersion
    value: 1.0.0
  }
  {
    key: schemaName
    value: unique
  }
  {
    key: schemaVersion
    value: 1.0.0
  }
]
```
</CodeGroupItem>
</CodeGroup>
</details>

On chain schema for attributes _in token_ is defined as ```
{ key: a.*index*, 
  value: "value based on collection.attributeSchema.*index*"
} ```

<details><summary>Attributes usage in NFT example:</summary>
<CodeGroup>
<CodeGroupItem title="SDK">
```
[
  {
    key: a.0
    value: {_:a0_free_string_opt}
  }
  {
    key: a.1
    value: {_:a1_free_string_req}
  }
  {
    key: a.2
    value: 0
  }
  {
    key: a.3
    value: 3
  }
  {
    key: a.4
    value: [3,4]
  }
  {
    key: a.5
    value: [3,4]
  }
  {
    key: a.6
    value: {_:a6_check}
  }
  {
    key: i.c
    value: QmUivANsMSGhPtdkEaJH5XMVwuXmYWsm6qrbsMgj8CzLJB
  }
]
```
</CodeGroupItem>
</CodeGroup>
</details>

</CodeGroupItem>
</CodeGroup>
</details>

___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________
___________________________________________________

___________________________________________________
___________________________________________________
Extra notes that I incorrectly started. May be usefull for other parts of documentation

# Unique schema

All NFTs on Unique Network have flixble properties that can be set in any way with ltitle to none exceptions. In order to bring some standartisation over most popular NFT use-cases we created a standard called "Unique schema" that covers how should properties of image/video/audio NFTs look like. It is adviced to be used on any type of project/idea you are working on to ensure compitability with our and community projects.

The main goals of unique schema:
1. Flexibility. Should cover as many use-cases as possible by default
2. Versioning - we should be able to adjust it overtime without breaking the old ones
3. To be as user-friendly as possible
4. Aim on it on all of our products

## Who is it for
First of all - Unique Schema is integrated into SDK and our products (wallet/scan/market) by default. If NFT token doesn't follow Unique Schema - it is not expected to be properly shown on any of our products. If, for example, you are using our wallet to create NFTs it already follows the Unique Schema therefore can be observed on scan, wallet and potentially sold on a market.

It is adviced to follow this schema for any situation, unless very specific exception prevents from doing so.

## How to use
The best way to use it is SDK. Internally schema is not intuitive. SDK helps translate it into human-readable form as well as translate human-readable form into proper data for blockchain.

SDK uses both - data from collection and token to build human-readable and convinient format to work with:
<details><summary>Unique scheme SDK parsed example</summary>
<CodeGroup>
<CodeGroupItem title="SDK">

```typescript
{
  owner: '5GbjEGWbTFV7f2XN6z7TBUyW4YidWTHmaw1ekNFCtWGuEmTT',
  tokenId: 4,
  collectionId: 883,
  attributes: {
    '0': {
      name: { _: 'Artist' },
      value: { _: 'AmazingDevya' },
      isArray: false,
      type: 'string',
      rawValue: { _: 'AmazingDevya' },
      isEnum: false
    },
    '1': {
      name: { _: 'Title' },
      value: { _: 'Cut Trees Polar Bear Sad' },
      isArray: false,
      type: 'string',
      rawValue: { _: 'Cut Trees Polar Bear Sad' },
      isEnum: false
    },
    '2': {
      name: { _: 'GloCha Registry number' },
      value: { _: '0004DA4C2022' },
      isArray: false,
      type: 'string',
      rawValue: { _: '0004DA4C2022' },
      isEnum: false
    }
  },
  image: {
    ipfsCid: 'QmZ6RyXcXhAF42BKGm1VvRgRhHSRuYfXphgHN9ktYciduf',
    fullUrl: 'https://ipfs.unique.network/ipfs/QmZ6RyXcXhAF42BKGm1VvRgRhHSRuYfXphgHN9ktYciduf'
  }
}
```
</CodeGroupItem>
</CodeGroup>
</details>

Schema on chain is more complicated. It consist of two parts - collectionProperties and tokenProperties

<details><summary>Unique scheme of a collection on chain example</summary>
<CodeGroup>
<CodeGroupItem title="SDK">

```typescript
[
  {
    key: attributesSchema.0
    value: {type:string,name:{_:Artist},isArray:false,optional:false}
  }
  {
    key: attributesSchema.1
    value: {type:string,name:{_:Title},isArray:false,optional:false}
  }
  {
    key: attributesSchema.2
    value: {type:string,name:{_:GloCha Registry number},isArray:false,optional:false}
  }
  {
    key: attributesSchemaVersion
    value: 1.0.0
  }
  {
    key: coverPicture.ipfsCid
    value: QmfPYQHHZtADPAP5nC7cFZmvFwYZCyuVpT7GUjFTxuWyxa
  }
  {
    key: image.urlTemplate
    value: https://ipfs.unique.network/ipfs/{infix}
  }
  {
    key: schemaName
    value: unique
  }
  {
    key: schemaVersion
    value: 1.0.0
  }
  {
    key: video.urlTemplate
    value: https://ipfs.unique.network/ipfs/{infix}
  }
]
```
</CodeGroupItem>
</CodeGroup>
</details>

<details><summary>Unique scheme of a token on chain example</summary>
<CodeGroup>
<CodeGroupItem title="SDK">

```typescript
[
  {
    key: a.0
    value: {_:AmazingDevya}
  }
  {
    key: a.1
    value: {_:Cut Trees Polar Bear Sad}
  }
  {
    key: a.2
    value: {_:0004DA4C2022}
  }
  {
    key: i.c
    value: QmZ6RyXcXhAF42BKGm1VvRgRhHSRuYfXphgHN9ktYciduf
  }
]
```
</CodeGroupItem>
</CodeGroup>
</details>

## Details on schema sctructure
This description is related to SDK structure.

### Unique attribute schema consist of:
- mode (optional)
Optional parameter. Defines whether collection will contain NFT, Fungible or RFT 
- decimals (optional)
Used for Fungibles
- name
Collection Name
- description
Collection description
- tokenPrefix
Collection prefix. Usually used to provide names for tokens as `${collection.tokenPrefix} #${token.tokenId}`


## SDK
Work with Unique schema is integrated on SDK by default and very easy to use. Here is an example on how to create a collection and token using "@unique-nft/substrate-client"

<details><summary>Unique scheme of a token on chain example</summary>
<CodeGroup>
<CodeGroupItem title="SDK">

</CodeGroupItem>
</CodeGroup>
</details>

## Misc
We have been using other schemas in the past. They were migrated to _old_schema and are parsed by SDK into new schema format. 
// TODO: add a link on parser to convert from old schemas to new ones

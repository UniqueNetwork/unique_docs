# Unique Schema 1.0.0

The Unique schema defines how to store information about NFTs on the chain. All the information is stored inside token properties and can be split into two groups:
- Attributes - all the metadata for NFT
- Media - defines where and how media is stored (image/audio/video urls)

To check chain properties you can use: ```rpc.unique.collectionProperties``` and ```rpc.unique.tokenProperties```

### Collection properties should have:
- attributesSchemaVersion - ```1.0.0``` is current latest version
- schemaName - ```unique```
- schemaVersion - ```1.0.0``` is current latest version
- attributes - added at the root of collection.properties as ```a.*index*```
- URL_TEMPLATE? - added at the root as ``` { key: image.urlTemplate } ```. Optional, since can be ignored for fullUrl media type.

We might update our schemas to change how some parts of them are defined or add a new one. In that case, we will update corresponding versions for schemas.

### Token properties should have:
- attributes? - only if described in collection.schema
- i.c - media url

More detailed information on types can be found [here](https://github.com/UniqueNetwork/ts_api/blob/master/src/schema/types.ts)

## Media
We use a more complex way to store links to our NFTs compared to others such as ERC721. We achieve that by storing all the data on the chain inside tokens and by using strict URL defining rules. These rules define how to treat links to NFTs. Instead of only using plain url we provide more robust and flexible solutions:

Our schema is designed to support the following  ```media.type```'s:
- Image
- Video
- Audio

We provide 3 ways of setting up media:

### Infix
Url is predetermined for all tokens, but a part of it will be replaced with the token value.

Very useful to work with big collections. Name all images as "1.png", "2.png" etc. then place them somewhere and use infixes to dynamically set urls for your media.

<Details>
<template v-slot:header>Infix url</template>
<template v-slot:body>

Prerequisites: requires property "```media.type```.urlTemplate" to be prefilled in collection. The end of urlTemplate should contain ```{infix}``` that will be replaced by the value provided in token properties.

**i.c** stands for "image cover". An image that should be used for display.

**h.c** stands for "video cover". An image that should be used as a preview for videos. This one is optional.

_Example of token image_:
collection
```typescript
{ key: coverPicture.ipfsCid value: QmNiBHiAhsjBXj5cXShDUc5q1dX23CJYrqGGPBNjQCCSXQ } # image of collection
{ key: image.urlTemplate value: https://ipfs.unique.network/ipfs/{infix} } # template for token image
```
token
```typescript
{ key: i.c value: QmUivANsMSGhPtdkEaJH5XMVwuXmYWsm6qrbsMgj8CzLJB }
```

_Example of token video with image preview_
collection
```typescript
{ key: image.urlTemplate value: https://ipfs.unique.network/ipfs/{infix} }
{ key: video.urlTemplate value: https://bafybeib5lxymirwhmoj6ofppxealqh7eyw5bu7wmvk64mll5dvcqfzykwu.ipfs.nftstorage.link/videos/{infix}.mp4 }
```
token
```typescript
{ key: i.c value: QmQrC7a1yiYLMHGABBBc4VxqCEpWe7Y8HWrfHLiZxLrQj5 }
{ key: v.i value: 22 }
```

</template>
</Details>

### Url
Full url to be used as is. Provided in token properties and requires no prerequisites in the collection.

Simplest of solutions.

<Details>
<template v-slot:header>Plain url</template><template v-slot:body>

_Example_:

```typescript
image: { url: example.com }
```

Should be converted to: ```example.com```

</template>
</Details>

### IpfsCid
If collection.urlTemplate is not provided - should be used with "ipfs://" from token.image["i.c"] ``` `ipfs://${token["i.c"]}` ```.

If provided - behaves exactly the same is infix, replacing {infix} inside collection.templateUrl

<Details>
<template v-slot:header>Ipfs cid</template>
<template v-slot:body>

Prerequisite: collection should not have any image properties provided.
Just provide a Cid string to token.image.ipfsCid and it will be converted to full url.

_Example_:
```typescript
image: {
  ipfsCid:  image.cid,
}
```

Should be converted to:
```typescript
`ipfs://${token.image.ipfsCid}`
```
</template>
</Details>

## Attributes
Attributes define some unique properties for each NFT. They should be defined on collection.schema and used on token[a.*index*] afterward.

**Note that all "string" properties in tokens should have a localization key provided at all times. For default use "_".**

### Schema
The schema defines which attributes can be stored on any token of the collection. Attributes in tokens that are not provided in collection.schema can't be used. Attributes should respect "optional" param from collection attribute as well as type - if condition not met NFT can't be created. 

<Details>
<template v-slot:header>Attributes schema definition</template>
<template v-slot:body>

On chain schema for attributes _in collection_ is defined as 

```typescript
{ key: attributeSchema.*index*, 
  value: { 
    name: string, 
    optional: boolean, 
    isArray: boolean, 
    type: AttributeType, 
    enumValues?: {  [K: number]: LocalizedStringOrBoxedNumberWithDefault } 
  }
} 
```

_name_ - attribute name. Note, that we reference attributes by index, not by name.

_optional_ - whether value is required in tokens or can be skipped.

_isArray_ - defines whether you can store multiple values.

_type_ - which type can be stored, see supported types below.

_enumValues_ - if provided, can't use values only from provided list.

<Details>
<template v-slot:header>Supported attribute types</template>
<template v-slot:body>

```typescript
- integer
- float
- boolean
- timestamp
- string
- url
- isoDate
- time
- colorRgba
```

</template>
</Details>

<Details>
<template v-slot:header>Attributes schema in collection example</template>
<template v-slot:body>

```typescript
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

On chain schema for attributes _in token_ is defined as ```
{ key: a.*index*, 
  value: "value based on collection.attributeSchema.*index*"
} ```

</template>
</Details>

<Details>
<template v-slot:header>Attributes usage in NFT example</template><template v-slot:body>

```typescript
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

</template>
</Details>

</template>
</Details>

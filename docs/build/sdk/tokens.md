# Working with tokens
<!-- TODO review this page -->
## Intro 

NFT means non-fungible token, and non-fungible means that this token is unique and can’t be replaced.

NFTs can be everything. They can be a jpg image, music, or digital art. You can be an artist, create a 3 minute short YouTube video by adding your images and music.  
Cool! Now, you can sell this video as an NFT at an excellent price if it brings value to the rest of the community. 
It’s just like getting paintings at an art gallery but much easier and more convenient.

In Unique Network, the token has the following entities:

`address`- the address of the collection owner.

`collectionId` - the collection id which token belongs to. 

`owner` - the address of token owner.

`data` - the content of the token is stored in the fields of the object:

- `name` - the token name;
- `description` - the token description;
- `image` - the token image (url, url infix or IPFS cid);
- `imagePreview` - the small image for preview;
- `video` - the link to a video file;
- `audio` - the link to an audio file;

`token properties` - the properties set for the specific token that can be modified.  

## Prerequisites 

We'll need a Substrate address to go through this tutorial. If you do not have it yet,   
please check [working with accounts](./accounts.md).

To be able to mint a token, you must have an existing collection. Just in case, we will 
demonstrate the simple way in the [Mint token](#mint-token) section.
To learn more on how to work the collections,  
please refer to the [How to work with collections](./collections.md) section. 

And, since some Opal tokens are required to pay for the transaction fees as well, please make sure
 that your balance has some tokens. 
These can be obtained via the [Telegram faucet bot](https://t.me/unique2faucet_opal_bot).

We will use SDK and some other packages in this section. To learn how to install SDK,  
please refer to [getting started](./getting-started.md).


## Mint token

When creating (minting) a new token, we need to call the `token.create` method from our SDK. 
The arguments that we need to specify are the token owner address, the collection id 
where the token will be created, and a couple of data for token itself (like image, name 
and short description).  

That is enough in general case. Please take a look at the example below - 
this is the full sample code that creates a new collection and a new token in it. 

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
import Sdk, {CHAIN_CONFIG} from '@unique-nft/sdk'
import {KeyringProvider} from '@unique-nft/accounts/keyring'

async function main() {
  const account = await KeyringProvider.fromMnemonic(
    'bonus rubber price teach teach teach teach century scorpion require require require'
  )
  const address = account.address

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.opal.restUrl, 
    signer: account,
  })

  ////////////////////////////////////
  // Create collection - quick simple way 
  ////////////////////////////////////
  const {parsed, error} = await sdk.collection.create.submitWaitResult({
    address,
    name: 'Test collection',
    description: 'My test collection',
    tokenPrefix: 'TST',
  })

  if (error) {
    console.log('create collection error', error)
    process.exit()
  }
  const collectionId = parsed?.collectionId as number
  console.log(`Collection created. Id: ${collectionId}`)
  console.log(`View this minted collection at https://uniquescan.io/opal/collections/${collectionId}`)

  ////////////////////////////////////
  // Mint token
  ////////////////////////////////////
  const result = await sdk.token.create.submitWaitResult({
    address,
    collectionId,
    data: {
      image: {
        ipfsCid: 'QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png',
      },
      name: {
        _: 'My token',
      },
      description: {
        _: 'Sample token',
      },
    },
  })

  const tokenId = result.parsed?.tokenId as number

  console.log(`Minted token ID ${tokenId} of 1 in collection ID ${collectionId}`)
  console.log(`View this minted token at https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`)
}

main().catch((error) => {
  console.error(error)
})
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'POST' \
  'http://rest.unique.network/opal/token?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5FHneW46xGXgs5mUiveU4sbTaaazmstUspZC92UhjJM694ty",
    "collectionId": 100,
    "data": {
      "image": {
        "ipfsCid": "QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
      },
      "name": {
        "_": "My token"
      },
      "description": {
        "_": "Sample token"
      }
    }
  }'

# then we sign and call

curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'
```

</CodeGroupItem>
</CodeGroup>

## Bulk mint 

If you need to mint several tokens in one transaction, this is possible in Unique Network. For this, 
you need to call the `token.createMultiple` method. It is quite similar to the common mint operation,
but you need to pass the array of token properties to this method. Each item of this array is the same 
as data for the common minting.

> There is a limitation on tokens minted at once exist. For detailed information, please refer to the [Limitations page](../../about/limitations/limitations.md)

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
async function main() { 
   
   ... 

  const result = await sdk.token.createMultiple.submitWaitResult({
    address,
    collectionId,
    tokens: [ // array of tokens 
      { // 1st token
        data: {
          name: {
            _: 'My token',
          },
          image: {
            ipfsCid: 'QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png',
          },
        },
      },
      { // 2nd token 
        data: {
          description: {
            _: 'Token for testing',
          },
          image: {
            ipfsCid: 'QmZ8Syn28bEhZJKYeZCxUTM5Ut74ccKKDbQCqk5AuYsEnp/image1.png',
          },
        },
      },
    ],
  })

  const mintedTokensCount = result.parsed?.length

  let currentTokenId;
  result.parsed?.forEach((token, index) => {
    currentTokenId = token?.tokenId as number
    console.log(`Minted token ID #${currentTokenId}/${mintedTokensCount} in collection ${collectionId}`)
    console.log(`View this minted token at https://uniquescan.io/opal/tokens/${collectionId}/${currentTokenId}`)
  });
}
```
</CodeGroupItem>

<CodeGroupItem title ="REST">

```sh:no-line-numbers
curl -X 'POST' \
  'http://rest.unique.network/opal/token/create-multiple?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "5FHneW46xGXgs5mUiveU4sbaaaBzmstUspZC92UhjJM694ty",
  "collectionId": 100,
  "tokens": [
    {
      "data": {
        "name": {
            "_": "My token",
          },
        "image": {
          "ipfsCid": "QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image2.png"
        }
      }
    },
    {
      "data": {
        "image": {
          "ipfsCid": "QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image2.png"
        }
      }
    }
  ]
}'

  # then we sign and call

  curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'
```

</CodeGroupItem>
</CodeGroup>

## Set token properties 

In Unique Network, there is a possibility to set some properties to a token. The set of such properties 
could be completely custom. This means that you can name properties as needed, and also any values can be assigned to them. 

:warning: Before setting properties, we have to set permissions so this operation become possible. If this was not configured
in the collection during its creation, there are no permissions to set token properties even for token owner. 

The permissions to create and modify properties of a collection are defined using three keys -  
`mutable`, `collectionAdmin` and `tokenOwner`.  

The `mutable` attribute sets the immutability.  
The `collectionAdmin` attribute grants the collection administrator and the collection owner the 'write/modify' access.  
The `tokenOwner` attribute grants the token owner the 'write/modify' access. 

When the permissions are set for the collection, we can set the properties values. For this, we will call  
the `token.setProperties` method and pass the address from which behalf the operation is performed (the collection owner,
collection admin or token owner), the collection id and the token id, and  
the properties array.  
The array consists of the 'key-value' pairs. In the example below, we set one property, 
but you can make this for several properties in one operation. 

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
async function main() {
  ...
  // set permissions 
  const txSetPermissions = await sdk.collection.setPropertyPermissions.submitWaitResult({
    address,
    collectionId,
    propertyPermissions: [
      {
        key: 'foo',
        permission: {
          mutable: true,
          collectionAdmin: true,
          tokenOwner: true,
        },
      },
    ],
  })

  // set properties values 
  const txSetProps = await sdk.token.setProperties.submitWaitResult({
    address,
    collectionId,
    tokenId,
    properties: [
      {
        key: 'foo',
        value: 'bar',
      },
    ],
  })

  const properties = txSetProps.parsed?.properties

  if (properties?.length)
    console.log(`The values of the [ ${properties.map((t) => t.propertyKey).join()} ] keys are set`)
}
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
# set token properties permissions 
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/collections/property-permissions?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
    "collectionId": 1,
    "propertyPermissions": [
      {
        "key": "foo",
        "permission": {
          "mutable": true,
          "collectionAdmin": true,
          "tokenOwner": true
        }
      }
    ]
  }'
    
# sign 
    
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'

# set the properties values 

curl -X 'POST' \
  'https://rest.unique.network/opal/v1/token/properties?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
    "collectionId": 1,
    "tokenId": 1,
    "properties": [
      {
        "key": "foo",
        "value": "bar"
      }
    ]
  }'
    
# sign
    
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'
```

</CodeGroupItem>
</CodeGroup>

## Get token properties 

If a token has properties, then we can get them as the array of of the 'key-value' pairs. 
For this, we can just call the `token.properties` method and pass the collection id and token id to it.

The method will return an empty array if the specified token does not have any properties. 

In the example below, we will get all properties and print their keys and values to the console. 

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
async function main() {
  ...
  const {properties} = await sdk.token.properties({
    collectionId,
    tokenId,
  })

  if (properties?.length)
    properties.forEach((prop) => {
      console.log(`The value of the key ${prop.key} is ${prop.value}`)
    })
}
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'GET' \
  'https://rest.unique.network/opal/v1/token/properties?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```

</CodeGroupItem>
</CodeGroup>

## Delete token properties

If a token has properties, then we can remove them at some point if needed. 
For this, we can just call the `token.deleteProperties` method, pass the collection id, token id to it and 
specify the array of the properties **keys** that should be deleted. So, you should not specify the properties values. 

The method will return an empty array if the specified token does not have any properties.

In the example below, we will remove only one property that we have.

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
async function main() {
  ...
  const txDeleteProps = await sdk.token.deleteProperties.submitWaitResult({
    address,
    collectionId,
    tokenId,
    propertyKeys: ['foo'],
  })
  const parsedDeleted = txDeleteProps.parsed

  console.log(`Removed properties:  ${parsedDeleted?.properties.map((t) => t.propertyKey).join()}`)
} 
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'DELETE' \
  'http://rest.unique.network/opal/token/properties?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX",
    "collectionId": 1,
    "tokenId": 1,
    "propertyKeys": ['\''foo'\'', '\''bar'\'']
  }'

  # then we and call
  
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'
```

</CodeGroupItem>
</CodeGroup>

## Get token

It is possible to get all details about the token in one transaction. For this, we can call for the `token.get` method. 
The method returns the object that contains all data - token id, owner, name, description, image, audio, video, properties.  

Then, we can process this data as needed. Please refer to the sample below. 

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
async function main() {
  ... 
  const txGetToken = await sdk.token.get({
    collectionId: 100,
    tokenId: 1,
  })

  console.log(`Token # ${txGetToken.tokenId} is owned by this address: ${txGetToken.owner}`)
}
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'GET' \
  'https://rest.unique.network/opal/v1/token?collectionId=2&tokenId=1' \
  -H 'accept: application/json'
```

</CodeGroupItem>
</CodeGroup>

## Transfer token

If we need to transfer a token (change the owner in fact), we can call the `token.transfer` method.  
To make this operation work, we need to specify the token id and the collection id which token  
belongs to. 
Also, we need to specify the addresses of current token owner and the new token owner.  
The `address` argument is the address that signs the transaction. 

In general case, the signer (who calls the operation) doesn't have to be the token owner. To specify from which address
the token will be transfer, we can use the optional `from` argument. 
But in this case, the owner should set allowance for the signer to transfer tokens. 
 
:exclamation: By default, you may not use the `from` argument. In this case, the token owner address will be considered the same as 
the signer address.  

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
async function main() {
  ... 
  const txTransfer = await sdk.token.transfer.submitWaitResult({
    collectionId,
    tokenId,
    address,
    to: '5GxLzgmFpb4PZNJPvLWSp87BhpnxhUJrtSrcQVskkZWfPNWa',
    from: '5DZpZ1cmcJ5s8TLNWucrn81bnbp2wjWBL9PM5aLZQX3vPd6U', // optional 
  })

  const parsedTransfer = txTransfer.parsed

  console.log(`${parsedTransfer?.to} is the new owner of token ${parsedTransfer?.tokenId} 
    from collection ${parsedTransfer?.collectionId}`)
}
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers

curl -X 'PATCH' \
  'http://rest.unique.network/opal/token/transfer?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collectionId": 100,
    "tokenId": 1,
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "to": "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw"
  }'
  
  # then we sign and call
  
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'
```

</CodeGroupItem>
</CodeGroup>

## Burn token

If we need to destroy (or burn) a token, we can call the `token.burn` method. To make this operation work,
we need to specify the token id and the collection id which token belongs to. The `address` argument is the address that signs the transaction. 

:exclamation: The method has the optional `from` argument. The argument defines on whose behalf the token is destroyed.
If the `from` parameter is not specified, 
then the token is destroyed on behalf of the owner of the item. However, you may not use this argument, since
anyone of the collection owner, the collection admin, or current NFT owner has permission to call this method. 

<CodeGroup>
<CodeGroupItem title = "SDK">

```ts:no-line-numbers
async function main() {
  ...
  const txBurn = await sdk.token.burn.submitWaitResult({
    collectionId: 101,
    tokenId: 1,
    address, 
    // from: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
  })

  console.log(`Token ${txBurn.parsed?.tokenId} was burned in collection ${txBurn.parsed?.collectionId}`)
}
```

</CodeGroupItem>

<CodeGroupItem title ="REST">

```bash:no-line-numbers
curl -X 'DELETE' \
  'http://rest.unique.network/opal/token?use=Build&withFee=false&verify=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "collectionId": 101,
    "tokenId": 1,
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }'
  
  # then we sign and call
  
curl -X 'POST' \
  'https://rest.unique.network/opal/v1/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadJSON": { *from previous response* },
    "signature": "0x_your_signature_in_hex"
  }'
```

</CodeGroupItem>
</CodeGroup>

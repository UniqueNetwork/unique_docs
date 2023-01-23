# Live NFT

Life NFT is a token whose property values can be changed by some event, not just manually.
The example below shows how to create a life nft.

<CodeGroup>
<CodeGroupItem title="SDK">

```ts
import {Sdk} from '@unique-nft/sdk'
import {KeyringProvider} from '@unique-nft/accounts/keyring'
import {AttributeType, COLLECTION_SCHEMA_NAME, SchemaTools, UniqueCollectionSchemaToCreate} from '@unique-nft/schemas'

const SDK_BASE_URL = 'https://rest.unique.network/opal/v1'
const MNEMONIC = 'electic suit...'

const sdk = new Sdk({baseUrl: SDK_BASE_URL})

const main = async () => {
  const account = await KeyringProvider.fromMnemonic(MNEMONIC)

  ////////////////////////////////////////
  // Creating collection in Unique schema
  // Part 1: creating the schema
  ////////////////////////////////////////

  const collectionSchema: UniqueCollectionSchemaToCreate = {
    schemaName: COLLECTION_SCHEMA_NAME.unique,
    schemaVersion: '1.0.0',
    image: {urlTemplate: 'https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{infix}.png'},
    coverPicture: {urlInfix: '1'},
    // important:
    // attributes are virtual thing which exists only in the Unique schema
    // it can be encoded and decoded and read only with collection schema encoded in Unique format
    // it's like traits in cryptopunks
    // actually every attribute is stored as token's property
    // and token property is a real on-chain record with access controlled by blockchain
    // so, the attribute - is just a value stored in property
    attributesSchemaVersion: '1.0.0',
    attributesSchema: {
      0: {
        name: {_: "colour"},
        type: AttributeType.string,
        optional: false,
        isArray: false,
        enumValues: {
          0: {_: 'red'},
          1: {_: 'green'},
          2: {_: 'blue'},
        }
      },
      1: {
        name: {_: 'this attr is some free form string'},
        type: AttributeType.string,
        optional: true,
        isArray: false,
      }
    }
  }

  ////////////////////////////////////////
  // Creating collection in Unique schema
  // Part 2: creating the collection
  ////////////////////////////////////////

  const collectionResult = await sdk.collections.creation.submitWaitResult({
    address: account.getAddress(),
    name: 'Test collection',
    description: 'Test collection description',
    tokenPrefix: "TEST",
    schema: collectionSchema as any, // temporary typing mismatch
    tokenPropertyPermissions: [
      // we need manually set token property permissions
      // because by default it's set with mutable: false flag
      {
        key: 'a.0', // 'a.0' corresponds to the attribute from 'schema.attributesSchema.0'
        permission: {
          tokenOwner: true,
          collectionAdmin: true,
          mutable: true,
        },
      },
      {
        key: 'a.1', // 'a.0' corresponds to the attribute from 'schema.attributesSchema.1'
        permission: {
          tokenOwner: true,
          collectionAdmin: true,
          mutable: true,
        },
      },
    ]
  }, {
    signer: account
  })
  const {collectionId} = collectionResult.parsed!
  console.log(collectionId)

  ////////////////////////////////////////
  // Minting a token
  ////////////////////////////////////////

  const tokenProperties = SchemaTools.encodeUnique.token({
    image: {
      urlInfix: '1',
    },
    encodedAttributes: {
      0: 0, // red by default
      1: {_: 'test value'},
    }
  }, collectionSchema)

  const tokenMintResult = await sdk.tokens.create.submitWaitResult({
    address: account.getAddress(),
    collectionId,
    properties: tokenProperties,
  }, {
    signer: account
  })

  console.log(tokenMintResult)
  const tokenId = tokenMintResult.parsed!.tokenId

  ////////////////////////////////////////
  // Getting the token from the chain
  // the colour attr value should be 'red'
  ////////////////////////////////////////

  const token = await sdk.tokens.get({
    collectionId,
    tokenId,
  })
  console.dir(token, {depth: 100})
  
  const color = token.attributes[0].value._
  if (color !== 'red') {
    throw new Error(`token color should be red, got ${color}`)
  }

  ////////////////////////////////////////
  // Changing the token property
  ////////////////////////////////////////

  const tokenChangeResult = await sdk.tokens.setProperties.submitWaitResult({
    address: account.getAddress(),
    collectionId,
    tokenId,
    properties: [{
      key: 'a.0',
      value: '2',
    }]
  }, {
    signer: account
  })

  /////////////////////////////////////////
  // Getting the token from the chain
  // the colour attr value should be 'blue'
  /////////////////////////////////////////

  const tokenAfterChange = await sdk.tokens.get({
    collectionId,
    tokenId,
  })
  console.dir(tokenAfterChange, {depth: 100})

  const colorAfterChange = tokenAfterChange.attributes[0].value._
  if (colorAfterChange !== 'blue') {
    throw new Error(`token color should be blue, got ${colorAfterChange}`)
  }

}

main().catch(err => console.error(err))
```

</CodeGroupItem>
</CodeGroup>
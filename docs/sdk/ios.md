# iOS UniqueSDK


## Overview

iOS UniqueSDK allows you to use  all the features provided by our SDK when developing an iOS app: you can build NFT applications from scratch or connect your existing apps that work on other blockchains to the Unique Network.

## How to install iOS UniqueSDK

#### CocoaPod

Put this in your `Podfile`:

```Ruby
pod 'UniqueSDK'
```

#### Swift Package Manager

To install iOS UniqueSDK package into your packages, add a reference to UniqueSDK and a targeting release version in the dependencies section in `Package.swift` file:

```Swift
.package(url: "https://github.com/UniqueNetwork/unique-sdk-swift.git", from: "0.0.5")
```

#### Xcode

To install iOS UniqueSDK package via Xcode you should follow next steps:

* Open the Project -> Package Dependencies -> Press Plus Button
* Search for https://github.com/UniqueNetwork/unique-sdk-swift.git
* Choose the version you need to install

## Usage Examples

Here are some basic examples of how to use the iOS UniqueSDK when working with blockchain. You can see more examples of methods in the [methods section](./methods.md).

### Chain configuration

First of all, you must set up the preferred network configuration and save the user password for  submiting transactions


```Swift
Unique.setConfiguration(.opal)
//or use custom configuration
Unique.setConfiguration(.custom("https://..."))
Unique.savePasscode("1234")
```

### Creation of a user account

This code sample shows how to create a user account.

```Swift
let account = UNQAccount(name: "AccountName", address: "AccountAddress", mnemonic: "AccountMnemoic")
Unique.Account.addAccount(account)
```

### Creation of a collection

This code sample shows how to create a new collection. You can read more about the method arguments in [create collection method description](./methods.md#collection).

```Swift
guard let account = Unique.Account.loadAccounts().first else { return }
let buildParameters = UNQRequestParameters(withFee: nil, verify: nil, callbackUrl: nil, nonce: nil)
let body = UNQCreateColletionBody(mode: .nft,
                                  name: "Name",
                                  description: "Description",
                                  tokenPrefix: "TokenPrefix",
                                  sponsorship: nil,
                                  limits: nil,
                                  metaUpdatePermission: nil,
                                  permissions: nil,
                                  readOnly: false,
                                  address: "Address",
                                  schema: nil,
                                  properties: nil,
                                  tokenPropertyPermissions: nil)
Task {
    do {
        let result = try await Unique.Collection.creation.submitWatch(parameters: buildParameters,
                                                                      body: body,
                                                                      account: account,
                                                                      userAuthenticationType: .biometric)
    } catch (let error) {
        print(error)
    }
}    
```

### Creation of a token

This code sample shows how to create a new token. You can read more about the method arguments in [create token method description](./methods.md#token).


```Swift
guard let account = Unique.Account.loadAccounts().first else { return }
let buildParameters = UNQRequestParameters(withFee: nil, verify: nil, callbackUrl: nil, nonce: nil)
let body = UNQCreateTokenBody(owner: "OwnerAddress", data: nil, properties: nil, address: "Address", collectionId: 0)
Task {
    do {
        let result = try await Unique.Token.create.submitWatch(parameters: buildParameters,
                                                               body: body,
                                                               account: account,
                                                               userAuthenticationType: .biometric)        
    } catch (let error) {
        print(error)
    }
}
```

### Creation of a  collection with attributes

This code sample shows how to create a new collection with specific attributes. You can read more about the method arguments in [create collection method description](./methods.md#collection).

```Swift
guard let account = Unique.Account.loadAccounts().first else { return }
let buildParameters = UNQRequestParameters(withFee: nil, verify: nil, callbackUrl: nil, nonce: nil)
let jsonAny1 = JSONAny(value: ["_": "Male"])
let jsonAny2 = JSONAny(value: ["_": "Female"])
let enumValues: [String: JSONAny] = [
    "0": jsonAny1,
    "1": jsonAny2
]
let atr = UNQAttributeSchema(name: ["_": "gender"],
                             optional: nil,
                             type: "string",
                             enumValues: enumValues,
                             isArray: nil)
let attributesSchema: [String: UNQAttributeSchema] = ["0": atr]
let schema = UNQCollectionSchemaToCreate(
    attributesSchema: attributesSchema,
    attributesSchemaVersion: "1",
    coverPicture: UNQCoverPicture(urlInfix: "", url: nil, ipfcCid: nil, hash: ""),
    image: UNQCollectionSchemaImage(urlTemplate: "https://ipfs.unique.network/ipfs/{infix}.ext"),
    schemaName: UNQSchemaName.unique,
    schemaVersion: "1.0.0",
    coverPicturePreview: nil,
    imagePreview: nil,
    audio: nil,
    spatialObject: nil,
    video: nil
)
let body = UNQCreateColletionBody(mode: .nft,
                                  name: "Name",
                                  description: "Description",
                                  tokenPrefix: "TokenPrefix",
                                  sponsorship: nil,
                                  limits: nil,
                                  metaUpdatePermission: nil,
                                  permissions: nil,
                                  readOnly: false,
                                  address: "Address",
                                  schema: schema,
                                  properties: nil,
                                  tokenPropertyPermissions: nil)
Task {
    do {
        let result = try await Unique.Collection.creation.submitWatch(parameters: buildParameters,
                                                                      body: body,
                                                                      account: account,
                                                                      userAuthenticationType: .biometric)
    } catch (let error) {
        print(error)
    }
}
```

### Creation of a token with attributes

This code sample shows how to create a new token with specific attributes. You can read more about the method arguments in [create token method description](./methods.md#token).

```Swift
guard let account = Unique.Account.loadAccounts().first else { return }
let buildParameters = UNQRequestParameters(withFee: nil, verify: nil, callbackUrl: nil, nonce: nil)
let image = UNQEncodedInfixOrUrlOrCidAndHash(urlInfix: "string", url: nil, ipfsCid: nil, hash: "string")
let encodedAttribute: [String: JSONAny] = [
    "0": JSONAny(value: 0)
]
let data = UNQTokenToCreateDto(image: image,
                               attributes: nil,
                               encodedAttributes: encodedAttribute,
                               name: nil,
                               audio: nil,
                               description: nil,
                               imagePreview: nil,
                               spatialObject: nil,
                               video: nil)
let body = UNQCreateTokenBody(owner: "OwnerAddress", data: data, properties: nil, address: "Address", collectionId: 0)
Task {
    do {
        let result = try await Unique.Token.create.submitWatch(parameters: buildParameters,
                                                               body: body,
                                                               account: account,
                                                               userAuthenticationType: .biometric)
        print(result)
        
    } catch (let error) {
        print(error)
    }
}
```

### Transfer token

This code sample shows how to transfer a token. You can read more about the method arguments in [transfer token method description](./methods.md#token)


```Swift
guard let account = Unique.Account.loadAccounts().first else { return }
let buildParameters = UNQRequestParameters(withFee: nil, verify: nil, callbackUrl: nil, nonce: nil)
let body = UNQTransferTokenBody(collectionId: 0,
                                tokenId: 1,
                                address: "Address",
                                from: "FromAddress",
                                to: "ToAddress",
                                value: nil)
Task {
    do {
        let result = try await Unique.Token.transfer.submitWatch(parameters: buildParameters,
                                                                 body: body,
                                                                 account: account,
                                                                 userAuthenticationType: .biometric)
        print(result)
        
    } catch (let error) {
        print(error)
    }
}
```

### Transfer balance

This code sample shows how to transfer balance. You can read more about the method arguments in [balance transfer method description](./methods.md#balance).

```Swift
guard let account = Unique.Account.loadAccounts().first else { return }
let buildParameters = UNQRequestParameters(withFee: nil, verify: nil, callbackUrl: nil, nonce: nil)
let body = UNQBalanceTransferBody(address: "Address", destination: "DestinationAddrress", amount: 100)
Task {
    do {
        let result = try await Unique.Balance.transfer.submitWatch(parameters: buildParameters,
                                                                   body: body, 
                                                                   account: account,
                                                                   userAuthenticationType: .biometric)
        print(result)
    } catch (let error) {
        print(error)
    }
}
```

# C# SDK

## Unique SKD C#

Unique SDK C# is a C# library that allows you to use  all the features provided by our SDK when developing an Android app: you can build NFT applications from scratch or connect your existing apps that work on other blockchains to the Unique Network.


## How to install Unique SDK C#

Use the NuGet to download Network.Unique.SDK and Network.Unique.API.

#### Network.Unique.SDK
```
https://www.nuget.org/packages/Network.Unique.SDK
```
#### Network.Unique.API
```
https://www.nuget.org/packages/Network.Unique.API
```

## Usage examples

Here are some basic examples of how to use the Unique SDK Kotlin when working with blockchain. You can see more examples of methods in the [methods section](./methods.md).


### Signer creation

First of all, you must create a Signer and an SDK Object

```csharp
// Create signer from suri and password
Sr25519SignerWrapper signerWrapper = new Sr25519SignerWrapper(suri, suriPassword, false);
// Or generate signer with password
Sr25519SignerWrapper signerWrapper = new Sr25519SignerWrapper(null, suriPassword, true);
// Or generate signer without password
Sr25519SignerWrapper signerWrapper = new Sr25519SignerWrapper(null, null, true);

// create SDK god object. First parameter - base url of backend of blockchain
UniqueSdk uniqueSdk = new UniqueSdk("https://rest.opal.uniquenetwork.dev");

// Assign static signer to SDK
UniqueSdk.SignerWrapper = signerWrapper;
```

Signer has ```sign``` function for payload signing. When you using ```UniqueSdk``` methods they automatically use inner signer passed by parameter.

After we can use inner services of SDK

```kotlin
// Getting balance service for balance reading or manipulation
IBalanceService balanceService = uniqueSdk.BalanceService;
```

Some methods of service can be used with many parameters based on template, which we named ```Mutation```.
One of these mutations is balance transfering.

```kotlin
/// Getting balance transfering mutation
MutationService<BalanceTransferBody> transferMutationService = balanceService.GetTransferMutationService();
```

```Mutation``` has three main methods for executing:
- Build
- Sign
- Submit

Let's see how it's working
```csharp
// Creating payload for balance transfering
var transferBody = new BalanceTransferBody(
    //from
    "5DnUE1uV7iW25bUriWVPHY67KMm2t6g5v23GzVbZCUc8fyBD",
    //to
    "unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx",
    //amount
    0.01m
);

// Build transaction
var transferResponse = transferMutationService.Build(transferBody);

var signBody = new UnsignedTxPayloadResponse(
    transferResponse.SignerPayloadJSON,
    transferResponse.SignerPayloadRaw,
    transferResponse.SignerPayloadHex
);

// Sign transaction via inner signer
var signResponse = transferMutationService.Sign(signBody);

var submitBody = new SubmitTxBody(signResponse.SignerPayloadJSON, signResponse.Signature);

// Submit transaction and track result with web server
var submitResponse = transferMutationService.SubmitWatch(submitBody);
```

After all executions we can see transaction hash

```csharp
Console.WriteLine(submitResponse.Hash);
```

### Creation of a collection

This code sample shows how to create a new collection. You can read more about the method arguments in [create collection method description](./methods.md#collection).

```csharp
var collectionService = sdk.CollectionService;
var createCollection = collectionService.GetCreateCollection();

var request = new CreateCollectionBody(
    CreateCollectionBody.ModeEnum.NFT,
    "Sample collection name",
    "sample collection description",
    "TEST",
    null,
    null,
    CreateCollectionBody.MetaUpdatePermissionEnum.ItemOwner,
    new CollectionPermissionsDto(
        CollectionPermissionsDto.AccessEnum.Normal,
        true,
        new CollectionNestingPermissionsDto(
            true,
            true
        )
    ),
    true,
    "5DnUE1uV7iW25bUriWVPHY67KMm2t6g5v23GzVbZCUc8fyBD"
);
var createCollectionResponse = createCollection.Build(request);

var signCollectionBody = new UnsignedTxPayloadResponse(
    createCollectionResponse.SignerPayloadJSON,
    createCollectionResponse.SignerPayloadRaw,
    createCollectionResponse.SignerPayloadHex
);
var signCollectionResponse = createCollection.Sign(signCollectionBody);

var submitCollectionBody = new SubmitTxBody(signCollectionResponse.SignerPayloadJSON, signCollectionResponse.Signature);
var submitCollectionResponse = createCollection.SubmitWatch(submitCollectionBody);
var collectionExtrinsic = extrinsicService.GetExtrinsicStatus(submitCollectionResponse.Hash);

Console.WriteLine(submitCollectionResponse.Hash);
Console.WriteLine(collectionExtrinsic);
```

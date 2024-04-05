# Kotlin SDK (Android)

## Unique Kotlin SDK 

Unique SDK Kotlin is a Kotlin library that allows you to use  all the features provided by our SDK when developing an Android app: you can build NFT applications from scratch or connect your existing apps that work on other blockchains to the Unique Network.

## How to install Unique Kotlin SDK

Use the Maven Central to download unique-sdk-kotlin.

```maven
<dependency>
  <groupId>network.unique</groupId>
  <artifactId>unique-sdk-jvm</artifactId>
  <version>0.0.1</version>
</dependency>
```

You can also download our library for key management on Android.

```maven
<dependency>
  <groupId>network.unique</groupId>
  <artifactId>unique-sdk-android</artifactId>
  <version>0.0.1</version>
</dependency>
```

## Usage Examples

Here are some basic examples of how to use the Unique SDK Kotlin when working with blockchain. You can see more examples of methods in the [methods section](./methods.md).

### Signer creation

First of all, you must create a Signer and an SDK Object

```kotlin
// Create signer from suri and password
val signer = Sr25519SignerWrapper(seed, seedPassword, false)
// Or generate signer with password
val signer = Sr25519SignerWrapper(null, seedPassword, true)
// Or generate signer without password
val signer = Sr25519SignerWrapper(null, null, true)

// Assign signer to SDK static field
UniqueSdk.signerWrapper = signerWrapper

// create SDK god object. First parameter - signer, second - base url of backend of blockchain
val sdk = UniqueSdk("https://rest.opal.uniquenetwork.dev")
```

Signer has ```sign``` function for payload signing. When you use ```UniqueSdk``` methods they automatically use inner signer passed by parameter.

After we can use inner services of SDK

```kotlin
// Getting balance service for balance reading or manipulation
val balanceService: BalanceService = sdk.balanceService;
```

Some methods of service can be used with many parameters based on template, which we named ```Mutation```.
One of these mutations is balance transfering.

```kotlin
/// Getting balance transfering mutation
val transferService = balanceService.getTransfer();
```

```Mutation``` has three main methods for executing:
- Build
- Sign
- Submit

Let's see how it's working
```kotlin
// Creating payload for balance transfering
val transferBody = TransferMutationRequest(
//from
    "5DnUE1uV7iW25bUriWVPHY67KMm2t6g5v23GzVbZCUc8fyBD",
//to
    "unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx",
//amount
    BigDecimal("0.01")
)

// Build transaction
val transferResponse = transferMutationService.build(transferBody)

val signBody = UnsignedTxPayloadResponse(
    transferResponse.signerPayloadJSON,
    transferResponse.signerPayloadRaw,
    transferResponse.signerPayloadHex
)

// Sign transaction via inner signer
val signResponse = transferService.sign(signBody)

val submitBody = SubmitTxBody(signResponse.signerPayloadJSON, signResponse.signature)

// Submit transaction and track result with web server
val submitResponse = transferService.submitWatch(submitBody)
```

After all executions we can see transaction hash

```kotlin
println(submitResponse.hash)
```
### Creation of a collection

This code sample shows how to create a new collection. You can read more about the method arguments in [create collection method description](./methods.md#collection).


```kotlin
val collectionService = sdk.collectionService
val createCollection = collectionService.getCreateCollection()

val request = CreateCollectionMutationRequest(
    name = "Sample collection name",
    description = "sample collection description",
    tokenPrefix = "TEST",
    address = "5DnUE1uV7iW25bUriWVPHY67KMm2t6g5v23GzVbZCUc8fyBD",
    mode = CreateCollectionMutationRequest.Mode.nFT,
    metaUpdatePermission = CreateCollectionMutationRequest.MetaUpdatePermission.itemOwner,
    permissions = CollectionPermissionsDto(
        access = CollectionPermissionsDto.Access.normal,
        mintMode = true,
        nesting = CollectionNestingPermissionsDto(
            tokenOwner = true,
            collectionAdmin = true,
        )
    )
)
val createCollectionResponse = createCollection.build(request)

val signCollectionBody = UnsignedTxPayloadResponse(
    createCollectionResponse.signerPayloadJSON,
    createCollectionResponse.signerPayloadRaw,
    createCollectionResponse.signerPayloadHex
)
val signCollectionResponse = createCollection.sign(signCollectionBody)

val submitCollectionBody = SubmitTxBody(signCollectionResponse.signerPayloadJSON, signCollectionResponse.signature)
val submitCollectionResponse = createCollection.submitWatch(submitCollectionBody)
val collectionExtrinsic = extrinsicService.getExtrinsicStatus(submitCollectionResponse.hash)

println(submitCollectionResponse.hash)
println(collectionExtrinsic)
```


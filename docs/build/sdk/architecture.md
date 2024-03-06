


# Process layout


## Extrinsic

While working with the blockchain using any provided connection tool, the main instrument for changing blockchain data is **extrinsic**. Extrinsic is a request with certain parameters, which consists of 3 parts:

1. Blockchain section
2. Method section
3. Array of arguments

Once an extrinsic has been generated, it must be signed for the chain to complete the requested changes.

Use [Substrate](https://docs.substrate.io/reference/transaction-format) and [Polkadot](https://polkadot.js.org/docs/substrate/extrinsics/) documentation to learn more about extrinsics in general.

## Extrinsic lifecycle in Unique Network connection tools

Using SDK as a connection tool involves the following sequence of actions to change something in the blockchain:

1. SDK creates request parameters and sends them into SubstrateRest.
2. SubstrateRest sends request parameters into SubstrateClient.
3. SubstrateClient builds an unsigned extrinsic.
4. SDK uses the Account package to sign an extrinsic and sends it into SubstrateRest.
5. SubstrateRest sends a signed extrinsic into the blockchain.
6. Blockchain changes its condition according to the signed extrinsic.
7. SDK can request new blockchain state / extrinsic status.

[//]: # ()
[//]: # (```mermaidjs)
[//]: # (sequenceDiagram)
[//]: # (    participant SDK)
[//]: # (    participant Accounts)
[//]: # (    participant SubstrateREST)
[//]: # (    participant SubstrateClient)
[//]: # (    participant Blockchain)
[//]: # (    SDK->>SubstrateREST: request parameters)
[//]: # (    SubstrateREST->>SubstrateClient: request parameters)
[//]: # (    SubstrateClient->>Accounts: unsigned extrisic)
[//]: # (    Accounts->>SDK: unsigned extrisic + account details)
[//]: # (    SDK->>SubstrateREST: signed extrinsic)
[//]: # (    SubstrateREST->>Blockchain: signed extrinsic)
[//]: # (    SDK->>Blockchain: status request)
[//]: # (```)

## Input and output data

TBD




## Common errors


| Error type                                                                                                                                                                   | Additional information | 
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| Bad payload                 | TBD                    |
| Bad signature             | TBD                    |
| Build extrinsic         | TBD                    |
| Build query                 | TBD                    |
| Codes                          | TBD                    |
| Connection failed     | TBD                    |
| Errors                        | TBD                    |
| Invalid signer           | TBD                    |
| Not found                     | TBD                    |
| Public api                   | TBD                    |
| Submit extrinsic       | TBD                    |
| Validation                | TBD                    |
| Verification failed | TBD                    |

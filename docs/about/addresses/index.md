# Accounts and Addresses

An address represents an identity - usually of a person or an organization - that is capable of making transactions or holding funds. 
Although addresses are most often used to represent a person, that doesn't have to be the case. An address can be used to perform operations 
on behalf of a user or another entity, or to perform operations autonomously. In addition, any single person or entity could have multiple
addresses for different purposes. All [our networks](/networks/index.md) are Substrate-based blockchains, and you can have specialized addresses for holding funds that 
are separate from addresses used for making transactions.

### Substrate addresses

Substrate enables you to use a single public key to derive multiple addresses, so you can interact with multiple chains without creating separate 
public and private key pairs for each network. By default, the addresses associated with the public key for an address use 
the Substrate [SS58 address format](https://docs.substrate.io/reference/glossary/#ss58-address-format). This address format is based on base-58 encoding. 
In addition to allowing you to derive multiple addresses from the same public key, [base-58 encoding](https://digitalbazaar.github.io/base58-spec/) has the following benefits:

* Encoded addresses consist of 58 alphanumeric characters.
* The alphanumeric string omits characters - such as 0, O, I, and l - that can be difficult to distinguish from each other in a string.
* Network information - for example, a network-specific prefix - can be encoded in the address.
* Input errors can be detected using a checksum to ensure the address is entered correctly.

Thus, a Substrate address contains of chain prefix, public key, and checksum which are encoded using the base58 algorithm. The example below
demonstrates this in detail.

<details>
<summary>Example</summary>

Let's take a Substrate address, e.g. _yGHGXr2qCKygrxFw16XXEYRLmQwQt8RN8eMN5UuuJ17ZFPosP_. Using the [@unique-nft/api](https://www.npmjs.com/package/@unique-nft/api)
library, we can decode the address. 

```ts
import {UniqueUtils} from '@unique-nft/api'
const Address = UniqueUtils.Address
  ...  
Address.substrate.decode('unk9GwxLcJ7VHE75RgDYuRjuewZBGWHWvwgdVMSN3pPz9bY52')
// or
Address.substrate.decode('yGJMj5z32dpBUigGVFgatC382Ti3FNVSKyfgi87UF7f786MJL')
```

The result is following. Please note that both calls give the same result since we receive a public key which is the same in both addresses, 
they are equal just presented in different formats (Unique and Quartz). 

![public key](../images/array-address.png)

Now, let's use another decoder that will provide not only public key as a result. 

```ts
import {algorithms} from "@unique-nft/utils/address"
... 
algorithms.base58.decode('unk9GwxLcJ7VHE75RgDYuRjuewZBGWHWvwgdVMSN3pPz9bY52')
``` 

The result below contains exactly the same public key (highlighted in red), a chain prefix, and a checksum. 
A chain prefix can also be represented by one value (i.e. for prefix 5, the first value of the 
array will be 42). This depends on how many bites are needed to store a prefix value.
Checksum is calculated using both prefix and public key. Thus, these values depend
on the chain prefix, as well. 

![full address](../images/array-full.png)

![prefix 42](../images/prefix42.png)

The reverse operation will show that the encoding and decoding work in both directions. 

```ts
algorithms.base58.encode(new Uint8Array( [
    119, 220, 248, 204, 117, 247, 109,  70, 195,
    177, 197, 242, 112, 254,   6, 200,
    255, 222, 171, 142,  94, 171, 151,
    242,  51,  31, 180, 145,  35, 180,
    140, 235,  42, 125, 41, 181
  ]))
// unk9GwxLcJ7VHE75RgDYuRjuewZBGWHWvwgdVMSN3pPz9bY52
```

</details>

The private key owner can change chain data only by signing a transaction with the private key and publishing it to the blockchain.
This data is stored inside the blockchain, and it is read-only for all other users.

<!---
Blockchain accounts are quite different thing from what we use for web2 accounts. They don't necessarily have any server data. Basically, the account consists of these things:
* _A private key_ (the seed phrase allows to generate one) is stored by a user in secret.
* _Address_ (usually it is some hash or encoding of the public key) - publicly known.
* _Chain data_ associated with the address - in the case of Unique, it is all public.
-->

Each Substrate blockchain can register a custom prefix to create a chain-specific address type. For example, all Polkadot addresses start with 1 and all Kusama
addresses start with a capital letter. All unregistered Substrate chains start with 5.

:warning: The default Substrate address format (starting from 5) also has the prefix equals 42.

The prefixes that Unique Network uses:

- For Unique - **7391**, gives "**un**" at the beginning of the encoded address.
- For Quartz - **255**, gives "**yG**" at the beginning of the encoded address.
- For Opal - **42**, gives default "**5**" at the beginning of the encoded address.
- For Sapphire - **8883**, gives default "**px**" at the beginning of the encoded address.

### Ethereum addresses

There are two types of addresses in Ethereum: Externally Owned Address (EOA) and Contract Address.

**Externally Owned Address**

Externally Owned Address refers to an account with a public and private key pair that holds your funds.

An Ethereum address is a 42-character hexadecimal address derived from the last 20 bytes of the public key controlling the address with 0x appended in front. e.g., _0x71C7656EC7ab88b098defB751B7401B5f6d8976F_.

The Ethereum address is the "public" address that you would need to receive funds from another party. To access funds in the address, you must have its private key. 
Kindly exercise duty of care when handling your private key as they can be used to access all the funds in an address.

**Contract Address**

Contract address refers to the address hosting a collection of code on the Ethereum blockchain that executes functions. These functions of a contract address are executed when a transaction with associated input data (contract interaction) is made to it.

The contract address is usually created when a contract is deployed to the Ethereum Blockchain.

Both Externally Owned and Contract Addresses share the same format of having 42 hexadecimal characters.

### Live address encoder
<br/>
<SubEthCoder/>



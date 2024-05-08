# Account mirrors

There are two types of accounts in Unique Network:

- Native substrate accounts. Generic substrate account looks like `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`
- Ethereum accounts, a 42-character hexadecimal string starting with `0x`

Because of different formats, substrate and ethereum addresses cannot interact directly. For example, you cannot send tokens from Metamask to the substrate address; it requires the ethereum format.

However, it is possible to mix these two worlds thanks to account mirroring.

## Account mirrors

Mirroring is a mechanism that allows you to get address representation in a different format—substrate for ethereum address and ethereum for substrate.

You can play around with address converter in the [reference section](../../../../reference/tools.md).

For example:

- Ethereum mirror for `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY` is `0xd43593c715Fdd31c61141ABd04a99FD6822c8558`
- Substrate mirror for `0x1B8EeEC6eD7e9C6B98291A8274c006e251902Ef3` is `5FkhL2YH6rZD2AspxMBoUfFnA4GwWVKHVTbL1kChhYMvSq7B`

> It is very important to note that you can not get the original account from the mirror account. Because of the different sizes, this is a one-way mapping.

Here is the primary use case for mirrors:

1. If you want to send tokens from substrate account to ethereum account - send it to it's substrate mirror.

2. The opposite operation works with one tradeoff. Tokens sent to the ethereum mirror of a substrate account will not directly top up the substrate account's balance. However, the substrate account can "withdraw" tokens from its ethereum mirror using `api.tx.evm.withdraw` method.

## Code example

To get an accounts mirror, use `Address` util from `@unique-nft/utils.`

```ts
import { Address } from "@unique-nft/utils";

const ethMirror = Address.mirror.substrateToEthereum('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
// 0xd43593c715Fdd31c61141ABd04a99FD6822c8558

const subMirror = Address.mirror.ethereumToSubstrate('0x1B8EeEC6eD7e9C6B98291A8274c006e251902Ef3');
// 5FkhL2YH6rZD2AspxMBoUfFnA4GwWVKHVTbL1kChhYMvSq7B
```


The following articles will teach you more advanced concepts that make the developer and user experience smoother. 

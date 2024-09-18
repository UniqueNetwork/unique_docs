# Account 

There are two types of accounts in Unique Network:

- Native substrate accounts. The generic substrate account looks like `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`.
- Ethereum accounts, a 42-character hexadecimal string starting with `0x`.

Because of different formats, substrate and ethereum addresses cannot interact directly. For example, you cannot send tokens with Metamask to the Substrate address.

### Account mirrors

Mirroring is a mechanism that allows you to get address representation in a different format—substrate for ethereum address and ethereum for substrate.

You can play around with the address converter in the [reference section](../../../../reference/tools.md).

For example:

- Ethereum mirror for `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY` is `0xd43593c715Fdd31c61141ABd04a99FD6822c8558`. When a substrate account calls contracts, the `msg.sender` will be its mirror.
- Substrate mirror for `0xd43593c715Fdd31c61141ABd04a99FD6822c8558 ` is `5FrLxJsyJ5x9n2rmxFwosFraxFCKcXZDngRLNectCn64UjtZ`

::: warning
It is not possible to calculate the original account from the mirror account. This is a one-way mapping because of the different sizes between EVM and Substrate accounts.
:::

#### Here are the primary use cases for mirrors

1. If you want to send tokens from a substrate account to an ethereum account, send them to the latter's substrate mirror.

2. The opposite operation works with one tradeoff. Tokens sent to the ethereum mirror of a substrate account will not directly top up the substrate account's balance. However, the substrate account can "withdraw" tokens from its ethereum mirror using the `api.tx.evm.withdraw` method.

The other question appears here. If the caller is a mirror, the beneficiary of a contract execution would also be the mirror, not the original Substrate address. For example, as a result of a `swap` on a DEX, all the tokens would be transferred to the mirror. How can this be solved?

#### Substrate account can transfer from its mirror

- Native tokens, such as `UNQ` or `OPL`, can be withdrawn with `evm::withdraw` extrinsic
- All native `NFTs`, `Fungible`, and `ReFungible` can be transferred using [transferFrom](./tokens.md#transfer).

However, this is not a great experience, so Unique provides a `CrossAddress` structure for Solidity.

### Using `CrossAddress`

This struct represents an EVM or Substrate account in Solidity. It has two properties: `sub` for a Substrate account and `eth` for an EVM account. Only one property can be filled.

```Solidity
struct CrossAddress {
  address eth;
  uint256 sub;
}
```

- For the EVM account, set the `eth` property with the EVM address (0x...), and the `sub` should be 0.
- For the Substrate account, set the `sub` property with the substrate public key in the decimal format. The `eth` property should be equal to Ethereum zero address (0x000...00000);

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

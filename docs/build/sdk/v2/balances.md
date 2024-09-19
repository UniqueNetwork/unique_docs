# Balances

## Prerequisite

Follow the [Getting started guide](./quick-start.md) to install required libraries, receive test network OPL tokens, and initialize SDK.

## Get balance

After receiving OPL tokens you can check your account's balance using SDK.

```ts:no-line-numbers
const balances = await unique.balance.get({
  address: account.address
});

console.log(balances);
```

The output will resemble the following:

```ts:no-line-numbers
{
  available: '270171775322286038926',
  locked: '0',
  free: '270171775322286038926',
  total: '270171775322286038926',
  reserved: '0',
  staked: '0',
  unstaked: '0',
  canstake: '270171775322286038926',
  vested: [],
  decimals: 18,
  tokenSymbol: 'OPL'
}
```

Let's understand balance meaning:

- `available`: the balance user can transfer. Most application should operate with this balance
- `locked`: the balance locked by staking or vesting
- `free`: the sum of `available` and `locked`
- `reserved`: the balance reserved by collator selection pallet
- `total`: the sum of `free` and `reserved` balance
- `staked`: the balance locked by staking
- `unstaked`: the balance that has been unstaked and awaiting unlocking period (~ 7 days)
- `canstake`: the balance user can stake
- `vested`: the balance locked by vesting pallet
- `decimals`: all balances are in the wei. This field shows what is the decimals part
- `tokenSymbol`: token symbol

## Transfer

The account can transfer tokens in `available` status.

```ts:no-line-numbers
await unique.balance.transfer({
  amount: '100',
  to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});
```

By default `amount` is set in wei.

It is also possible to specify transfer in coins.

```ts:no-line-numbers
await unique.balance.transfer({
  amount: '100.44',
  to: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  isAmountInCoins: true // <--- in this case the transfer amount will be 100.44e18
});
```
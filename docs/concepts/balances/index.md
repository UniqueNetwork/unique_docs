# Balances

![Types of balances](../balances/types.png)

## Total
All tokens owned by the user.

> Not all tokens included in the total are available to the user for transfers or extrinsics calls. Some of them may be [reserved](#_2-reserved), and some may be [locked](#_1-2-locked).

**How to get:**

`api.query.system.account`

```json
{
  nonce: 90
  consumers: 0
  providers: 2
  sufficients: 0
  data: {
    free: 267,650,597,011,312,913,686,135,054,997
    reserved: 1,000,000,000,000,000,000,000,000,000,000
    miscFrozen: 0
    feeFrozen: 0
  }
}
```

> then add the fields `data.free` and `data.reserved`. In the example above total balance equal `1,267,650,597,011,312,913,686,135,054,997`

## 1. Free
The balance of the user that they can use to perform operations on the network. Some operations (such as staking) may not decrease this balance, but may impose some restrictions on a part of it (see locked).

**How to get:**

`api.query.system.account` - `data.free`

### 1.1 Transferable

A truly free balance. Tokens that the user can transfer to another account or use in any other way.

**How to get:**

Subtract [total locked](#_1-2-locked) balance from [free](#_1-free).

### 1.2 Locked

The balance locked by the logic of some pallets.
Locks are imposed on the free balance and do not reduce it, but only impose restrictions on transfer and payment of fees, reducing the transferable balance.

Every lock has an ID. Possible reasons for the lock:
- vesting (`id: ormlvest`) 
- staking (`id: appstake`) 
- democracy (in upcoming releases) 

Locks with different IDs are not summed up - the total locked balance is determined by the biggest lock.
A balance locked under any lock ID can be locked under another ID. For example: balance locked in vesting can be locked in staking, provided the user has enough tokens to pay the tx fee. In fact, there may be cases where the sum (for different IDs) of locked balances exceeds the value of the free balance.

**How to get:**

`api.query.balances.locks`

``` json
[
  {
    id: ormlvest
    amount: 149,251,544,327,160,492,572,272
    reasons: All
  }
  {
    id: appstake
    amount: 455,914,961,826,174,340,990,424
    reasons: All
  }
]
```

> Each separate lock can be obtained by ID. The total locked balance will be equal to the largest lock in the list. In the example above, the total locked balance is equal to the lock with `id: appstake`

#### 1.2.1 Vesting

`id: ormlvest`

Tokens are transferred to this state when using `api.extrinsic.vesting.vestedTransfer`. A typical example is the distribution of rewards for participating in a crowdloan.

To find out the vesting schedule, execute:

`api.query.vesting.vestingSchedules`

``` json
[
  {
    start: 13,710,000
    period: 1
    periodCount: 1,000,000
    perPeriod: 1,000,000,000,000,000,000
  }
]
```

> start: the block from which tokens begin to vest (unlock)
> 
> period: the duration of one vesting period in blocks
> 
> periodCount: the number of vesting periods
> 
> perPeriod: the number of tokens available for claim per period

>Starting from block `13,710,000`, each subsequent block for a period of `1,000,000` blocks makes available `1,000,000,000,000,000,000` what equals 1 token (18 decimals), become available for vesting. One million tokens in total.


Unlocking does not happen automatically. The user must call `api.extrinsic.vesting.claim`. The amount of unlocked tokens will be calculated on the block when the transaction is made. In the example above, if the user makes a claim at block `#14,000,000`, then `290,000` tokens will be unlocked - one for each block since the start.

#### 1.2.2 Staking

`id: appstake`

The tokens enter this state when executing `api.extrinsic.appPromotion.stake`. The tokens are immediately transferred to the locked state. The first reward will be available after one full staking period, which is `14,400` relay chain blocks (~1 day). If the transaction falls in the middle of the period, the first reward will be available after one period. To find out the exact block in which the next reward will be available, you need to call:

`api.query.sppPromotion.staked`

``` json
[
  [
    [
      5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
      3,739
    ]
    [
      100,000,000,000,000,000,000
      28,800
    ]
  ]
]
```

> A user staked `100` tokens in relay block `#3,739`. The first staking period from block `#0 to #14,400` is not complete for the user, so they will not receive a reward for it. The first reward will be available at the end of the next period (blocks `#14,400 to #28,800`).

Rewards for stakers are accrued when calling the `api.extrinsic.appPromotion.payoutStakers` method. A new reward will be automatically locked under the `id: appstake`. Each subsequent reward will take into account the previous rewards and will thus be slightly larger than the previous one.

The user has the right to stake tokens locked by vesting or any other reason different than staking.

To unlock tokens, execute `api.extrinsic.appPromotion.unstakeAll` or `api.extrinsic.appPromotion.unstakePartial`. After unstaking, the tokens remain locked under the `id: appstake` for the unstaking period, which is equal to `50,400` parachain blocks (~ 7 days). At the end of the unstaking period, the lock is automatically removed, and no separate calls need to be made by the user. To find out the exact block in which the tokens will be unlocked, call:

`api.rpc.appPromotion.pendingUnstakePerBlock`

``` json
[
  [
    2,182,233
    1,589,000,000,000,000,000,000
  ]
]
```

> In block `#2,182,233`, the lock will be automatically removed from `1,589` tokens.

The user will not receive rewards for tokens waiting to be unlocked.

## 2. Reserved
Reserved balance is a portion of the user's balance that is not available for any operations involving the user's funds. In Unique Network, funds are placed in this state when a user purchases a collator license.
 
**How to get:**

`api.query.system.account`

``` json
{
  nonce: 90
  consumers: 0
  providers: 2
  sufficients: 0
  data: {
    free: 267,650,597,011,312,913,686,135,054,997
    reserved: 1,000,000,000,000,000,000,000,000,000,000
    miscFrozen: 0
    feeFrozen: 0
  }
}
```

> Reserved balance is displayed in `data.reserved` field

## Cases

### 1. Claim of vested tokens

- Alice has 1000 tokens, out of which 700 are locked by vesting.
- Alice claims 200 tokens.

<!-- ![Claim of vested tokens. Before](../balances/claim-before.png) -->

**Result:**

- The free balance includes all locks, so it remains unchanged.
- The total locked balance is calculated as the largest (and only) lock - vesting.
- The transferable balance is calculated as (free - total locked), so it increases by 200 tokens.

Before:

<img src="../balances/claim-before.png" alt="Claim of vested tokens. Before" width="600"/>

After:

<img src="../balances/claim-after.png" alt="Claim of vested tokens. After" width="600"/>

### 2. Vested tokens staking
- Alice has 1000 tokens, 500 of which are locked by vesting.
- Alice stakes 700 tokens. This is possible because the free balance, not the transferable balance, is important for a new lock (staking).

**Result:**

- Locks do not reduce the free balance, which remains unchanged.
- The total locked balance has increased and is now equal to the new largest lock - staking.
- The transferable balance has decreased due to the increased total locked balance.

Before:

<img src="../balances/claim-after.png" alt="Vested tokens staking. Before" width="600"/>

After:

<img src="../balances/staking-after.png" alt="Vested tokens staking. After" width="600"/>

### 3. Staking reward payout

- Alice has staked 700 tokens, and another 500 are locked in vesting.
- Alice has received 100 tokens as a reward for staking.

**Result:**

- The total and free balances have increased by 100 tokens.
- Rewards have been automatically locked, so the staking lock has increased to 800. When calculating subsequent rewards, the earned tokens will be taken into account. As a result, each next reward will be slightly larger than the previous one.
- Since the staking lock is the largest, the total locked balance also increases to 800. 
- The transferable balance remains unchanged

Before:

<img src="../balances/reward-before.png" alt="Staking reward payout. Before" width="600"/>

After:

<img src="../balances/reward-after.png" alt="Staking reward payout. After" width="600"/>

### 4. Reserving balances

- Alice has 1000 tokens, 500 of which are locked by staking.
- Alice reserves 200 tokens for setting up Identity.

**Result:**

- Reserved balances reduce the free balance.
- The transferable balance is also reduced accordingly.
- Reserved balances cannot be used for any activities, including staking. Alice will - not be able to stake more than 300 additional tokens.

Before:

<img src="../balances/claim-after.png" alt="Reserving balances. Before" width="600"/>

After:

<img src="../balances/reserved-after.png" alt="Reserving balances. After" width="600"/>

# Sponsoring 

In Unique Network, transactions can be sponsored. This allows for shielding of end-users from the hassles of fee processing. For example, in the Unique Marketplace, users do not have to pay fees for listing NFTs. This eliminates the need for the user to obtain or own any native fungible token amount just to be able to take part in the market. And since minting can be sponsored as well, it could cost you zero in fees to list a gifted token.

However, DOS attacks may deplete sponsor funds by sending too many "free" (for users) transactions. The solution here is to set a rate limit based on NFT.
For example, an NFT can be transferred once per X hours. Or, as an alternative, a rate limit can be based on the allow list for smart contracts.

The following types of transactions can be sponsored:
* Minting NFTs
* NFT transfers
* Smart contract calls, etc.

Here is [the link](https://github.com/UniqueNetwork/pallet-sponsoring) to the pallet that allows dapp builders to create effective onboarding mechanisms for new users.

## Collection sponsoring 

The collection sponsoring is determined based on a rate limit. 

First, the rate limit is checked. If everything is OK, then the network chooses who pays for a transaction (before its execution). 

> The choice is based on the rate limit but not on the address balances. 

Then, when the transaction is being carried out, the network tries to withdraw the fee from the selected address.

If collection sponsoring is enabled, the specified sponsor pays for a transaction in any case. If the sponsor address does not have enough money, then the error will occur, and the transaction will not be carried out. 

> There is no way for another address to pay for the transaction when sponsoring is enabled.  

The [Example](#example) section demonstrates how the collection sponsoring works in a sample scenario. 

## Smart contract sponsoring 

For an Ethereum contract, it is possible to set only the self-sponsoring mode. 

To make sponsoring work, it is necessary to add funds to a Substrate address (Ethereum mirror). Please note that it is impossible to add funds on the Ethereum side. However, if the "receive" method is implemented (according to [the Solidity docs](https://docs.soliditylang.org/en/v0.8.14/contracts.html#receive-ether-function)), it will be possible to add funds on the Ethereum side, as well. Please note that this is not related to _payable_ functions anyhow. 

> If the rate limit is OK, the smart contract pays for transactions. There is no way for user addresses to pay in this case. 

If the smart contract does not have funds and the sponsoring is enabled, you will not be able to add money since the smart contract will try to sponsor this transaction (but cannot do this). The solution here is to disable sponsoring, add money, and then enable sponsoring again. 

## Example

Let's imagine that a user has an NFT. But, he/she does not have any money in his/her address at the same time. This would mean that he/she cannot perform any transactions (like token transfer for example) because he/she should pay a transaction fee.

However, transaction sponsoring changes the rules. This mechanism allows performing a transfer even with a zero balance if a transaction sponsoring is enabled.

We have 4 users with the following initial balances: 
 
**Alice** - `1000 UNQ`

**Bob** - `0 UNQ`

**Charlie** - `1000  UNQ`

**Dave** - `1000  UNQ`

Then, we carry out the steps below to demonstrate how the balances are changed after transactions and who pays for these transactions in different scenarios. 
 
1. Alice creates a new collection (e.g., with ID 977). Creating a collection costs about 2 UNQ. The Alice balance is still `998 UNQ`.
    
2. Then Alice mints a new token. This costs 0.091 UNQ. **Alice balance** is `997.9090 UNQ` after minting one new token.


2. Alice sends the created token to Charlie. 
  This costs Alice 0.1 UNQ, the **Alice** **balance** is `997.8090 UNQ` after the transaction.


3. Charlie sends the received token to Bob. This costs Charlie 0.1 UNQ. the **Charlie** **balance** is `999.9000 UNQ`. 


4. Alice mints one more token and sends it to Bob. The **Alice balance** is `997.6180 UNQ` now.


5. Bob tries to send the received token to Charlie, but he fails. He does not have enough money to pay for the transaction. 


6. Alice sets a sponsorship for the collection and specifies Dave as a sponsor. Alice pays for this, and **her balance** is `997.5285 UNQ` now.

    Dave must confirm the sponsorship. Fees of 0.073 UNQ will be applied to the submission. **Dave balance** is `999.9265 UNQ` after this operation.


7. Bob tries to send the token to Charlie again (repeat step 5). However, this time he can do this. 

   Dave pays for the transaction 0.1 UNQ since he is the sponsor for the collection to which this token belongs. **Dave balance** is `999.8265 UNQ`.


8. Charlie sends the token to Alice. However, please pay attention that **Dave pays for the transaction** 0.1 UNQ. 
   
    **Dave balance** reduces to `999.7265 UNQ`. Charlie balance does not change, and he does not pay for this transaction. 


9. Alice sends the token to Charlie again. And Dave pays for the transaction again (0.1 UNQ). 
    **Dave balance** is `999.7265 UNQ`.


10. Dave sends all UNQ to Alice and pays the transaction fee for this. After this, he has only `0.0093 UNQ` which is not enough for any transaction.
 

11. Charlie tries to send the token to Alice. But he cannot send it because Dave's balance is low. Since Dave is a sponsor, he should pay for the transaction. But, he does not have money for this.


12. Alice removes the collection sponsor (Dave), and step 11 is repeated. The transaction is successful this time. Charlie himself pays for it 0.1 UNQ. **His balance** is `999.7000 UNQ` now.

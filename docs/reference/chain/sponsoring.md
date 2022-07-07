# Sponsoring 

## Transaction sponsoring 

Let's imagine that a user has a NFT. But, he/she does not have any money in his/her account at the same time. This would mean that he/she cannot perform any transactions (like token transfer for example), because he/she should pay a transaction fee. 

However, transaction sponsoring changes the rules. This mechanism allows performing a transfer even with a zero balance if a transaction sponsoring is enabled. 

## Collection sponsoring 



## Example

We have 4 users with the following initial balances: 
 
**Alice** - `1000 UNQ`

**Bob** - `0 UNQ`

**Charlie** - `1000  UNQ`

**Dave** - `1000  UNQ`

Then, we carry out the steps below to demonstrate how the balances are changed after transactions and who pays for these transactions in different scenarios. 
 
1. Alice creates a new collection (e.g. with id 977). Creating a collection is free. The Alice balance is still `1000 UNQ`.
    
2. Then Alice mints a new token. This is costs 0.091 UNQ. **Alice balance** is `999.9090 UNQ` after minting one new token.


2. Alice sends the created token to Charlie. 
  This costs Alice 0.1 UNQ, the **Alice** **balance** is `999.8090 UNQ` after the transaction.


3. Charlie sends the received token to Bob. This costs Charlie 0.1 UNQ. the **Charlie** **balance** is `999.9000 UNQ`. 


4. Alice mints one more token and sends it to Bob. The **Alice balance** is `999.6180 UNQ` now.


5. Bob tries to send the received token to Charlie, but he fails. He does not have enough money to pay for the transaction. 


6. Alice sets a sponsorship for the collection and specifies Dave as a sponsor. Alice pays for this, and **her balance** is `999.5285 UNQ` now.

    Dave must confirm the sponsorship. Fees of 0.073 UNQ will be applied to the submission. **Dave balance** is `999.9265 UNQ` after this operation.


7. Bob tries to send the token to Charlie again (repeat step 5). However, this time he can do this. 

   Dave pays for the transaction 0.1 UNQ since he is the sponsor for the collection to which this token belongs. **Dave balance** is `999.8265 UNQ`.


8. Charlie sends the token to Аlice. However, please pay your attention that **Dave pays for the transaction** 0.1 UNQ. 
   
    **Dave balance** reduces to `999.7265 UNQ`. Charlie balance does not change, and he does not pay for this transaction. 


9. Аlice sends the token to Charlie again. And, Dave pays for the transaction again (0.1 UNQ). 
    **Dave balance** is `999.7265 UNQ`.


10. Dave sends all UNQ to Alice, pays the transaction fee for this. After this, he has only `0.0093 UNQ` which is not enough for any transaction.
 

11. Charlie tries to send the token to Alice. But, he cannot send it, because Dave balance is low. Since Dave is a sponsor, he should pay for the transaction. But, he does not have money for this.


12. Alice removes the collection sponsor (Dave), and step 11 is repeated. Transaction is successful this time. Charlie himself pays for it 0.1 UNQ. **His balance** `999.7000 UNQ` now.

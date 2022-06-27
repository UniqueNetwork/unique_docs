# Accounts and Addresses

Blockchain accounts are quite different thing from what we use to for web2 accounts. They don't necessarily have any server data. Basically, the account consists of these things:
* _Private key_ (the seed phrase allows to generate one) - stored by a user in secret.
* _Address_ (usually it is some hash or encoding of the public key) - publicly known.
* _Chain data_ associated with the address - in case of Unique it is all public.

The private key owner can change chain data only by signing a transaction with the private key and publishing it to the blockchain.
This data is stored inside blockchain, and it is read-only for all other users.

A Substrate address contains of:
- Chain prefix;
- Public key;
- Checksum.

:warning: The default Substrate address format (starting from 5..) also has the prefix equals 42.

The concatenation result of the mentioned above parts is encoded via base58 algorithm. The result of these operations is a Substrate address.
This is the reason why different addresses for same parachain (i.e. with same prefix) have same first one or two symbols.

The prefixes that Unique Network uses:

- For Unique - **7391**, gives "**un**" in the beginning of encoded address.
- For Quartz - **255**, gives "**yG**" in the beginning of encoded address.
- For Opal - **42**, gives default "**5**" in the beginning of encoded address.

### Live address encoder
<br/>
<SubEthCoder/>



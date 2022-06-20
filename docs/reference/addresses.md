# Addresses

Substrate address contains of:
 - Chain prefix
 - Public key
 - Checksum

Remark on default (starting with "5...") address format. Even this default Substrate address format (5..) actually has prefix 42.

And concatenated together and encoded via base58 it becomes an address.
That's why addresses for same parachain (i.e. with same prefix) have same first symbol or two symbols.

Our prefixes are:

 - For Unique - 7391, gives "un" in the beginning of encoded address.
 - For Quartz - 255, gives "y" in the beginning of encoded address.
 - For Opal - 42, gives default "5" in the beginning of encoded address.

### Live address encoder
<br/>
<SubEthCoder/>



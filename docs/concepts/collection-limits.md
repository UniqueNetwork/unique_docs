# Collection limits

**accountTokenOwnershipLimit: u32**

Maximum number of tokens that one address can own

**sponsoredDataSize: u32**

Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode

**sponsoredDataRateLimit: UpDataStructsSponsoringRateLimit**

Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored

**tokenLimit: u32**

Total amount of tokens that can be minted in this collection

**sponsorTransferTimeout: u32**

Time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored  

**sponsorApproveTimeout: u32**

Time interval in blocks that defines once per how long a non-privileged user approve transaction can be sponsored

**ownerCanTransfer: bool**

Boolean value that tells if collection owner or admins can transfer or burn tokens owned by other non-privileged users

**ownerCanDestroy: bool**

Boolean value that shows whether collection owner can destroy it

**transfersEnabled: bool**

Flag that defines whether token transfers between users are currently enabled
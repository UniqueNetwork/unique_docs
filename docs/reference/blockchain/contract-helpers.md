# Contract Helpers

Address: **0x842899ecf380553e8a4de75bf534cdf6fbf64049**

This precompiled contract allows the owner to manage the sponsorship of their contract.

## Interface

Below is an overview of the ContractHelpers API.

---

<details>
  <summary><b>Click here to see the full interface</b></summary>

  @[code](./ContractHelpers.sol)
</details>

#### contractOwner

*Returns the owner of the specified contract*
```solidity:no-line-numbers
function contractOwner(address contractAddress) public view returns (address)
```

#### setSponsor

*Sets a sponsor for a specified contract*
```solidity:no-line-numbers
function setSponsor(address contractAddress, address sponsor) public
```

#### selfSponsoredEnable

*Enables self-sponsorship for a specified contract*
```solidity:no-line-numbers
function selfSponsoredEnable(address contractAddress) public
```

#### removeSponsor

*Removes the sponsor for a specified contract*
```solidity:no-line-numbers
function removeSponsor(address contractAddress) public
```

#### confirmSponsorship

*Confirms sponsorship for a specified contract. The caller must be the same address that set the sponsor via setSponsor*
```solidity:no-line-numbers
function confirmSponsorship(address contractAddress) public
```

#### sponsor

*Gets the current sponsor for a specified contract*
```solidity:no-line-numbers
function sponsor(address contractAddress) public view returns (OptionCrossAddress memory)
```

#### hasSponsor

*Checks if a contract has a confirmed sponsor*
```solidity:no-line-numbers
function hasSponsor(address contractAddress) public view returns (bool)
```

#### hasPendingSponsor

*Checks if a contract has a pending sponsor*
```solidity:no-line-numbers
function hasPendingSponsor(address contractAddress) public view returns (bool)
```

#### sponsoringEnabled

*Checks if sponsoring is enabled for a specified contract*
```solidity:no-line-numbers
function sponsoringEnabled(address contractAddress) public view returns (bool)
```

#### setSponsoringMode

*Sets the sponsoring mode for a specified contract*
```solidity:no-line-numbers
function setSponsoringMode(address contractAddress, SponsoringModeT mode) public
```

#### sponsoringRateLimit

*Gets the current sponsoring rate limit for a specified contract*
```solidity:no-line-numbers
function sponsoringRateLimit(address contractAddress) public view returns (uint32)
```

#### setSponsoringRateLimit

*Sets the sponsoring rate limit for a specified contract. Only the contract owner can change this setting*
```solidity:no-line-numbers
function setSponsoringRateLimit(address contractAddress, uint32 rateLimit) public
```

#### setSponsoringFeeLimit

*Sets the sponsoring fee limit for a specified contract. Only the contract owner can change this setting*
```solidity:no-line-numbers
function setSponsoringFeeLimit(address contractAddress, uint256 feeLimit) public
```

#### sponsoringFeeLimit

*Gets the current sponsoring fee limit for a specified contract*
```solidity:no-line-numbers
function sponsoringFeeLimit(address contractAddress) public view returns (uint256)
```

#### allowed

*Checks if a specified user is present in the contract allowlist. The contract owner is always implicitly included*
```solidity:no-line-numbers
function allowed(address contractAddress, address user) public view returns (bool)
```

#### toggleAllowed

*Toggles a user's presence in the contract allowlist. Only the contract owner can change this setting*
```solidity:no-line-numbers
function toggleAllowed(address contractAddress, address user, bool isAllowed) public
```

#### allowlistEnabled

*Checks if allowlist access is enabled for a specified contract*
```solidity:no-line-numbers
function allowlistEnabled(address contractAddress) public view returns (bool)
```

#### toggleAllowlist

*Toggles allowlist access for a specified contract. Only the contract owner can change this setting*
```solidity:no-line-numbers
function toggleAllowlist(address contractAddress, bool enabled) public
```
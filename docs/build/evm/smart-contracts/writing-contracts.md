# Writing smart contracts

Substrate and EVM can work together seamlessly within the Unique Network, allowing you to leverage both platforms' strengths. While Substrate’s native assets offer distinct advantages, EVM brings additional benefits such as:

Autonomy and Decentralization: Achieve full control and decentralized operations.
New Scenarios: Create gasless experiences for users or charge transaction fees in your custom token.
Application Rule Enforcement: Establish strict, unbreakable rules for minting collections, tokens, and modifying attributes, ensuring your application operates as intended.

::: tip
In the Unique Network, you don't have to choose between Substrate and Ethereum; they complement each other. Contracts can interact with Substrate accounts, allowing users to call contracts using Substrate wallets. Learn more in the [EVM from Substrate](../../sdk/v2/evm.md) section.
:::

In previous sections, we covered creating collections and managing contract sponsorship. This section will guide you through creating collections and tokens compatible with the [Unique Metadata Format](../../sdk/v2/metadata-reference.md).

## Making Your Assets Compatible with the Unique Metadata Format

We’ve previously discussed creating collections and tokens using the [CollectionHelpers](./collection-helpers.md) precompile and the UniqueNFT interface. To ensure your assets display correctly in wallets and marketplaces, you must maintain compatible metadata. This process can be complex, so we provide [contracts that handle this for you](https://github.com/UniqueNetwork/unique-contracts).

::: tip
For this section, we’ll use [unique-contracts](https://github.com/UniqueNetwork/unique-contracts)which is actively being developed but is already usable with [Foundry](https://book.getfoundry.sh/)

```bash:no-line-numbers
forge install UniqueNetwork/unique-contracts
```

For **Hardhat projects**, you’ll need to copy the entire contracts directory and manually install `@unique-nft/solidity-interfaces`. This process will be streamlined soon.

Additional examples can be found in the [recipes section](https://github.com/UniqueNetwork/unique-contracts/tree/main/contracts/recipes) on GitHub.
:::

There are two primary contracts you can use to enhance your application:

- `UniqueV2CollectionMinter.sol` - Create collections compatible with the Unique Metadata Format.
- `UniqueV2TokenMinter.sol` - Create tokens compatible with the Unique Metadata Format.

### Creating a Collection

Start by importing `"unique-contracts/UniqueV2CollectionMinter.sol"` and inheriting from `UniqueV2CollectionMinter` in your contract. You’ll need to call the constructor of the `UniqueV2CollectionMinter` contract to establish default token property permissions. In the example below, all tokens in the collection will have the following properties:

- true: mutable properties
- false: token owner cannot mutate
- true: collection admin can mutate

```solidity:no-line-numbers
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {UniqueNFT} from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";
import {Property, CollectionLimitValue} from "@unique-nft/solidity-interfaces/contracts/CollectionHelpers.sol";
import {UniqueV2CollectionMinter, CollectionMode, TokenPropertyPermission} from "unique-contracts/UniqueV2CollectionMinter.sol";
import {UniqueV2TokenMinter, Attribute, CrossAddress} from "unique-contracts/UniqueV2TokenMinter.sol";

contract MyMinter is UniqueV2CollectionMinter {
    constructor() UniqueV2CollectionMinter(true, false, true) {}
}
```

Inside your contract, you can call `_createCollection` to create a collection. Let’s create a minting function that simply calls `_createCollection` and returns the newly created collection address.

```solidity:no-line-numbers
contract MyMinter is UniqueV2CollectionMinter {
  ...
    function mintCollection(
        string memory _name,
        string memory _description,
        string memory _symbol,
        string memory _collectionCover
    ) external returns (address) {
        address collectionAddress = _createCollection(
            _name,
            _description,
            _symbol,
            _collectionCover,
            new CollectionLimitValue[](0),
            new Property[](0),
            new TokenPropertyPermission[](0)
        );

        return collectionAddress;
    }
  ...
```

Key Considerations:

- Collection Creation Fee: There is a fee of 2 UNQ tokens for creating a collection in Unique. Consider making this function payable, or set your own fee higher than 2 UNQ. Alternatively, you can pre-fund your contract with UNQ tokens to make it free for users.
- Ownership Transfer: Since the collection is created by the contract, the contract address becomes the collection owner. To transfer ownership, you may need to add additional calls in your minting function or create a "claim" function for ownership transfer.

Let’s enhance the contract to:

- Charge 5 UNQ tokens for collection creation.
- Transfer ownership to a specified account.
- Add the contract to the admin list, allowing it to mint tokens in the created collection.

Here’s the updated `mintCollection` function.

```solidity:no-line-numbers
function mintCollection(
    string memory _name,
    string memory _description,
    string memory _symbol,
    string memory _collectionCover,
    // 1. We use CrossAddress for new owner.
    // This struct will allow us to set not only evm but also substrate accounts as a new owner
    CrossAddress memory newOwner
) external payable returns (address) {
    // 2. Now this function is payable and we check that fee provided by msg.sender
    require(msg.value == 5e18, "Collection creation fee is 5 UNQ");
    address collectionAddress = _createCollection(
        _name,
        _description,
        _symbol,
        _collectionCover,
        new CollectionLimitValue[](0),
        new Property[](0),
        new TokenPropertyPermission[](0)
    );

    // 3. We will use UniqueNFT to manage created collection
    UniqueNFT collection = UniqueNFT(collectionAddress);

    // 4. Add this contract to admin-list
    collection.addCollectionAdminCross(
        CrossAddress({eth: address(this), sub: 0})
    );

    // 5. Transfer collection ownership to the newOwner
    collection.changeCollectionOwnerCross(newOwner);

    return collectionAddress;
}
```

### Adding a Token Minting Function

For token minting, we’ll use `UniqueV2TokenMinter.sol`.

- Add imports.
- Inherit from UniqueV2TokenMinter.
- Implement the mintToken function.

Here’s the code:

```solidity:no-line-numbers
...
import {UniqueV2TokenMinter, Attribute, CrossAddress} from "../UniqueV2TokenMinter.sol";

contract MyMinter is UniqueV2CollectionMinter, UniqueV2TokenMinter {
    constructor() UniqueV2CollectionMinter(true, false, true) {}

    ...

    function mintToken(
        address collectionAddress,
        string memory _image,
        Attribute[] memory _attributes,
        CrossAddress memory tokenOwner
    ) external {
        _createToken(
            collectionAddress,
            _image,
            _attributes,
            tokenOwner
        );
    }
}
```

Feel free to extend your token creation function with additional logic, such as charging your own fee.

### Final Contract

```solidity:no-line-numbers
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {UniqueNFT} from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";
import {Property, CollectionLimitValue} from "@unique-nft/solidity-interfaces/contracts/CollectionHelpers.sol";
import {UniqueV2CollectionMinter, CollectionMode, TokenPropertyPermission} from "../UniqueV2CollectionMinter.sol";
import {UniqueV2TokenMinter, Attribute, CrossAddress} from "../UniqueV2TokenMinter.sol";

contract MyMinter is UniqueV2CollectionMinter, UniqueV2TokenMinter {
    constructor() UniqueV2CollectionMinter(true, false, true) {}

    function mintCollection(
        string memory _name,
        string memory _description,
        string memory _symbol,
        string memory _collectionCover,
        // 1. We use CrossAddress for new owner.
        // This struct will allow us to set not only evm but also substrate accounts as a new owner
        CrossAddress memory newOwner
    ) external payable returns (address) {
        // 2. Now this function is payable and we check that fee provided by msg.sender
        require(msg.value == 5e18, "Collection creation fee is 5 UNQ");
        address collectionAddress = _createCollection(
            _name,
            _description,
            _symbol,
            _collectionCover,
            new CollectionLimitValue[](0),
            new Property[](0),
            new TokenPropertyPermission[](0)
        );

        // 3. We will use UniqueNFT to manage created collection
        UniqueNFT collection = UniqueNFT(collectionAddress);

        // 4. Add this contract to admin-list
        collection.addCollectionAdminCross(
            CrossAddress({eth: address(this), sub: 0})
        );

        // 5. Transfer collection ownership to the newOwner
        collection.changeCollectionOwnerCross(newOwner);

        return collectionAddress;
    }

    function mintToken(
        address collectionAddress,
        string memory _image,
        Attribute[] memory _attributes,
        CrossAddress memory tokenOwner
    ) external {
        _createToken(collectionAddress, _image, _attributes, tokenOwner);
    }
}
```

Explore more examples in the [recipes](https://github.com/UniqueNetwork/unique-contracts/tree/main/contracts/recipes) section

## Setting up Metamask

When sending transactions through Metamask, it initially verifies if the user has sufficient balance to cover gas fees. To enable sponsoring with Metamask, we need to bypass this gas check. Use the following [library](https://github.com/UniqueNetwork/web3-provider-sponsoring).

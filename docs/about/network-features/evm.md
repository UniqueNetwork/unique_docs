# EVM Compatibility 

**Core EVM features**

* Support for standard EVM smart-contracts
* Native collections are presented as contracts (ERC721-like) and may be interacted via Ethereum clients (like Metamask) and other smart contracts
* Possibility to create collections without smart contract deployment
* Collection sponsoring (transferring, approving, minting) by specific address balance, which is set as “CollectionSponsor”
* Seamless interop between Substrate and Ethereum API: possibility to create and manage collection from the Substrate API and interact via Ethereum API and vice versa
* Nesting. Easy with usual transfer - examples, descriptions. Rich bundling opportunities:
* RFT. ERC20 and ERC1633-compatible. With the possibility of splitting existing NFT into an RFT and then bundling an RFT into an NFT (under the condition of owning all the RFT parts), etc.
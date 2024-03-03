# Collection schemas

Since collections and tokens have properties that are simple key-value stores,
the user can put any data into the collection and token.  
And although it's very useful to have a free structure of data
it's not convenient to get into a field without any rules.

Thus, we offer two well-known schemas to use on our chains:

- Unique schema
- ERC721Metadata schema

#### Unique schema

**Unique** schema is a schema where all links and metadata is stored on-chain.
It allows to store data and attributes flexible with separate
access settings for every token field.  
This allows, for example, to make a live token, where some parts of the token can be securely
changed with guarantees from the blockchain that other parts won't be changed.

[Full documentation for properties and structure for the Unique schema can be found here](/concepts/schemas/unique)

#### ERC721Metadata schema

**ERC721Metadata** schema is a schema where token data is stored off-chain,
in a common way for the Ethereum world, where the chain stores just a link to an off-chain JSON file.  
We presume that the off-chain JSON file should follow the
[ERC721Metadata JSON Schema](https://eips.ethereum.org/EIPS/eip-721#:~:text=ERC721%20Metadata%20JSON%20Schema)
or its extension [Opensea data format](https://docs.opensea.io/docs/metadata-standards#metadata-structure).

[Full documentation for properties and structure for the ERC721Metadata schema can be found here](/concepts/schemas/ERC721Metadata)
# The Graph

## Intro 

[The Graph](https://thegraph.com/) is a protocol for building decentralized applications (dApps) quickly 
on Ethereum and IPFS using GraphQL.

Graph Node is an open source Rust implementation that event sources the Ethereum blockchain to deterministically 
update a data store that can be queried via the GraphQL endpoint.

For detailed instructions and more context, check out the [Getting Started Guide](docs/getting-started.md).

Since Unique Network provides the Ethereum API to work with networks, this approach can also be used. 

## Launch a local graph-node

To start, please clone the [https://github.com/graphprotocol/graph-node](https://github.com/graphprotocol/graph-node) 
repository using Git. 

```bash:no-line-numbers
git clone https://github.com/graphprotocol/graph-node.git

cd graph-node/docker
```

Then, open the Dockerfile and modify the following variable: 

```docker:no-line-numbers
environment.ethereum: 'mainnet:https://rpc-opal.unique.network'
```

When the new variable is saved, please start the container by this command: 

```bash:no-line-numbers
docker compose up
```

## Generate subgraph locally using the ABI file 

Let's install the Graph CLI. To do this, please run the command below.  

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install -g @graphprotocol/graph-cli
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn global add @graphprotocol/graph-cli
```

</CodeGroupItem>
</CodeGroup>

After this, run this command to initialize the Graph, and also specify the smart contract address and the ABI file 
(for more details, please check the [Graph docs](https://thegraph.com/docs/en/developing/creating-a-subgraph/#from-an-existing-contract)).

```bash:no-line-numbers
graph init --from-contract contractAddress --abi ./abi.json <prefix/graphName> 
```

After executing this command, the subgraph is generated using the specified contract and the ABI file. 
Here is [the example](https://github.com/AzgatG/test_opal). 

Now, we need to open the `subgraph.yaml` file and set the following: `dataSources.source.startBlock`. This is the start block for 
smart contract scanning. 

When it is done, please execute these commands to deploy your subgraph to the local graph-node. 

<CodeGroup>
  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm run create-local
npm run deploy-local 
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn run create-local
yarn run deploy-local 
```

</CodeGroupItem>
</CodeGroup>

## Examples 

Here are the examples how the main items look: 

Smart contract address - `0xED83A4E878E496ec1C84BdBbbC50c6657181F906`

The ABI file - `./abi.json`

Subgraph for indexing all blocks data - [https://thegraph.com/hosted-service/subgraph/kybernetwork/ethereum-blocks](https://thegraph.com/hosted-service/subgraph/kybernetwork/ethereum-blocks)
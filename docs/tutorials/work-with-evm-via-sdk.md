# EVM in SDK

In this tutorial, we will execute the smart contract methods and read their properties using EVM features from our SDK.

### Sample smart contract

We will use the following smart contract written in the Solidity language:

```solidity:no-line-numbers
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract MyContract {
    string public myStrValue = "my string value";
    uint private myUintValue = 123;

    event ChangeValue(uint delta, uint value);

    function getMyUint() external view returns (uint) {
        return myUintValue;
    }

    function updateMyUint(uint delta) external {
        myUintValue += delta;

        emit ChangeValue(delta, myUintValue);
    }

    function dropError(uint delta) external {
        myUintValue = myUintValue / delta;
    }
}
```

This smart contract is deployed on the Opal network at this address: ``0xf1917b3D87E0D355a29435A79a63670790E73Aa1``.

### Smart contract ABI

To make any request to a smart contract, you will need an ABI JSON file. This file describes all methods and properties 
that your smart contract contains.

For example, the following ABI describes the ``myStrValue`` string.

```json:no-line-numbers
{
  "inputs": [ ],
  "name": "myStrValue",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}
```

The [smart contract above](#sample-smart-contract) is described by this ABI file, which we will use later. 
To generate the contract ABI, you need to compile your the smart contract (see 
[Compilation artifacts](https://hardhat.org/hardhat-runner/docs/advanced/artifacts)). 

<Details><template v-slot:header>
The abi.json file content  
</template><template v-slot:body>

```json:no-line-numbers
{
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "delta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "ChangeValue",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "delta",
          "type": "uint256"
        }
      ],
      "name": "dropError",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyUint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "myStrValue",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "delta",
          "type": "uint256"
        }
      ],
      "name": "updateMyUint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}
```

</template>
</Details>

### Read a value


You can read the `myStrValue` string property using the code below. We will need to 
[initialize our SDK](./../sdk/installation.md#initialization) and use its `evm` object. 
To connect to the deployed smart contract, we need to call the 
`contractConnect` method and pass to it the contract address and its abi that we can store in a file. 

When the contract is found, we just specify our address that performs a transaction and specify which entity 
(the `myStrValue` variable) we need to access. 

```typescript:no-line-numbers
import {Sdk} from '@unique-nft/sdk'
import {KeyringProvider} from '@unique-nft/accounts/keyring'
import abiJSON from './abi.json'

async function main() {
  const account = await KeyringProvider.fromMnemonic(
    'bonus rubber price price initial finger finger finger scorpion pioneer pioneer pioneer'
  )
  const address = account.getAddress()

  const sdk = new Sdk({
    baseUrl: 'https://rest.unique.network/opal/v1', 
    signer: account,
  })

  const contractAddress = '0xf1917b3D87E0D355a29435A79a63670790E73Aa1'

  const contract = await sdk.evm.contractConnect(contractAddress, abiJSON.abi)

  const value = await contract.call({
    address,
    funcName: 'myStrValue',
  })

  console.log('The myStrValue value:', value)
}

main().catch((error) => {
  console.error(error)
})
```

### Call a function

Working with functions is quite similar as we described above. 
You can execute a function that does not require a transaction (marked `view`) using the following code. 

:exclamation: Numbers in EVM are represented in the `BigNumber` format.

```typescript:no-line-numbers
import {KeyringProvider} from '@unique-nft/accounts/keyring'
import abiJSON from './abi.json'
import Sdk from '@unique-nft/sdk'

async function main() {
  const account = await KeyringProvider.fromMnemonic(
    'bonus rubber price price initial finger finger finger scorpion pioneer pioneer pioneer'
  )
  const address = account.getAddress()

  const sdk = new Sdk({
    baseUrl: 'https://rest.unique.network/opal/v1', //  https://rest.unique.network/opal/v1 https://rest.unq.uniq.su/v1
    signer: account,
  })

  const contractAddress = '0xf1917b3D87E0D355a29435A79a63670790E73Aa1'

  const contract = await sdk.evm.contractConnect(contractAddress, abiJSON.abi)

  const value = await contract.call({
    address,
    funcName: 'getMyUint',
  })

  console.log('The getMyUint returns value:', value)
}

main().catch((error) => {
  console.error(error)
})
```

### Send a transaction

If you want to make a request that makes changes in the chain state, you need to execute the transaction.
But, to make it execute, you must sign it.

```typescript:no-line-numbers
import Sdk, { Options } from '@unique-nft/sdk';
import {KeyringProvider} from '@unique-nft/accounts/keyring';

For example, to execute the `updateMyUint` method, you can use the following code:

```typescript:no-line-numbers
import {Sdk} from '@unique-nft/sdk'
import {KeyringProvider} from '@unique-nft/accounts/keyring'
import abiJSON from './abi.json'

async function main() {
  const account = await KeyringProvider.fromMnemonic(
    'bonus rubber price price initial finger finger finger scorpion pioneer pioneer pioneer'
  )
  const address = account.getAddress()

  const sdk = new Sdk({
    baseUrl: 'https://rest.unique.network/opal/v1',
    signer: account,
  })


  const contractAddress = '0xf1917b3D87E0D355a29435A79a63670790E73Aa1'
  const contract = await sdk.evm.contractConnect(contractAddress,abi,);


  const contract = await sdk.evm.contractConnect(contractAddress, abiJSON.abi)

  const result = await contract.send.submitWaitResult(
    {
      address,
      funcName: 'updateMyUint',
      args: [1],
    },
    {
      signer: account,
    }
  )

  console.log(result)
}

main().catch((error) => {
  console.error(error)
})
```

#### Arguments interface 

The arguments for the `send` method are the following: 

```typescript:no-line-numbers
interface EvmSendArguments {
  address: string; // a Substrate address to sign a transaction
  funcName: string; // a function name in smart contract
  args?: any[]; // an array of arguments that are passed to the function

  value?: number | string; // the money amount is required to be transferred to the smart contract
  gasLimit?: number | string; // the gas limit you want to spend on a function
  maxFeePerGas?: number | string; // EIP-1559 Max base fee the caller want to pay
  maxPriorityFeePerGas?: number | string; // EIP-1559 Priority fee the caller pays to the block author
}
```

#### Parse events

If your smart contract emits events, you will be able to receive them when the transaction is completed using 
these properties:

`result.parsed.parsedEvents` - events that were successfully read and translated into a readable form.

`result.parsed.unknownEvents` - events that could not be read. Events cannot be read, for example, 
if there is no description of this event in the ABI file, or the description is incorrect.

```typescript:no-line-numbers
const result = await contract.send.submitWaitResult({
  address: account.getAddress(),
  funcName: 'updateMyUint',
  args: [1],
});

console.log('Parsed Events: ', result.parsed.parsedEvents);
console.log('Unknown Events: ', result.parsed.unknownEvents);
```

### Possible errors

###### EvmArgumentsError

The error may occur due to the fact that the arguments passed to the function do not match the description in the ABI, 
or the specified function name is missed in the ABI file.

###### EvmCallError

The error usually occurs in a smart contract using the `revert()` method with no arguments. 

###### EvmCustomError

This is a custom error from the smart contract that can be thrown in Solidity in the following way:

```solidity:no-line-numbers
revert MyCustomError({
  errorMessage: "my custom error message",
  myData: {
    ...
  }
});
```

###### EvmPanicError

An unexpected error in a smart contract. The example of such an error could be, for example, division by 0 
or accessing an array with an index greater than the size of the array.
A complete list of such errors and their codes can be found in the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.18/control-structures.html#panic-via-assert-and-error-via-require).

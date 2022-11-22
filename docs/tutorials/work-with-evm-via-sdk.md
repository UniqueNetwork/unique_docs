# Evm in sdk

## Sample smart contract

How to execute smart contract methods and read their properties using EVM.

### Solidity code
Consider, for example, such a smart contract written in the Solidity language:

```solidity
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

This smart contract is published on the opal network, at: `0x60639DB997DAAeD16111998a45a4D6450809aB6A`.

### ABI JSON

To make any request to a smart contract, you will need an ABI JSON file. This file describes all the methods and properties that are in your smart contract.


For example, such an ABI file describes one function myStrValue without parameters, which returns string values:
```json
[{
    "inputs": [],
    "name": "myStrValue",
    "outputs":
    [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}]
```

The [smart contract above](#solidity-code) is described by the following ABI file, which we will use in subsequent tests:
<details>
<summary>ABI JSON</summary>

```json
[
  {
    "anonymous": false,
    "inputs":
    [
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
    "inputs":
    [
      {
        "internalType": "uint256",
        "name": "delta",
        "type": "uint256"
      }
    ],
    "name": "dropError",
    "outputs":
    [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs":
    [
      {
        "internalType": "uint256",
        "name": "delta",
        "type": "uint256"
      }
    ],
    "name": "updateMyUint",
    "outputs":
    [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs":
    [],
    "name": "getMyUint",
    "outputs":
    [
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
    "inputs":
    [],
    "name": "myStrValue",
    "outputs":
    [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
```

</details>

### Reading value

You can read a string property `myStrValue` using the following code:

```javascript
import { Sdk } from '@unique-nft/sdk';

const sdk = new Sdk({
  baseUrl: 'https://rest.unique.network/opal/v1'
});

const address = '<your substrate address>';
const abi = ['<ABI JSON here>'];
const contractAddress = '0x60639DB997DAAeD16111998a45a4D6450809aB6A';

async function main() {
  const contract = await client.evm.contractConnect(
    contractAddress,
    abi,
  );
  
  const value = await contract.call({  
    address,
    funcName: 'myStrValue',
  });

  console.log('myStrValue value:', value);
}
main();
```
1) `abi` - ABI JSON of your contract
2) `contractAddress` - Ethereum address of your contract
3) `address` - Your substrate address
4) `funcName` - Property name in your contract

### Call function

You can execute a function that does not require a transaction(marked `view`) using the following code:
```javascript
import { Sdk } from '@unique-nft/sdk';

const sdk = new Sdk({
  baseUrl: 'https://rest.unique.network/opal/v1'
});

const address = '<your substrate address>';
const abi = ['<ABI JSON here>'];
const contractAddress = '0x60639DB997DAAeD16111998a45a4D6450809aB6A';

async function main() {
  const contract = await client.evm.contractConnect(
    contractAddress,
    abi,
  );
  
  const value = await contract.call({
    address,
    funcName: 'getMyUint',
  });

  console.log('getMyUint value:', value);
}

main();
```
Numbers in evm are returned in BigNumber format.

### Send transaction
If you want to make a request that makes changes to the chain, you need to execute the transaction by first signing it.
For example, to execute the `updateMyUint` method, use the following code:

```javascript
import { Sdk, Options } from '@unique-nft/sdk';
import {KeyringProvider} from '@unique-nft/accounts/keyring';

const seed = '<your seed>';

const options: Options = {
  baseUrl: 'https://rest.unique.network/opal/v1'
};
const sdk = new Sdk(options);

async function main() {
  const provider = new KeyringProvider({type: 'sr25519'});
  await provider.init();
  
  const account = provider.addSeed(seed);

  const contract = await client.evm.contractConnect(
    contractAddress,
    abi,
  );

  const result = await contract.send.submitWaitResult({
    address: account.getAddress(),
    funcName: 'updateMyUint',
    args: [1],
  }, {
    signer: account,
  });

  console.log('result', result);
}

main();
```

#### Arguments

```typescript

interface EvmSendArguments {
  address: string;
  funcName: string;
  args?: any[];
  
  value?: number | string;
  gasLimit?: number | string;
  maxFeePerGas?: number | string;
  maxPriorityFeePerGas?: number | string;
}
```

* `address` - Substrate address for sign
* `funcName` - Function name in smart contract
* `args` - Array of arguments to pass to the function
* `value` - The amount of money that needs to be transferred to the smart contract
* `gasLimit` - The gas limit you are willing to spend on a function
* `maxFeePerGas` - EIP-1559 Max base fee the caller is willing to pay
* `maxPriorityFeePerGas` - EIP-1559 Priority fee the caller is paying to the block author


### Parse Events

If your smart contract emits events, you will be able to receive them after the transaction in the properties:
* result.parsed.parsedEvents - Events that managed to be read and translated into a readable form
* result.parsed.unknownEvents - Events that could not be read. Events may not be read, for example, if there is no description of this event in the ABI file, or the description is incorrect

```javascript
const result = await contract.send.submitWaitResult({
  address: account.getAddress(),
  funcName: 'updateMyUint',
  args: [1],
});

console.log('parsedEvents', result.parsed.parsedEvents);
console.log('unknownEvents', result.parsed.unknownEvents);
```

 
### Error types

#### EvmArgumentsError
The error is due to the fact that the arguments passed to the function do not match the description in the ABI, or the specified function name is simply missing in the ABI file.

#### EvmCallError
An error was thrown in a smart contract using the `revert()` method with no arguments, or a string describing the error was passed as an argument.

#### EvmCustomError
This is a custom error from the smart contract that can be thrown in solidity in the following way:
```solidity
revert MyCustomError({
    errorMessage: "my custom error message",
    myData: {
        ...  
    }
});
``` 

#### EvmPanicError
An unexpected error in a smart contract, an example of such an error could be, for example, division by 0 or accessing an array with an index greater than the size of the array.
A complete list of such errors and their codes can be found in the Solidity documentation:
https://docs.soliditylang.org/en/v0.8.16/control-structures.html#panic-via-assert-and-error-via-require
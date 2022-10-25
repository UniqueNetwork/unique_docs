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

const abi = ['<ABI JSON here>'];
const contractAddress = '0x60639DB997DAAeD16111998a45a4D6450809aB6A';

async function main() {
  const value = await sdk.evm.call({  
    address: '5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX',
    abi,
    contractAddress,
    funcName: 'myStrValue',
  });

  console.log('myStrValue value:', value);
}
main();
```
1) `address` - Your substrate address
2) `abi` - ABI JSON of your contract
3) `contractAddress` - Ethereum address of your contract
4) `funcName` - Property name in your contract

### Call function

You can execute a function that does not require a transaction(marked `view`) using the following code:
```javascript
import { Sdk } from '@unique-nft/sdk';

const sdk = new Sdk({
  baseUrl: 'https://rest.unique.network/opal/v1'
});

const abi = ['<ABI JSON here>'];
const contractAddress = '0x60639DB997DAAeD16111998a45a4D6450809aB6A';

async function main() {
  const value = await sdk.evm.call({
    address: '5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX',
    abi,
    contractAddress,
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

  const result = await sdk.evm.send.submitWaitResult({
    address: account.getAddress(),
    abi,
    contractAddress,
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
  abi: Abi;
  contractAddress: string;
  funcName: string;
  args?: any[];
  
  value?: number | string;
  gasLimit?: number | string;
  maxFeePerGas?: number | string;
  maxPriorityFeePerGas?: number | string;
}
```

* `address` - Substrate address for sign
* `abi` - ABI JSON file your smart contract
* `contractAddress` - Ethereum your smart contract
* `funcName` - Function name in smart contract
* `args` - Array of arguments to pass to the function
* `value` - The amount of money that needs to be transferred to the smart contract
* `gasLimit` - The gas limit you are willing to spend on a function
* `maxFeePerGas` - EIP-1559 Max base fee the caller is willing to pay
* `maxPriorityFeePerGas` - EIP-1559 Priority fee the caller is paying to the block author


### Parse Events
 
### Parse Errors

If an error occurred while executing the send method in the contract, you will get a property as a result of executing the method indicating that the transaction has failed:

```javascript
const params = {...};
const result = await sdk.evm.send.submitWaitResult(params);
console.log('executed failed:', result.parsed.isExecutedFailed);
```

To find out the cause of the crash, you must execute a call request with the same parameters:

```javascript
const params = {...};
const result = await sdk.evm.send.submitWaitResult(params);
if (result.parsed.isExecutedFailed) {
  try {
    await sdk.evm.call(params);
  } catch(err) {
    console.log('error', err.message, err.details);
  }
}
```


For example, if in our contract you call the dropError method with a parameter of 0, we will get an error:

```javascript
import { Sdk } from '@unique-nft/sdk';
import {KeyringProvider} from '@unique-nft/accounts/keyring';

const sdk = new Sdk({
  baseUrl: 'https://rest.unique.network/opal/v1'
});

const abi = ['<ABI JSON here>'];
const contractAddress = '0x60639DB997DAAeD16111998a45a4D6450809aB6A';
const seed = '<your seed>';

async function main() {
  const provider = new KeyringProvider({type: 'sr25519'});
  await provider.init();

  
  const account = provider.addSeed(seed);

  const sendData = {
    address: account.getAddress(),
    abi,
    contractAddress,
    funcName: 'dropError',
    args: [0],
  };

  const result = await sdk.evm.send.submitWaitResult(sendData, {
    signer: account,
  });

  if (result.parsed.isExecutedFailed) {
    try {
      await sdk.evm.call(sendData);
    } catch(err) {
      console.log(err.message, err.details);
    }
  }
}

main();
```

Result:
```text
Divide or modulo by zero. {
  data: '0x4e487b710000000000000000000000000000000000000000000000000000000000000012',
  code: -32603,
  name: 'RpcError',
  callData: { funcName: 'dropError', args: [ 0 ] }
}
```

:warning: If you are not sure that your transaction will be successfully completed, in order not to waste gas on an erroneous transaction, you can execute a call request before the send transaction, and if the request did not fail, then execute the send request.
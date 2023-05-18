# EVM in SDK

In this tutotial, we will execute smart contract methods and read their properties using EVM in our SDK.

### Sample smart contract

We will use the following smart contract written in the Solidity language:

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

This smart contract is published on the Opal network, at: ``0x60639DB997DAAeD16111998a45a4D6450809aB6A``.

### Smart contract ABI

To make any request to a smart contract, you will need an ABI JSON file. This file describes all the methods and properties that are in your smart contract.

For example, such an ABI file describes the ``myStrValue`` function without arguments, which returns a string value:

```json:no-line-numbers
[{
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
}]
```

The [smart contract above](#sample-smart-contract) is described by the following ABI file, which we will use further:

<Details><template v-slot:header>
ABI JSON
</template><template v-slot:body>

```json
[
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
    "outputs": [ ],
    "stateMutability": "nonpayable",
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
    "outputs": [ ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ ],
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
]
```

</template>
</Details>

### Read a value

You can read a string property `myStrValue` using the following code:

```typescript:no-line-numbers
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
`abi` - ABI JSON of your contract.

`contractAddress` - Ethereum address of your contract.

`address` - your Substrate address.

`funcName` - property name in your contract.

### Call a function

You can execute a function that does not require a transaction (marked `view`) using the following code:

```typescript:no-line-numbers
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
Numbers in EVM are returned in the `BigNumber` format.

### Send a transaction
If you want to make a request that makes changes in the chain state, you need to execute the transaction. But, before executing it, you must sign it.
For example, to execute the `updateMyUint` method, you can use the following code:

```typescript:no-line-numbers
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
  }, 
  {
    signer: account,
  }
);

console.log('result', result);
}

main();
```

#### Arguments

```typescript:no-line-numbers
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

`address` - a Substrate address to sign a transaction.

`funcName` - a function name in smart contract.

`args` - an array of arguments that are passed to the function.

`value` - the money amount is required to be transferred to the smart contract.

`gasLimit` - the gas limit you want to spend on a function.

`maxFeePerGas` - EIP-1559 Max base fee the caller want to pay. 

`maxPriorityFeePerGas` - EIP-1559 Priority fee the caller pays to the block author. 


### Parse events

If your smart contract emits events, you will be able to receive them after the transaction in the properties:

`result.parsed.parsedEvents` - events that were succesufully read and translated into a readable form.

`result.parsed.unknownEvents` - events that could not be read. Events may not be read, for example, if there is no description of this event in the ABI file, or the description is incorrect.

```typescript:no-line-numbers
const result = await contract.send.submitWaitResult({
  address: account.getAddress(),
  funcName: 'updateMyUint',
  args: [1],
});

console.log('parsedEvents', result.parsed.parsedEvents);
console.log('unknownEvents', result.parsed.unknownEvents);
```


### Possible errors

##### EvmArgumentsError
The error may occur due to the fact that the arguments passed to the function do not match the description in the ABI, or the specified function name is missed in the ABI file.

##### EvmCallError
The error is usually occurs in a smart contract using the `revert()` method with no arguments. 

##### EvmCustomError
This is a custom error from the smart contract that can be thrown in Solidity in the following way:

```solidity:no-line-numbers
revert MyCustomError({
  errorMessage: "my custom error message",
  myData: {
    ...
  }
});
```

##### EvmPanicError

An unexpected error in a smart contract. The example of such an error could be, for example, division by 0 or accessing an array with an index greater than the size of the array.
A complete list of such errors and their codes can be found in the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.16/control-structures.html#panic-via-assert-and-error-via-require).
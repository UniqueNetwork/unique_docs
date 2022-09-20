# REST API examples

Here we will show how to create collection with pure REST service,
without any specific programming language.

The main tool here will be curl. Also we will use node to parse JSON and extract necessary data from response.

Important: some tool is needed to sign the extrinsic (a transaction) with SR25519 algorithm.
It can be done with some user tool for noncustodial solution, 
or REST service can sign an extrinsic if a custodial solution is appropriate in some case. 

Also we will need a Substrate account (mnemonic seed phrase and address) 
which can be created with the Polkadot.js extension
as it shown [here](/sdk-guides/createAccount).
This account should have some balance to create collection (2-2.5 OPL). [Our faucet telegram bot](https://t.me/unique2faucet_opal_bot) 

## Pure REST (curl) example

The lifecycle of a extrinsic (or transaction in non-Substrate terminology) contains of:
1. request the REST service to build extrinsic
2. sign extrinsic
3. submit signed extrinsic

Here we will use custodial solution to make the example as simple as possible.
Let's see how to perform these steps one by one.

```bash
apiUrl="https://rest.unique.network/opal/v1"
mnemonic="bus ahead nation nice damp recall place dance guide media clap language"
address="5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX"

# Build extrinsic
buildResult=`curl -s -X 'POST' \
  "${apiUrl}/collections?use=Build" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Test collection",
  "description": "My test collection",
  "tokenPrefix": "TST",
  "address": "'${address}'"
}'`
signerPayloadJSON=`node -e "console.log(JSON.stringify(JSON.parse('$buildResult').signerPayloadJSON))"`
signerPayloadHex=`node -e "console.log(JSON.stringify(JSON.parse('$buildResult').signerPayloadHex))"`


# Sign extrinsic
signResult=`curl -s -X 'POST' \
  "${apiUrl}/collections?use=Sign" \
  -H "accept: application/json" \
  -H "Authorization: Seed ${mnemonic}" \
  -H "Content-Type: application/json" \
  -d '{
    "signerPayloadJSON": '${signerPayloadJSON}',
    "signerPayloadHex": '${signerPayloadHex}'
  }'`
signature=`node -e "console.log(JSON.parse('$signResult').signature)"`


# Submit extrinsic
submitResult=`curl -s -X 'POST' \
  "${apiUrl}/collections?use=SubmitWatch" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "signerPayloadJSON": '${signerPayloadJSON}',
    "signature": "'${signature}'"
  }'`
hash=`node -e "console.log(JSON.parse('$submitResult').hash)"`

# Check status extrinsic by hash
echo "status: $apiUrl/extrinsic/status?hash=$hash"
```

After, we need to wait some time (maybe check in cycle with some delay) and check the status with the link
from the last script

## Programming language example

We have an JS/TS SDK and some other languages are coming soon.  
But what if you use some language that there still is no SDK for?

Here is an example how to work with the REST API in pure Javascript.  
While we provide a ready to use JS/TS SDK, Javascript is current lingua franca, 
so let's use it as an example to show how to use the REST API in any language.

Only one thing you will need is a SR25519 signer to sign extrinsic.  
Here we use `@polkadot/util-crypto` on purpose, to avoid signing with `@polkadot/api`
because it is a highlevel solutuin, while util-crypto provides just several atomic operations
to show it used here only for signing some binary data as blackbox, without dealing with its contents.

Packages used in this example:
- [@polkadot/node-fetch](https://www.npmjs.com/package/@polkadot/node-fetch)
- [@polkadot/util](https://www.npmjs.com/package/@polkadot/util)
- [@polkadot/util-crypto](https://www.npmjs.com/package/@polkadot/util-crypto)

```ts
import fetch from 'node-fetch';
import {
  u8aToHex
} from '@polkadot/util';
import {
  sr25519Sign,
  mnemonicToMiniSecret,
  sr25519PairFromSeed,
} from '@polkadot/util-crypto';

const mnemonic = 'bus ahead nation nice damp recall place dance guide media clap language';
const address = '5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX';
const restUrl = 'https://rest.opal.uniquenetwork.dev/v1';


////////////////////////////////////////////////////////////////////////////
// Call a request in rest-api
////////////////////////////////////////////////////////////////////////////

function callApi(path, payload) {
  const url = `${restUrl}/${path}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload)
  }).then(res => res.json());
}

////////////////////////////////////////////////////////////////////////////
// Build extrinsic
////////////////////////////////////////////////////////////////////////////
async function buildExtrinsic() {
  const payload = {
    address,
    mode: "Nft",
    name: "Sample collection name",
    description: "sample collection description",
    tokenPrefix: "TEST"
  };
  
  const {
    signerPayloadJSON, 
    signerPayloadHex, 
    error 
  } = await callApi(`collections?use=Build`, payload);

  if (error) {
    console.error('build extrinsic error', error);
    process.exit(-1);
  }

  return {
    signerPayloadJSON,
    signerPayloadHex
  }
}


////////////////////////////////////////////////////////////////////////////
// Signing extrinsic
////////////////////////////////////////////////////////////////////////////

const TYPE_PREFIX = {
  ecdsa: '02',
  ed25519: '00',
  ethereum: '02',
  sr25519: '01'
};
function signExtrinsic(signerPayloadHex) {
  const seed = mnemonicToMiniSecret(mnemonic);

  const {
    publicKey,
    secretKey,
  } = sr25519PairFromSeed(seed);

  const signatureBytes = sr25519Sign(signerPayloadHex, {
    publicKey,
    secretKey,
  });
  const signature = u8aToHex(signatureBytes);

  return `0x${TYPE_PREFIX.sr25519}${signature.substring(2)}`;
}


////////////////////////////////////////////////////////////////////////////
// Submit extrinsic
////////////////////////////////////////////////////////////////////////////
async function submitExtrinsic(signerPayloadJSON, signature) {
  const payload = {
    signerPayloadJSON,
    signature
  };
  const { hash, error } = await callApi(`collections?use=SubmitWatch`, payload);

  if (error) {
    console.log('submit extrinsic error', error);
    process.exit(-1);
  }

  return hash;
}

////////////////////////////////////////////
// entrypoint
////////////////////////////////////////////
async function main() {
  const { signerPayloadJSON, signerPayloadHex } = await buildExtrinsic();

  const signature = signExtrinsic(signerPayloadHex);

  const hash = await submitExtrinsic(signerPayloadJSON, signature);

  console.log('get status url', `${restUrl}/extrinsic/status?hash=${hash}`);
}

main();
```
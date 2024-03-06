# REST API examples

REST service calls are a language independent set of methods that facilitate communication between a client and a server. Unique Network provides such a REST service as a language-independent means to interact with the blockchain.

To see this in action, let's create a Collection using pure REST service calls. The main tool that will be used to accomplish this will be *curl*. Out of convenience Node.js will be utilized to parse the JSON formatted server responses and extract necessary data from them.

Important note: interacting with the blockchain requires user interaction in cases where signing of an extrinsic (a transaction) is necessary. Signing requires a client-side utility that can invoke SR25519 encryption methods needed to perform this in case of non-custodial solutions. For custodial solutions there are cases where the REST service can be invoked to perform this action.

But before we dive into the code we'll need to create a Substrate account to use in this example. Since we will need to provide the *mnemonic seed* and the *wallet address* at some point remember to make a note of these two data items during the creation process. The instructions for creating an account with the Polkadot.js wallet browser extension can be found [here](/sdk-guides/createAccount). And, since some Opal tokens are required to pay for the transaction fees as well(around 2 to 2.5 OPL) these can be obtained via a [Telegram faucet bot](https://t.me/unique2faucet_opal_bot).

## Pure REST (curl) example

The lifecycle of an extrinsic is:

1. request the REST service to build the extrinsic
2. sign the extrinsic
3. submit the signed extrinsic

For this example a custodial solution will be considered as it provides the most straightforward approach.

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

At this point the transaction is submitted for processing and if needed a periodic status request can be looped in a cycle.

## Programming language example

It would be tempting to show an example of how easy it is to apply an Unique JS/TS SDK to accomplish this (this also stands in the case of future SDKs for languages other than JS/TS), but a much more compelling case for a programming language example would be to illustrate how to use the REST service in a 'pure' language case with no SDK support.

A fitting language for this is Javascript as it is a very widely adopted language and will provide a good basis for understanding the example code as it provides the structure for implementing this approach in any other language.

As was mentioned earlier, a non-custodial approach will require an SR25519 signer procedure to sign an extrinsic.

To illustrate this functionality at the core level we will avoid using the high-level `@polkadot/api` library and opt for the low-level `@polkadot/util-crypto` one instead to perform the signing. It is, in contrast to the api, rudimentary and contains just a set of atomic functions which will be invoked to sign a binary data chunk (treating it as a black box, ignoring its contents).

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
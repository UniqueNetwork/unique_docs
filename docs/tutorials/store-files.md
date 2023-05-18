# (Duplicate) How to store files 

### SDK

Install the [SDK](https://www.npmjs.com/package/@unique-nft/sdk) package.

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install @unique-nft/sdk
```

  </CodeGroupItem>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add @unique-nft/sdk
```

  </CodeGroupItem>
</CodeGroup>

In the `baseUrl` parameter, you need to pass one of the following URLs depending on which parachain you want to work with.

Opal - `https://rest.unique.network/opal`   

Quartz - `https://rest.unique.network/quartz` 

Unique - `https://rest.unique.network/unique` 

```typescript:no-line-numbers
import { Sdk } from '@unique-nft/sdk';

const baseUrl = 'https://rest.unique.network/opal';

const main = async () => {
  const uploadFile = async (file) => {
    const options = { baseUrl };
    const client = new Sdk(options);

    // the "uploadZip" method can be used to upload archives
    return client.ipfs.uploadFile({ file });
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = document.querySelector('#nftFile').files[0];
    const response = await uploadFile(file);
    document.querySelector('#response').innerText = JSON.stringify(
      response,
      null,
      4,
    );
  });
};

main();
```

### REST libraries

```typescript:no-line-numbers
import { createReadStream } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import mime from 'mime-types';

const filename = '<path_to_file>';

const URL = 'https://rest.unique.network/opal/v1/ipfs/upload-file';
const form = new FormData();
form.append(
  'file',
  createReadStream(filename),
  {
    contentType: mime.lookup(filename) as string,
    filename,
  },
);

const result = fetch(URL, { method: 'POST', body: form });
```

After uploading a file, we get a response from a server with an IPFS Cid:

```json:no-line-numbers
{
  "cid": "Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1",
  "fileUrl": "https://ipfs.unique.network/ipfs/Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1"
}
```
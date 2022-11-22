# NFTs. How to store images/videos/etc.

You can use the following methods to upload files:

- [SDK](#sdk)
- [Rest](#rest)

## Sdk

Install package [sdk](https://www.npmjs.com/package/@unique-nft/sdk).

```bash
npm i @unique-nft/sdk --save
```

#### In the baseUrl parameter, you must pass one of the paths to the Unique Network

1) Opal https://rest.unique.network/opal
2) Quartz https://rest.unique.network/quartz
3) Unique https://rest.unique.network/unique

```typescript
  import { Sdk } from '@unique-nft/sdk';

  const baseUrl = 'https://rest.unique.network/opal';

  const main = async () => {
    const uploadFile = async (file) => {
      const options = { baseUrl };
      const client = new Sdk(options);

      // uploadZip - to upload archives
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

## Rest

```typescript
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

After uploading file we are getting response from server with IPFS Cid:

```json
{
  "cid": "Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1",
  "fileUrl": "https://ipfs.unique.network/ipfs/Qmc1Dj8m4z2vcojjJjp348FKffmSjopSFTgATpU8gUx5k1"
}
```
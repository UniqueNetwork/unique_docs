# Websocket subscriptions

### Connect to the client

In this tutorial, we will using the [Socket.IO client](https://socket.io/docs/v4/client-initialization/) library. So first of all, you need to install it: 

<CodeGroup>
  <CodeGroupItem title="NPM"  active>

```bash:no-line-numbers
npm install socket.io-client
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add socket.io-client
```

</CodeGroupItem>
</CodeGroup>

Then, you can import it to your project and initialize the client by the following code: 

```typescript:no-line-numbers
import { io } from 'socket.io-client';

const socket = io('https://rest.unique.network', {
  path: '/opal/socket.io',
  transports: ['websocket'],
});

socket.on('system', (room, data) => {
  console.log(room);
  console.log(data);
});
```

When the connection is established, you will receive a `system` event with the blockchain network information to which you connected. 

```typescript:no-line-numbers
{
  name: 'system'
}
{
  SS58Prefix: 42,
  token: 'OPL',
  decimals: 18,
  wsUrl: 'wss://ws-opal.unique.network',
  genesisHash: '0xc87870ef90a438d574b8e320f17db372c50f62beb52e479c8ff6ee5b460670b9'
}
```

### Headers

To receive events about new `headers`, you can subscribe the following way:

```typescript:no-line-numbers
socket.on('headers', (room, header) => {
  console.log(header);
});

socket.on('connect', () => {
  socket.emit('subscribe:headers');  
});
```

You will receive the `header` object that contains these fields:

```typescript:no-line-numbers
interface HeaderResult {
  hash: string;
  parentHash: string;
  number: string;
  stateRoot: string;
  extrinsicsRoot: string;
  digest: object;
}
```

### Blocks

To receive events about new `blocks`, you can subscribe the following way:

```typescript:no-line-numbers
socket.on('blocks', (room, block) => {
  console.log(block);
});

socket.on('connect', () => {
  socket.emit('subscribe:blocks');  
});
```

You will receive еру `block` object that contains these fields:

```typescript:no-line-numbers
interface BlockResult {
  hash: string;
  header: HeaderResult;
}
```

### Extrinsics

To receive events about new `extrinsics`, you can subscribe the following way:

```typescript:no-line-numbers
socket.on('extrinsics', (room, extrinsic) => {
  console.log(extrinsic);
});

socket.on('connect', () => {
  socket.emit('subscribe:extrinsics');  
});
```

You will receive a `extrinsic` object that contains these fields:

```typescript:no-line-numbers
interface ExtrinsicResultResponse {
  isCompleted: boolean;
  hash: string;
  blockIndex: number;
  error: object;
  events: ExtrinsicResultEvent[];
  parsed?: object;
  fee?: FeeResponse;
  callbackUrl: string;
  createdAt: number;
  block: BlockResult;
  callMethod: MethodName;
}
```

##### Extrinsic filtering

You can filter extrinsics by specifying the collection id.

In the example below, you will only get extrinsics from collection #123:

```typescript:no-line-numbers
socket.on('extrinsics', (room, extrinsic) => {
  console.log(extrinsic);
});

socket.on('connect', () => {
  socket.emit('subscribe:extrinsics', {
      collectionId: 123,
  });  
});
```

To get extrinsics from any collection, you can use this filter:

```typescript:no-line-numbers
socket.on('extrinsics', (room, extrinsic, block) => {
  console.log(extrinsic);
});

socket.on('connect', () => {
  socket.emit('subscribe:extrinsics', {
      collectionId: '*',
  });  
});
```

### Events

To receive events about new `events`, you can subscribe the following way:

```typescript:no-line-numbers
socket.on('events', (room, event, extrinsic, block) => {
  console.log(event);
});

socket.on('connect', () => {
  socket.emit('subscribe:events');
});
```

You will receive a `event` object that contains these fields:

```typescript:no-line-numbers
interface ExtrinsicResultEvent {
  section: string;
  method: string;
  data: object;
  meta: object;
  index: string;
}
```

##### Events filtering

You can filter the `events` stream to receive events from a specific section and method.

The following example will display only the token creation events:

```typescript:no-line-numbers
socket.on('events', (room, event, extrinsic, block) => {
  console.log(event);
});

socket.on('connect', () => {
  socket.emit('subscribe:events', {
    method: 'ItemCreated',
    section: 'common',
  });
});
```

As values for the `method` and `section` fields, you can specify the "*" character which will mean any value.
For example, the following filter will return all events from the `common` section.

```typescript:no-line-numbers
socket.on('events', (room, event, extrinsic, block) => {
  console.log(event);
});
socket.on('connect', () => {
  socket.emit('subscribe:events', {
    method: '*',
    section: 'common',
  });
});
```
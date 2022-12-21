# Websocket subscriptions

## Connect with socket.io-client

```typescript
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
In this example, immediately after the connection is established, you will receive a `system` event, with the blockchain information of the network to which you are connected:
```text
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

To receive events about new `headers`, subscribe as follows:

```typescript
socket.on('headers', (room, header) => {
  console.log(header);
});
socket.on('connect', () => {
  socket.emit('subscribe:headers');  
});
```

You will receive a `header` object containing the following fields:
```
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

To receive events about new `blocks`, subscribe as follows:

```typescript
socket.on('blocks', (room, block) => {
  console.log(block);
});
socket.on('connect', () => {
  socket.emit('subscribe:blocks');  
});
```

You will receive a `block` object containing the following fields:
```
interface BlockResult {
  hash: string;
  header: HeaderResult;
}
```

### Extrinsics

To receive events about new `extrinsics`, subscribe as follows:

```typescript
socket.on('extrinsics', (room, extrinsic) => {
  console.log(extrinsic);
});
socket.on('connect', () => {
  socket.emit('subscribe:extrinsics');  
});
```

You will receive a `extrinsic` object containing the following fields:
```
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

#### Extrinsic filtering

You can filter extrinsics by specifying the id of the collection.

For example, in the following example, you will only get extras from collection 123:
```typescript
socket.on('extrinsics', (room, extrinsic) => {
  console.log(extrinsic);
});
socket.on('connect', () => {
  socket.emit('subscribe:extrinsics', {
      collectionId: 123,
  });  
});
```

To get extrinsics from any collection, write a filter like this:
```typescript
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

To receive events about new `events`, subscribe as follows:

```typescript
socket.on('events', (room, event, extrinsic, block) => {
  console.log(event);
});
socket.on('connect', () => {
  socket.emit('subscribe:events');
});
```

You will receive a `event` object containing the following fields:
```
interface ExtrinsicResultEvent {
  section: string;
  method: string;
  data: object;
  meta: object;
  index: string;
}
```

#### Events filtering
You can filter the event stream to receive, for example, events from a specific section and method.

The following example will only show you the token creation events:
```typescript
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

As values for the `method` and `section` fields, you can specify the character "*" to mean any value.
For example, this filter will return all events from the `"common"` section.
```typescript
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
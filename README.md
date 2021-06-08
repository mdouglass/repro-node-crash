# Steps to Reproduce
1. Run `npm ci`
2. Run `npm start server`
3. Run `npm start client`

# Expected
```
$ npm run client

> server@1.0.0 client
> node client.js

duplexEcho response: { message: 'Hello duplex world!' }
unaryEcho response: { message: 'Hello unary world!' }
duplexEcho error Error: 1 CANCELLED: Cancelled on client
    at Object.callErrorFromStatus (/home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/call.js:31:26)
    at Object.onReceiveStatus (/home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/client.js:390:49)
    at Object.onReceiveStatus (/home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:299:181)
    at /home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/call-stream.js:145:78
    at processTicksAndRejections (node:internal/process/task_queues:78:11)
duplexEcho status {
  code: 1,
  details: 'Cancelled on client',
  metadata: Metadata { internalRepr: Map(0) {}, options: {} }
}
```

# Actual
```
$ npm run client

> server@1.0.0 client
> node client.js

duplexEcho response: { message: 'Hello duplex world!' }
unaryEcho response: { message: 'Hello unary world!' }
duplexEcho error Error: 1 CANCELLED: Cancelled on client
    at Object.callErrorFromStatus (/home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/call.js:31:26)
    at Object.onReceiveStatus (/home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/client.js:390:49)
    at Object.onReceiveStatus (/home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:299:181)
    at /home/matthew/spikes/repro-node-crash/node_modules/@grpc/grpc-js/build/src/call-stream.js:145:78
    at processTicksAndRejections (node:internal/process/task_queues:78:11)
duplexEcho status {
  code: 1,
  details: 'Cancelled on client',
  metadata: Metadata { internalRepr: Map(0) {}, options: {} }
}
free(): double free detected in tcache 2
[1]    693633 IOT instruction (core dumped)  npm run client
```

# Workaround
Comment out line 45 of client.js and comment in line 46

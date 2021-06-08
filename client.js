const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const assert = require('assert/strict')
const { once } = require('events')

async function unaryEcho(client, message) {
  await new Promise((resolve, reject) => {
    client.unaryEcho({ message }, new grpc.Metadata(), {}, (error, res) => {
      if (error) {
        reject(error)
      } else {
        assert.strictEqual(res.message, message, 'unaryEcho response incorrect')
        console.log('unaryEcho response:', res)
        resolve()
      }
    })
  })
}

async function duplexEcho(stream, message) {
  const promise = once(stream, 'data')
  stream.write({ message: 'Hello duplex world!' })
  const [res] = await promise
  assert.strictEqual(res.message, message, 'duplexEcho response incorrect')
  console.log('duplexEcho response:', res)
}

async function main() {
  const packageDef = await protoLoader.load('./echo-service.proto')
  const serviceDefinition = grpc.loadPackageDefinition(packageDef)

  const credentials = grpc.ChannelCredentials.createInsecure()
  const client = new serviceDefinition.EchoService('127.0.0.1:20000', credentials)

  const stream = client.duplexEcho(new grpc.Metadata(), {})
  stream.on('error', (error) => {
    console.error('duplexEcho error', error.stack)
  })
  stream.on('status', (status) => {
    console.log('duplexEcho status', status)
  })

  await duplexEcho(stream, 'Hello duplex world!')
  await unaryEcho(client, 'Hello unary world!')
  stream.cancel()
  // setImmediate(() => stream.cancel())
}

main().catch((e) => console.error(e.stack))

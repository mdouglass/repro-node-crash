const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')

async function main() {
  const packageDef = await protoLoader.load('./echo-service.proto')
  const serviceDefinition = grpc.loadPackageDefinition(packageDef)

  var server = new grpc.Server()
  server.addService(serviceDefinition.EchoService.service, {
    unaryEcho: (call, cb) => {
      console.log('unaryEcho request:', call.request)
      cb(null, { message: call.request.message })
    },
    duplexEcho: (call) => {
      call.on('data', (req) => {
        console.log('duplexEcho request:', req)
        call.write({ message: req.message })
      })
      call.on('error', (e) => {
        console.error('duplexEcho error:', e.stack)
        call.end()
      })
      call.on('end', () => {
        console.error('duplexEcho end')
        call.end()
      })
      call.on('cancelled', () => {
        console.error('duplexEcho cancelled')
        call.end()
      })
    },
  })

  return new Promise((_, reject) => {
    const credentials = grpc.ChannelCredentials.createInsecure()
    server.bindAsync('127.0.0.1:20000', credentials, (error, port) => {
      if (error) {
        return reject(error)
      }
      console.log(`EchoService listening on port ${port}`)
      server.start()
    })
  })
}

main().catch((e) => console.error(e.stack))

import http from 'http'
import socket from 'socket.io'

import apolloServer from './core/graphql'
import app from './app'
import mongoose from './core/mongo'
import conf from './core/config'
import { log } from './core/logger'

// include and initialize the rollbar library with your access token
// const Rollbar = require('rollbar')

// const rollbar = new Rollbar({
//   accessToken: 'f442d8c998864f629924b0f38fd4596a',
//   captureUncaught: true,
//   captureUnhandledRejections: true
// })

// record a generic message and send it to Rollbar
// rollbar.log('Hello world!')

const PORT = process.env.PORT || conf.get('PORT')

const server = http.Server(app)

mongoose.Promise = require('bluebird')

const io = socket(server)

apolloServer.installSubscriptionHandlers(server)
apolloServer.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: '*',
    credentials: true
  }
})


io.on('connection', connSocket => {
  log.info(`🐈 ID: ${connSocket.id} just connected.`)
  connSocket.emit('A', { HybridVersion: '1.0.1', stuff: 'ok' })
  connSocket.on('B', data => console.log(data)) // { foo: 'baz' }

  connSocket.on('Are you there?', () => {
    connSocket.emit('connection', { connection: true })
  })

  connSocket.join(`${connSocket.id}`)

  io.to(`${connSocket.id}`).emit('me?', `I add you as : ${connSocket.id}`)

  connSocket.on('subscribeToTimer', interval => {
    console.log('client is subscribing to timer with interval ', interval)
    setInterval(() => {
      connSocket.emit('timer', new Date())
    }, interval)
  })

  connSocket.on('disconnect', () => log.info('Somebody has disconnected'))
})

mongoose.connection.once('open', () => {
  log.info(`🔌 Mongoose has connected `)
})

// I have to refactor it for Mocha-Chai Tests
const Application = server.listen(PORT, () =>
  log.info(`⚡ Express Server has started at ${PORT} `)
)

server.on('error', err => {
  log.error(err)
})

server.on('close', () => {
  log.info(`⚡ Express server has closed `)
})

process.on('SIGINT', () => {
  io.close()
  mongoose.connection.close()
  server.close()
  process.exit(1)
})

process.on('SIGTERM', () => {
  log.info('SIGTERM signal received.')
  log.info('Closing http server.')
  server.close(() => {
    log.info('Http server closed.')
    mongoose.connection.close(false, () => {
      log.info('MongoDb connection closed. 🔌')
      io.close()
      process.exit(0)
    })
  })
})

process.on('exit', () => {
  log.info(`About to exit with Control + C`)
})

process.on('uncaughtException', e => {
  log.error(e)
  server.close()
  process.exit(1)
})

process.on('unhandledRejection', e => {
  log.error(e)
  server.close()
  process.exit(1)
})

// For Mocha-Chai Tests

const stop = () => {
  mongoose.connection.close()
  server.close()
}

export { io, Application, stop }

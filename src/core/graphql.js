import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'
import { RedisCache } from 'apollo-server-cache-redis'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import depthLimit from 'graphql-depth-limit'
import { giveTokenGetUser } from '~/middleware/utils'
import conf from './config'

import schema from '~/app/schema'
import createLoaders from '~/app/loader'

export const pubsub = new PubSub()

export default new ApolloServer({
  schema,
  introspection: conf.get('IS_DEV'),
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')

    return {
      ...error,
      message
    }
  },
  context: async ({ req, res }) => {
    let token = null
    let currentUser = null

    if (req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '').trim()
    } else if (req.signedCookies) {
      token = req.signedCookies.jwt
    }
    try {
      currentUser = await giveTokenGetUser(token)
    } catch (e) {
      // OOooooh boy. Actually I threw a error just like below.
      // But connot dedect on Frontend soooo
      //    throw new AuthenticationError(
      //      e.message
      //    )
      // I pass to like this to the middleware
      return { logged: false }

      // to see more check middleware/utils
    }
    req.user = currentUser
    const loaders = createLoaders()
    return {
      loaders,
      req,
      res,
      user: currentUser,
      userID: currentUser._id,
      clerance: currentUser.clerance,
      verified: currentUser.verified,
      logged: true
    }
  },
  schemaDirectives: {},
  playground: conf.get('IS_PROD')
    ? false
    : {
        settings: {
          'request.credentials': 'include',
          'schema.polling.enable': false,
          'editor.fontFamily': 'StevenMono'
        },
        tabs: [
          {
            endpoint: 'http://localhost:3000/graphql',
            query: `{
              showSingleAircraft(id:"5d793d2b0f3a39bb442c8a19") {
             registration
                model
                operator
            }
          }`
          }
        ]
      },
  subscriptions: {
    path: '/websocket',
    onDisconnect: rawSocket => {
      console.log(rawSocket)
    },
    onConnect: (connectionParams, rawSocket) => {
      console.log(connectionParams)
      console.log(rawSocket)
    }
  },
  maxFileSize: 25 * 1024 * 1024, // 25MB
  debug: conf.get('IS_DEV'),
  engine: true,
  tracing: true,
  validationRules: [depthLimit(10)],
  plugins: [
    responseCachePlugin({
      sessionId: ({ context }) => context.userID,
      shouldReadFromCache: ({ context }) => !context.logged,
      shouldWriteToCache: ({ context }) => !context.logged
    })
  ],
  cacheControl: {
    calculateHttpHeaders: false,
    // Cache everything for at least a minute since we only cache public responses
    defaultMaxAge: 240000
  },
  cache: new RedisCache({
    host: conf.get('REDIS_HOST'),
    port: conf.get('REDIS_PORT'),
    password: conf.get('REDIS_PASS') ? conf.get('REDIS_PASS') : null
  })
})

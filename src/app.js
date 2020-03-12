import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
// import cors from 'cors'
import passport from 'passport'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import path from 'path'
import routes from './core/express'
import conf from './core/config'
import { log } from './core/logger'

const MongoStore = require('connect-mongo')(session)
const eer = require('expeditious-engine-redis')
const ExpeditiousCache = require('express-expeditious')
const swStats = require('swagger-stats')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const uuidv1 = require('uuid/v1')

log.info(`Machine ID:  ${uuidv1()}`)

const swaggerDefinition = {
  openapi: '3.0.2',
  info: {
    title: 'Hybrid API',
    version: '1.0.0',
    description:
      'GraphQL / REST Hybrid API Documentation',
    license: {
      name: 'MIT',
      url: 'https://choosealicense.com/licenses/mit/'
    },
    contact: {
      name: 'Steven J. Selcuk',
      url: 'https://swagger.io',
      email: 'stevenjselcuk@gmail.com'
    }
  },
  host: 'http://localhost:3000',
  basePath: '/__/',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  servers: [
    {
      url: 'http://localhost:3000/__/'
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: ['./src/app/**/*.js']
}

const specs = swaggerJsdoc(options)

const RATE_LIMIT = conf.get('RATE_LIMIT') || 0

const app = express()

// Middlewares.
// app.use(
//   cors({
//     origin: '*',
//     allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
//     allowHeaders: ['Content-Type', 'Authorization'],
//     exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
//   })
// )

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

app.use(helmet())
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.disable('x-powered-by')

app.use(rateLimit({ max: Number(RATE_LIMIT), windowMs: 15 * 60 * 1000 }))
app.use(compression())

app.use(swStats.getMiddleware({ swaggerSpec: specs }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

export const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
})

app.use(
  session({
    store: sessionStore,
    name: conf.get('SESSION_NAME'),
    secret: conf.get('EXPRESS_SESSION_SECRET'),
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: true,
      httpOnly: true,
      secure: conf.get('IS_PROD')
    }
  })
)

const redisOptions = {
  host: conf.get('REDIS_HOST'),
  port: conf.get('REDIS_PORT'),
  // @TODO: I need really good solution for handle this.
  password: conf.get('REDIS_PASS') ? conf.get('REDIS_PASS') : ''
}

app.use(
  ExpeditiousCache({
    namespace: 'HybridAPICache',
    defaultTtl: '10 minute',
    engine: eer({ redis: redisOptions })
  })
)

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

app.use(cookieParser(conf.get('COOKIE_SECRET')))

morgan.token('user', req => {
  //  console.log(req)
  if (req.user) {
    //    console.log(req)
    return req.user.name
  }
  return 'Anonymous request'
})

if (conf.get('IS_PROD')) {
  app.use(morgan('combined'))
} else {
  app.use(
    morgan(':method :url :status :response-time ms - User: :user', {
      skip(req, res) {
        return res.statusCode >= 400
      },
      stream: { write: message => log.access(message) }
    })
  )
}

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) =>
  res
    .json({
      service: 'Hybrid API',
      system: 'OK',
      version: conf.get('VERSION'),
      session: req.session,
      cookie: req.signedCookies
    })
    .status(200)
)

app.get('/clear_cookie', (req, res) => {
  res.clearCookie('jwt')
  res.send('JWT Cookie has been removed').status(200)
})

app.use('/__', routes)

export default app

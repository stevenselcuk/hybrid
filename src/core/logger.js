import winston, { createLogger, format, transports } from 'winston'
import { Signale } from 'signale'
import conf from '~/core/config'

require('winston-mongodb')
require('express-async-errors')

const config = {
  levels: {
    access: 0,
    error: 1,
    debug: 2,
    warn: 3,
    data: 4,
    info: 5,
    verbose: 6,
    silly: 7
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'bold green',
    verbose: 'cyan',
    silly: 'magenta',
    access: 'yellow'
  }
}

winston.addColors(config.colors)

export const log = createLogger({
  levels: config.levels,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.colorize({ all: false }),
    format.simple()
  ),
  //  defaultMeta: { service: 'Coeus API' },
  transports: [
    new transports.File({
      filename: 'error.log',
      level: 'error',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      zippedArchive: false,
      options: { encoding: 'utf8' }
    }),
    new transports.File({
      filename: './logs/access.log',
      level: 'access',
      handleExceptions: false,
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      colorize: false,
      zippedArchive: false,
      options: { encoding: 'utf8' }
    }),
    new transports.File({ filename: './logs/info.log' })
    //    new transports.MongoDB({ db: MONGO_URL })
  ]
})

if (conf.get('IS_DEV') || conf.get('IS_TEST')) {
  log.add(
    new transports.Console({
      level: 'info',
      handleExceptions: true,
      json: true,
      format: format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(info => {
          const { timestamp, level, message, ...args } = info
          const ts = timestamp.slice(0, 19).replace('T', ' ')
          return `${ts}  [${level}]: ${message}
          ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
        })
      )
    })
  )
}

export const handleException = async exc => {
  await log.error(exc.message || 'No msg field')
  process.exit(1)
}

process.on('uncaughtException', handleException)
process.on('unhandledRejection', handleException)

process.on('exit', code => {
  console.log(`Exiting with code: ${code}`)
})

// const p = Promise.reject(new Error('Ive been rejected :('));
// p.then(() => { console.log('done'); });

const SignaleOptions = {
  disabled: false,
  interactive: false,
  logLevel: 'info',
  //  scope: 'custom',
  secrets: [],
  stream: process.stdout,
  types: {
    remind: {
      badge: '🍔',
      color: 'yellow',
      label: 'Check this ->',
      logLevel: 'info'
    },
    tabby: {
      badge: '🐈',
      color: 'red',
      label: 'tabby cat',
      logLevel: 'info'
    },
    propane: {
      badge: '🥃',
      color: 'green',
      label: 'Julian',
      logLevel: 'info'
    }
  }
}
/**
 * Create an instance of Signale
 *
 * @type {Signale}
 *
 * @see for details https://github.com/klaussinani/signale
 */
export const show = new Signale(SignaleOptions)

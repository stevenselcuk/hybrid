import { version } from '../../package.json'

const conf = require('nconf')

conf
  .argv()
  .env()
  .file({
    file: './config.json'
  })

conf.set('PORT', process.env.PORT)
conf.set('VERSION', version)
conf.set('IS_PROD', process.env.NODE_ENV === 'production')
conf.set('IS_DEV', process.env.NODE_ENV === 'development')
conf.set('IS_TEST', process.env.NODE_ENV === 'test')

if (conf.get('IS_PROD')) {
  conf.set('REDIS_HOST', 'localhost')
  conf.set('REDIS_PORT', 6379)
}

export default conf

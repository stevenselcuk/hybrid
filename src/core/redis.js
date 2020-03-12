import Redis from 'ioredis'
import conf from './config'

const REDIS_URI = conf.get('REDIS_URI') || 'redis://127.0.0.1:6379'

const redis = new Redis({
  host: conf.get('REDIS_HOST'),
  port: conf.get('REDIS_PORT'),
  password: conf.get('REDIS_PASS')
})
export default redis

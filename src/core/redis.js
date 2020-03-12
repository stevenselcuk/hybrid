import Redis from 'ioredis'
import conf from './config'

const redis = new Redis({
  host: conf.get('REDIS_HOST'),
  port: conf.get('REDIS_PORT'),
  password: conf.get('REDIS_PASS')
})
export default redis

import { createClient, RedisClientOptions } from 'redis'

import logger from '../../logger'
import config from '../config'

export type RedisClient = ReturnType<typeof createClient>

export const createRedisClient = (): RedisClient => {
  const commonConfig: RedisClientOptions = {
    password: config.redis.password,
    socket: {
      host: config.redis.host,
      port: config.redis.port,
      reconnectStrategy: (attempts: number) => {
        // Exponential back off: 20ms, 40ms, 80ms..., capped to retry every 30 seconds
        const nextDelay = Math.min(2 ** attempts * 20, 30000)
        logger.info(`Retry Redis connection attempt: ${attempts}, next attempt in: ${nextDelay}ms`)
        return nextDelay
      },
    },
  }
  const client = createClient(
    process.env.NODE_ENV === 'development'
      ? {
          ...commonConfig,
          socket: {
            ...commonConfig.socket,
            tls: false,
          },
        }
      : {
          ...commonConfig,
          socket: {
            ...commonConfig.socket,
            tls: true,
          },
        },
  )

  client.on('error', (e: Error) => logger.error('Redis client error', e))

  return client
}

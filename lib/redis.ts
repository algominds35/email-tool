import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export default redis;


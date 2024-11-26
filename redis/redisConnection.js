const Redis = require('ioredis');

const redisClient = new Redis('rediss://red-ct2pbp3qf0us739vuse0:pcNX1UADkerFAXsUGmGGM2VRQLWmX9TA@oregon-redis.render.com:6379');

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redisClient;

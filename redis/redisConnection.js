const Redis = require('ioredis');

const redisClient = new Redis('rediss://red-cstjgcggph6c739f7n1g:gzS77yTAfT8ewdHfafPqseGtrIWzX80h@oregon-redis.render.com:6379');

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redisClient;

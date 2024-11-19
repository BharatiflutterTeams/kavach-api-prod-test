const logger = require("../logger");
const redisClient = require("./redisConnection")

async function getRedisData(key) {
    try {
      const data = await redisClient.get(key);
      
      if (data) {
        // console.log(`Cache hit for key: ${key}`);
        logger.info(`Cache hit for key: ${key}`);
        return JSON.parse(data);
      } else {
        // console.log(`Cache miss for key: ${key}`);
        logger.info(`Cache miss for key: ${key}`);
        return null; 
      }
    } catch (error) {
      // console.error(`Error getting data from Redis for key ${key}:`, error);
      logger.error(`Error getting data from Redis for key ${key}:`, error);
      throw error;
    }
  }

  async function setRedisData(key, data) {
    try {
      await redisClient.set(key, JSON.stringify(data));
      console.log(`Data set in Redis with key: ${key}`);
      logger.info(`Data set in Redis with key: ${key}`);
    } catch (error) {
      // console.error(`Error setting data in Redis for key ${key}:`, error);
      logger.error(`Error setting data in Redis for key ${key}:`, error);
      throw error;
    }
  }

  module.exports = { getRedisData, setRedisData}
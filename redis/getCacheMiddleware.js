const redisClient = require("./redisConnection")
const {USER_CACHE_KEY,EMPLOYEE_STATUSES_KEY} = require("./redisKeys")
const { getRedisData } = require("../redis/redisFunctions");
const logger = require("../logger");


// Cache Middleware
async function cacheMiddleware(req, res, next) {
  try {
    // Step 1: Check Redis Cache
    const cachedUsers = await getRedisData(USER_CACHE_KEY);
    let statusUsers = await getRedisData(EMPLOYEE_STATUSES_KEY);

    statusUsers = statusUsers ? statusUsers : {};
    if (cachedUsers) {
      // console.log("Cache hit, returning data from cache");
      logger.info("Cache hit, returning data from cache");
      // If users data is found in cache, return it and skip the controller
      return res.status(200).json({
        status: "Success (from cache)",
        data: cachedUsers,
        statusData: statusUsers
      });
    }

    // If no cache found, proceed to the controller
    // console.log("Cache miss, passing to controller");
    logger.info("Cache miss, passing to controller");
    next();
  } catch (error) {
    // console.error("Cache error:", error);
    logger.error("Cache error:", error);
    // In case of a cache error, proceed to the controller
    next();
  }
}

module.exports = cacheMiddleware;

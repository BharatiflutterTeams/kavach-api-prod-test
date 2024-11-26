const { v4: uuidv4 } = require("uuid");
const logger = require("../logger/index");

const traceIdMiddleware = (req, res, next) => {
  const traceId = uuidv4(); // Generate a unique ID
  req.traceId = traceId; // Attach trace ID to the request
  res.setHeader("X-Trace-ID", traceId); // Include trace ID in response headers

  logger.info(`Incoming request: ${req.method} ${req.url}`, { traceId });

  next();
};

module.exports = traceIdMiddleware;

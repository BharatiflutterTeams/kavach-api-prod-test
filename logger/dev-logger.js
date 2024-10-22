const { format, createLogger, transports } = require("winston");
const { timestamp, printf, combine, errors, prettyPrint, json, colorize } = format;

// Function to build the logger for development environment
function buildDevLogger() {
  // Log format for non-console (file or other outputs)
  const logFormat = printf(({ level, message, timestamp, metaData }) => {
    const metaString = metaData ? ` | metaData: ${JSON.stringify(metaData)}` : "";
    return `${timestamp} ${level}: ${message}${metaString}`;
  });

  return createLogger({
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Adds timestamp
      errors({ stack: true }),                      // Captures error stack
      logFormat                                     // Main format
    ),
    transports: [
      // Console transport with colorized logs
      new transports.Console({
        format: combine(
          colorize(),                               // Apply colorization only to console logs
          logFormat
        ),
      }),
    ],
  });
}

module.exports = buildDevLogger;

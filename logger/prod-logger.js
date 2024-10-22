const { format, createLogger, transports } = require("winston");
const { timestamp, json, combine, errors, prettyPrint, printf } = format;
const { MongoDB } = require("winston-mongodb");
require("winston-mongodb");
const dotenv = require("dotenv");
dotenv.config();

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return ` ${level} : ${timestamp}  : ${stack || message}`;
});
function buildProdLogger() {
  return createLogger({
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      json(),
      prettyPrint(),
      myFormat
    ),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console({ level: "info" }),
      
      new MongoDB({
        level: "info",
        db: process.env.MONGO_URI,
        options: { useUnifiedTopology: true },
        collection: "productionLogs",
        metaKey: "metaData",
        format: format.combine(format.timestamp(), format.json()),
      }),
    ],
  });
}

module.exports = buildProdLogger;

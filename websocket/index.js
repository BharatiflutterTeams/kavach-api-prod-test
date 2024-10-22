const { Server } = require("socket.io");
const winston = require("winston");

const handleDownloadHistory = require("./sockets/downloadHistory");
const handleEmployeeStatus = require("./sockets/empStatus");
const handleRestartSettings = require("./sockets/restart");
const handleKeyLogger = require("./sockets/keyLogger");
const handleWallpaper = require("./sockets/wallpaper");
const handleBrowserHistory = require("./sockets/internetHistory");
const handleScreenshot = require("./sockets/screenshots");
const restart = require("./sockets/restart");

const employeeSockets = {};
const empLiveStatus = [];
let socket;

// Set up logging with Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

// Socket.io setup with CORS
function socketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Handle connections
  io.on("connection", (socket) => {
    socket = socket;
    logger.info("New client connected via Socket.io");

    // Register employee sockets
    socket.on("register", (employeeId) => {
      employeeSockets[employeeId] = socket;
      // socket.employeeId = employeeId;
      // logger.info(`Employee ${employeeId} registered`);
      logger.info(`Employee ${employeeId} registered and connected`);
    });

    // Call your specific handlers
    [
      handleDownloadHistory,
      handleBrowserHistory,
      handleEmployeeStatus,
      handleRestartSettings,
      handleKeyLogger,
      handleWallpaper,
      handleScreenshot,
    ].forEach((handler) =>
      handler(socket, io, employeeSockets, logger, empLiveStatus)
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      logger.info("Client disconnected");
      Object.entries(employeeSockets).forEach(([employeeId, sock]) => {
        if (sock === socket) {
          delete employeeSockets[employeeId];
          logger.info(`Employee ${employeeId} deregistered`);
        }
      });
    });
  });
}

module.exports = { socketServer, employeeSockets, socket };

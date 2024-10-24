const { Server } = require("socket.io");
const winston = require("winston");

const handleDownloadHistory = require("./sockets/downloadHistory");
const handleEmployeeStatus = require("./sockets/empStatus");
const handleRestartSettings = require("./sockets/restart");
const handleKeyLogger = require("./sockets/keyLogger");
const handleWallpaper = require("./sockets/wallpaper");
const handleBrowserHistory = require("./sockets/internetHistory");
const handleScreenshot = require("./sockets/screenshots");

const employeeSockets = {};
const empLiveStatus = [];

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
    logger.info(`New client connected: ${socket.id}`);

    // Register employee sockets
    socket.on("register", (employeeId) => {
      employeeSockets[employeeId] = socket;
      logger.info(
        `Employee ${employeeId} registered with socket ID ${socket.id}`
      );
      logConnectedClients();
    });

    // Register handlers
    const handlers = [
      handleDownloadHistory,
      handleBrowserHistory,
      handleEmployeeStatus,
      handleRestartSettings,
      handleKeyLogger,
      handleWallpaper,
      handleScreenshot,
    ];

    handlers.forEach((handler) =>
      handler(socket, io, employeeSockets, logger, empLiveStatus)
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
      Object.entries(employeeSockets).forEach(([employeeId, sock]) => {
        if (sock === socket) {
          delete employeeSockets[employeeId];
          logger.info(`Employee ${employeeId} deregistered`);
          logConnectedClients();
        }
      });
    });
  });
}

// Function to log currently connected clients
function logConnectedClients() {
  const connectedEmployees = Object.keys(employeeSockets);
  logger.info(
    `Currently connected employees: ${connectedEmployees.join(", ")}`
  );
}

module.exports = { socketServer, employeeSockets };

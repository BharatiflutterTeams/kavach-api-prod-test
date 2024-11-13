const { Server } = require("socket.io");
const winston = require("winston");

const handleDownloadHistory = require("./sockets/downloadHistory");
const handleEmployeeStatus = require("./sockets/empStatus");
const handleRestartSettings = require("./sockets/restart");
const handleKeyLogger = require("./sockets/keyLogger");
const handleWallpaper = require("./sockets/wallpaper");
const handleBrowserHistory = require("./sockets/internetHistory");
const handleScreenshot = require("./sockets/screenshots");
const empStatusOnRegister = require("./sockets/empStatusOnRegister");
const restart = require("./sockets/restart");

const employeeSockets = {};
const empLiveStatus = {}; // Object for easier status tracking

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
      empLiveStatus[employeeId] = "active"; // Set employee status to active
      logger.info(
        `Employee ${employeeId} registered and status set to >> ${empLiveStatus[employeeId]}`
      );

      let empStatus = "active";
      empStatusOnRegister(io, employeeId, empStatus, logger);
      // Log the list of currently connected employees
      const connectedEmployees = Object.keys(employeeSockets);
      logger.info(
        `Connected employees: ${
          connectedEmployees.length > 0 ? connectedEmployees.join(", ") : "None"
        }`
      );

      // Log the full empLiveStatus object
      logger.info("Current employee statuses:", empLiveStatus);
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
          empLiveStatus[employeeId] = "inactive"; // Set employee status to inactive
          logger.info(
            `Employee ${employeeId} deregistered and status set to inactive >> ${empLiveStatus[employeeId]}`
          );

          let empStatus = "inactive";
          empStatusOnRegister(io, employeeId, empStatus, logger);
        }
      });

      // Log the list of currently connected employees
      const connectedEmployees = Object.keys(employeeSockets);
      logger.info(
        `Connected employees: ${
          connectedEmployees.length > 0 ? connectedEmployees.join(", ") : "None"
        }`
      );

      // Log the full empLiveStatus object
      logger.info("Current employee statuses:", empLiveStatus);
    });
  });
}

module.exports = { socketServer, employeeSockets, empLiveStatus, socket };

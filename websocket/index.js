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
const { getRedisData, setRedisData } = require("../redis/redisFunctions");
const { EMPLOYEE_STATUSES_KEY, EMPLOYEE_SOCKET_KEY } = require("../redis/redisKeys");

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
      // origin: ["https://new-kavach-dashboard-test.onrender.com", "http://localhost:3000", "https://kavach-api-prod-test-z1x4.onrender.com"],
      origin:"*",
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
    socket.on("register", async(employeeId) => {
      employeeSockets[employeeId] = socket;

      empLiveStatus[employeeId] = "active"; // Set employee status to active
      logger.info(
        `Employee ${employeeId} registered and status set to >> ${empLiveStatus[employeeId]} and socket id is ${socket.id}`
      );
      let employeeStatuses = await getRedisData(EMPLOYEE_SOCKET_KEY);
      employeeStatuses = employeeStatuses ? employeeStatuses : {};

      employeeStatuses[employeeId] = socket?.id;

      await setRedisData(EMPLOYEE_SOCKET_KEY, employeeStatuses);

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
      Object.entries(employeeSockets).forEach(async([employeeId, sock]) => {
        if (sock === socket) {
          delete employeeSockets[employeeId];
          empLiveStatus[employeeId] = "deactivated"; // Set employee status to deactivated
          logger.info(
            `Employee ${employeeId} deregistered and status set to inactive >> ${empLiveStatus[employeeId]}`
          );
          let employeeStatuses = await getRedisData(EMPLOYEE_STATUSES_KEY);
        employeeStatuses = employeeStatuses ? employeeStatuses : {};

          // let empStatus = "deactivated";
          // empStatusOnRegister(io, employeeId, empStatus, logger);
          io.emit("sendEmployeeStatus", {
            employeeId: employeeId,
            status: 'deactivated',
          });
          employeeStatuses[employeeId] = 'deactivated';
          await setRedisData(EMPLOYEE_STATUSES_KEY, employeeStatuses);
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

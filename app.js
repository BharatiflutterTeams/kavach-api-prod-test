const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { socketServer } = require("./websocket/index");
const redisClient = require("./redis/redisConnection");

// Load environment variables
const connectDB = require("./config/db"); // Adjust the path as necessary
const User = require("./models/User");
const logger = require("./logger");

const PORT = process.env.PORT || 5000;

//SSL Part Start//
// const https = require("node:https");
// const fs = require("node:fs");
// const privateKey = __dirname + "/ssl_key/privkey.pem";
// const fullChainKey = __dirname + "/ssl_key/fullchain.pem";

//SSL Part end

const USER_CACHE_KEY = 'all_users';

User.watch().on('change', async (change) => {
  if (['insert', 'update', 'replace', 'delete'].includes(change.operationType)) {
    // Fetch the latest user list from the DB
    const users = await User.find().populate("featureSettings");

    // Update Redis cache
    await redisClient.set(USER_CACHE_KEY, JSON.stringify(users));
    console.log("Updated Redis cache for users");
    logger.info("Updated Redis cache for users");
  }
});

const app = express();
const http = require("http"); // HTTP server instance
const server = http.createServer(app); // Create server from Express

// Body Parser Middleware
app.use(bodyParser.json());

// CORS Middleware
app.use(
  cors({
    origin: "*", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Set server timeouts
server.keepAliveTimeout = 120000;  // 120 seconds
server.headersTimeout = 120000;

app.get("/test", (req, res) => {
  console.log("api test");
  res.send("test page"); // Serve the client-side HTML file
});

// Define Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/userlocation", require("./routes/locationRoutes"));
app.use("/api", require("./routes/emailSettingsRoutes"));
app.use("/api", require("./routes/featureRoutes"));
app.use("/api/wallpaper", require("./routes/wallpaperRoutes"));
app.use("/api/version", require("./routes/versionRoutes"));
app.use("/api", require("./routes/newEmailSettingsRoutes"));
app.use("/api/downloadHistory", require("./routes/downloadHistoryRoutes"));
app.use("/api/internetHistory", require("./routes/internetHistoryRoutes"));

// // ssl code start
// const options = {
//   key: fs.readFileSync(privateKey),
//   cert: fs.readFileSync(fullChainKey),
//   // key: fs.readFileSync("/etc/letsencrypt/live/bhartitextile.com/privkey.pem"),
//   // cert: fs.readFileSync("/etc/letsencrypt/live/bhartitextile.com/fullchain.pem")
// };

// https
//   .createServer(options, (req, res) => {
//     res.writeHead(200);
//     res.end("hello world\n");
//   })
//   .listen(547);
// //SSL Part END//

// Initialize Socket.io
socketServer(server); // Pass the same server to Socket.io

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect to Database and Start the server
connectDB()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      // Start the server here
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
    process.exit(1);
  });

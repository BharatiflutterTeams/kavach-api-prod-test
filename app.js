const cluster = require("cluster");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require("os");
const dotenv = require("dotenv");
const { socketServer } = require("./websocket/index");

// Load environment variables
const connectDB = require("./config/db"); // Adjust the path as necessary

const PORT = process.env.PORT || 5000;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  const app = express();
  const http = require("http"); // HTTP server instance
  const server = http.createServer(app); // Create server from Express

  // Body Parser Middleware
  app.use(bodyParser.json());

  // CORS Middleware
  app.use(cors());

  // {
  //   origin: "http://localhost:3000", // Your frontend URL
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  // }

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
  app.use("/api/version", require('./routes/versionRoutes'))
  // app.use('/api/userlocation',)

  app.use("/api/downloadHistory", require("./routes/downloadHistoryRoutes"));
  app.use("/api/internetHistory", require("./routes/internetHistoryRoutes"));

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
      server.listen(PORT, () => {
        // Start the server here
        console.log(`Worker ${process.pid} running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
      process.exit(1);
    });
}

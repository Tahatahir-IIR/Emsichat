const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoute");
const friendsRoutes = require("./routes/friends");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/groups");
const voiceRoomsRoutes = require("./routes/voiceRooms");

const app = express();

// Optional TLS: use HTTPS only when both key and certificate files exist,
// otherwise fall back to plain HTTP.
const keyPath = path.resolve(__dirname, process.env.SSL_KEY_PATH || "ssl/localhost.key");
const certPath = path.resolve(__dirname, process.env.SSL_CERT_PATH || "ssl/localhost.crt");
const useHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

const server = useHttps
  ? https.createServer(
      { key: fs.readFileSync(keyPath, "utf8"), cert: fs.readFileSync(certPath, "utf8") },
      app
    )
  : http.createServer(app);

// Folder used by multer for uploaded files
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use("/uploads", express.static(uploadsDir));
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/voiceRooms", voiceRoomsRoutes);

// Socket.io shares the same HTTP(S) server
const { setupSocket } = require("./socket/socket");
setupSocket(server);

const Port = process.env.Port || process.env.API_Port || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(Port, "0.0.0.0", () => {
      const scheme = useHttps ? "https" : "http";
      console.log(`Server is running on ${scheme}://localhost:${Port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error");
    console.error(err);
  });

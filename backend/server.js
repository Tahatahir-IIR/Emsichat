const express = require("express");
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

// SSL certificates
const privateKey = fs.readFileSync(path.join(__dirname, "ssl", "localhost.key"), "utf8");
const certificate = fs.readFileSync(path.join(__dirname, "ssl", "localhost.crt"), "utf8");
const credentials = { key: privateKey, cert: certificate };

const app = express();
const httpsServer = https.createServer(credentials, app);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/voiceRooms", voiceRoomsRoutes);

// Setup socket.io with your https server
const { setupSocket } = require("./socket/socket");
setupSocket(httpsServer);


const Port = process.env.Port || process.env.API_Port || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    httpsServer.listen(Port, "0.0.0.0", () => {
      console.log(`🔐 HTTPS Server is running on https://localhost:${Port}`);
    });
  })
  .catch((err) => {
    console.log("❌ Database connection error");
    console.error(err);
  });

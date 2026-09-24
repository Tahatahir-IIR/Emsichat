const { Server } = require("socket.io");

const roomParticipants = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const usersInCall = new Map();  // userId <-> otherUserId
  const onlineUsers = new Map();  // userId -> socketId

  io.on("connection", (socket) => {
    console.log(`✅ New client connected: ${socket.id}`);

    socket.on("join-room", (userId) => {
      socket.join(userId);
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      console.log(`🚪 Socket ${socket.id} joined personal room: ${userId}`);

      // Emit updated online users to all clients
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("call-user", (data) => {
      if (!data?.from?._id || !data?.to) return;
      usersInCall.set(data.from._id, data.to);
      usersInCall.set(data.to, data.from._id);

      io.to(data.to).emit("incoming-call", {
        callerName: data.from.username,
        callerId: data.from._id,
        offer: data.offer,
        callType: data.callType,
      });
    });

    socket.on("accept-call", (data) => {
      if (!data?.to) return;
      io.to(data.to).emit("call-accepted", { fromName: data.fromName });
    });

    socket.on("answer-call", (data) => {
      if (!data?.to) return;
      io.to(data.to).emit("answer-made", data);
    });

    socket.on("ice-candidate", (data) => {
      if (!data?.to) return;
      io.to(data.to).emit("ice-candidate", data);
    });

    socket.on("hang-up", () => {
      const userId = socket.userId;
      if (!userId) return;

      const otherUserId = usersInCall.get(userId);
      if (otherUserId) {
        io.to(otherUserId).emit("hang-up", { from: userId });
        usersInCall.delete(userId);
        usersInCall.delete(otherUserId);
      }
      io.to(userId).emit("hang-up", { from: userId });
    });

    socket.on("voice-offer", (data) => {
      if (!data?.to) return;
      io.to(data.to).emit("voice-offer", { from: socket.userId, offer: data.offer });
    });

    socket.on("voice-answer", (data) => {
      if (!data?.to) return;
      io.to(data.to).emit("voice-answer", { from: socket.userId, answer: data.answer });
    });

    socket.on("join-voice-room", ({ roomId, userId, username }) => {
      if (!roomId || !userId || !username) return;

      console.log(`🔊 User ${username} (${userId}) joined voice room ${roomId}`);
      socket.join(roomId);
      socket.voiceRoomId = roomId;
      socket.userId = userId;
      socket.username = username;

      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Map()); // userId -> username
      }

      const participants = roomParticipants.get(roomId);
      participants.set(userId, username);

      // Broadcast updated participants list
      const usersList = Array.from(participants.entries()).map(([id, name]) => ({
        userId: id,
        username: name,
      }));

      io.to(roomId).emit("voice-room-users", usersList);
      socket.emit("joined-voice-room", roomId);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);

      const roomId = socket.voiceRoomId;
      const userId = socket.userId;

      // Remove user from voice room
      if (roomId && roomParticipants.has(roomId) && userId) {
        const participants = roomParticipants.get(roomId);
        participants.delete(userId);

        io.to(roomId).emit(
          "voice-room-users",
          Array.from(participants.entries()).map(([id, name]) => ({
            userId: id,
            username: name,
          }))
        );

        if (participants.size === 0) {
          roomParticipants.delete(roomId);
        }
      }

      // Remove user from calls and online users
      if (userId) {
        const otherUserId = usersInCall.get(userId);
        if (otherUserId) {
          io.to(otherUserId).emit("hang-up", { from: userId });
          usersInCall.delete(userId);
          usersInCall.delete(otherUserId);
        }
        onlineUsers.delete(userId);

        // Emit updated online users after removal
        io.emit("online-users", Array.from(onlineUsers.keys()));
      }
    });
  });
}

module.exports = { setupSocket , getIo: () => io };

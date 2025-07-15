import { Server } from "socket.io";

let io;
const userSocketMap = {}; // { userId: socketId }

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;

      // Emit updated online user list
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      console.log("❌ A user disconnected:", socket.id);

      // Remove user if this socket matches
      if (userId && userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });
};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

export { io };

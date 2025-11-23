import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🔥 Socket connected", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("chatMessage", (data) => {
    // data: { room, message, from }
    io.to(data.room).emit("chatMessage", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data);
  });

  socket.on("seen", (data) => {
    socket.to(data.room).emit("seen", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

server.listen(PORT, async () => {
  await connectDB(process.env.MONGODB_URI);
  console.log(`🚀 Delta University V12 backend listening on port ${PORT}`);
});

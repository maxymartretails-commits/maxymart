import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import axios from "axios";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // update to frontend origin in prod
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

// ✅ Notification API endpoint
app.post("/sendNotification", async (req, res) => {
  const { orderId, userId, userName } = req.body;
  console.log({
    orderId,
    userId,
  });

  const adminNotification = {
    message: `🛒 New order placed by user ${userName || "user"}. Order ID: ${orderId}`,
    orderId,
  };

  const userNotification = {
    message: `📦 Your order #${orderId} has been successfully placed.`,
    orderId,
  };

  console.log("📩 Sending Notification to admin:", adminNotification);
  console.log("📩 Sending Notification to user:", userNotification);
  // Send to both user and admin
  io.to(`user-${userId}`).emit("newNotification", userNotification);
  io.to("admin").emit("newNotification", adminNotification);

  res.sendStatus(200);
});

server.listen(3001, () =>
  console.log("Socket server running on http://localhost:3001")
);

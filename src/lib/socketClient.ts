import { io } from "socket.io-client";

const socket = io(process.env.NEXT_WEBSOCKET_URL, {
  transports: ["websocket"],
});
socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});
export default socket;

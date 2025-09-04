// socket.ts
import { io, Socket } from "socket.io-client";




// you can also load the URL from env variables for SaaS
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"], // always use websocket, avoid long-polling
  autoConnect: true, // connects automatically
  withCredentials: true, // if you need cookies
});




// Log connection
socket.on("connect", () => {
  console.log("✅ Connected to socket:", socket.id);
});

// Log errors
socket.on("connect_error", (err) => {
  console.error("❌ Socket connect error:", err.message);
});
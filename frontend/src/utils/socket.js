import { io } from "socket.io-client";
import BASE_URL from "./BASE_URL"

const socket = io(BASE_URL, {
  transports: ["websocket"],
  autoConnect: true,
  secure: true,
  rejectUnauthorized: false,
});

socket.on("connect", () => {
  console.log("✅ Socket connected to server:", socket.id);
});

export default socket;

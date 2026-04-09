import { io } from "socket.io-client";
import { BASE_URL } from "./pages/endpoints.js";

const socket = io(`${BASE_URL}`, {
  withCredentials: true,
});

export default socket;
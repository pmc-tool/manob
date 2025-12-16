"use client";
import { io, Socket } from "socket.io-client";
import store from "../state/store";
import { setChatConnect } from "../state/slices/chat.slice";

// Get Access Token from Local Storage
const accessToken =
  typeof window !== "undefined" && localStorage.getItem("p_aut");

let PmcSocket: Socket | null = null;
if (!accessToken) {
  console.log("Access Token not found");
} else {
  PmcSocket = io("https://chat.packmycode.com", {
    extraHeaders: {
      Authorization: "Bearer " + accessToken,
    },
  });
  // Listen for 'connect' event
  PmcSocket.on("connect", () => {
    store.dispatch(setChatConnect(true));
    console.log("Connected to Socket ");
  });

  PmcSocket.on("reconnect_attempt", () => {
    console.log("connecting to Socket ");
  });

  // Listen for 'disconnect' event
  PmcSocket.on("disconnect", () => {
    store.dispatch(setChatConnect(false));
    console.log("Disconnected from Socket Server");
  });

  PmcSocket.emit("initiate", {});
  PmcSocket.emit("chatHistory", {});
}

export default PmcSocket;

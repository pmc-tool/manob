"use client";
import { io, Socket } from "socket.io-client";

// Get Access Token from Local Storage
const accessToken =
  typeof window !== "undefined" && localStorage.getItem("p_aut");
// console.log(accessToken);

let PmcJobSocket: Socket | null = null;

if (!accessToken) {
  // console.log(accessToken);

  console.log("Access Token not found");
} else {
  PmcJobSocket = io("https://jobs.packmycode.com", {
    extraHeaders: {
      Authorization: "Bearer " + accessToken,
    },
  });

  // Listen for 'connect' event
  PmcJobSocket.on("connect", () => {
    console.log("Connected to JobsSocket ");
  });
  // Listen for 'disconnect' event
  PmcJobSocket.on("disconnect", () => {
    console.log("Disconnected from Socket Server");
  });

  PmcJobSocket.emit("liveJobsList", {});
  PmcJobSocket.emit("newLiveJob", {});

  // PmcJobSocket.emit("bidsList", {"job_id": "d44c941a-a28e-45e5-b616-7f4d2fe29264"});
}

export const emitBidsList = (jobId: string) => {
  if (!jobId) {
    console.error("Job ID is missing!");
    return;
  }
  PmcJobSocket?.emit("bidsList", { job_id: jobId });
};

export default PmcJobSocket;

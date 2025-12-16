import DeviceDetector from "device-detector-js";
import CryptoJS from "crypto-js";
export const generateDeviceId = () => {
  const deviceDetector = new DeviceDetector();
  const userAgent:any = typeof window !== "undefined" && navigator.userAgent; // Get user-agent from browser
  const device = deviceDetector.parse(userAgent);

  let deviceId;

  const preDevice =
    typeof window !== "undefined" && window.localStorage.getItem("d_i");

  if (preDevice) {
    deviceId = localStorage.getItem("d_i");
  } else {
    deviceId = `${device.device?.type || "unknown"}:pmc-web:${
      device.os?.name || "unknown"
    }:${Date.now()}`;

    typeof window !== "undefined" &&
      localStorage.setItem("d_i", CryptoJS.SHA256(deviceId).toString());
    deviceId = CryptoJS.SHA256(deviceId).toString();
  }

  return {
    deviceId: deviceId,
    deviceType: device?.device?.type || "desktop",
    appClient: "pmc-web",
  };
};

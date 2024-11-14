// import wifi from "node-wifi";
// import scanAndConnect from "./scanAndConnect.js";
// import { TARGET_SSID } from "../config/wifiConfig.js";

// export default async function checkConnection() {
//   try {
//     const currentConnections = await wifi.getCurrentConnections();
//     const connected = currentConnections.some(
//       (connection) => connection.ssid === TARGET_SSID
//     );

//     if (connected) {
//       console.log(`✔ Already connected to "${TARGET_SSID}"`);
//       return true;
//     } else {
//       console.log(`✖ Not connected to "${TARGET_SSID}". Starting scan...`);
//       await scanAndConnect();
//       return false;
//     }
//   } catch (error) {
//     console.error("Error checking current connection:", error);
//     await scanAndConnect();
//     return false;
//   }
// }


import wifi from "node-wifi";
import { TARGET_SSID, PASSWORD } from "../config/wifiConfig.js";

// Initialize wifi
wifi.init({
  iface: "wlan0",
});

let wifiStatus = {
  connected: false,
  details: {},
  message: "Initializing Wi-Fi status...",
};

// Function to get the current Wi-Fi status
export const getWifiStatus = () => wifiStatus;

// Attempt connection to the pre-configured Wi-Fi network
export async function connectToWifi() {
  try {
    // Attempt to connect to the Wi-Fi network with SSID and password from config
    wifiStatus.message = `Attempting to connect to "${TARGET_SSID}"...`;
    await wifi.connect({ ssid: TARGET_SSID, password: PASSWORD });

    wifiStatus = {
      connected: true,
      details: await wifi.getCurrentConnections(),
      message: `✔ Connected to "${TARGET_SSID}"`,
    };
  } catch (error) {
    console.error("Error connecting to Wi-Fi:", error);
    wifiStatus = { connected: false, details: {}, message: `Failed to connect to "${TARGET_SSID}".` };
  }
}

// Periodically check Wi-Fi connection status
export async function checkConnection() {
  try {
    const currentConnections = await wifi.getCurrentConnections();
    const connected = currentConnections.some(
      (connection) => connection.ssid === TARGET_SSID
    );

    if (connected) {
      wifiStatus = {
        connected: true,
        details: currentConnections,
        message: `✔ Connected to "${TARGET_SSID}"`,
      };
    } else {
      wifiStatus = {
        connected: false,
        details: {},
        message: `✖ Not connected to "${TARGET_SSID}". Scanning for available networks...`,
      };
      // Automatically attempt to reconnect
      await connectToWifi();
    }
  } catch (error) {
    console.error("Error checking Wi-Fi connection:", error);
    wifiStatus = { connected: false, details: {}, message: "Error checking connection." };
  }
}


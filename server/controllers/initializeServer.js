import wifi from "node-wifi";
import {checkConnection} from "./checkConnection.js";
import { initializeDirectory } from "../utils/fileOperations.js";
import { notifyMainServer } from "./notificationController.js";
import { initializeAndSync } from "./syncController.js";
import openBrowser from "../utils/openBrowser.js";
import { SCAN_INTERVAL } from "../config/wifiConfig.js";


// Initialize wifi with the network interface
wifi.init({
  iface: "en0", 
//   iface: "wlan0", 
});

const initializeServer = async (app) => {
  // Check and wait for Wi-Fi connection
  console.log("🔄 Waiting for Wi-Fi connection...");
  let connected = false;
//   while (!connected) {
//     connected = await checkConnection();
//     if (!connected) {
//       console.log(`🔄 Retrying connection in ${SCAN_INTERVAL / 1000} seconds...`);
//       await new Promise((resolve) => setTimeout(resolve, SCAN_INTERVAL));
//     }
//   }

  // Once connected, proceed with the remaining tasks
  console.log("✔ Wi-Fi connected. Proceeding with server initialization...");

  // Initialize directory
  initializeDirectory();

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, async () => {
    console.log(`✔ Server running on port ${PORT}`);

    // Initialize and sync videos
    await initializeAndSync();

    // Notify main server
    await notifyMainServer();

    // Open the browser in fullscreen mode
    await openBrowser();

    // Set up regular Wi-Fi checks
    // setInterval(checkConnection, SCAN_INTERVAL);
  });
};

export default initializeServer;


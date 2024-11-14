import wifi from "node-wifi";
import { TARGET_SSID, PASSWORD, SCAN_INTERVAL } from "../config/wifiConfig.js";

export default async function scanAndConnect() {
  try {
    console.log(`Scanning for available networks...`);
    const networks = await wifi.scan();
    console.log("Detected Networks:", networks);

    const targetNetwork = networks.find(
      (network) => network.ssid === TARGET_SSID
    );

    if (targetNetwork) {
      console.log(`Network "${TARGET_SSID}" found. Attempting to connect...`);
      try {
        await wifi.connect({ ssid: TARGET_SSID, password: PASSWORD });
        console.log(`✔ WiFi connected to "${TARGET_SSID}"`);
      } catch (error) {
        console.log(`Failed to connect. Retrying in ${SCAN_INTERVAL / 1000} seconds.`);
        setTimeout(scanAndConnect, SCAN_INTERVAL);
      }
    } else {
      console.log(`Network "${TARGET_SSID}" not found. Retrying in ${SCAN_INTERVAL / 1000} seconds.`);
      setTimeout(scanAndConnect, SCAN_INTERVAL);
    }
  } catch (error) {
    console.error("Error scanning for networks:", error);
    setTimeout(scanAndConnect, SCAN_INTERVAL);
  }
}

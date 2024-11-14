import express from "express";
import wifi from "node-wifi";
import { TARGET_SSID, PASSWORD } from "../config/wifiConfig.js";

const wifiRouter = express.Router();

// Initialize wifi if not already done
wifi.init({
  iface: "wlan0",
});

// Route to get current Wi-Fi connection details
wifiRouter.get("/wifi-details", async (req, res) => {
  try {
    const currentConnections = await wifi.getCurrentConnections();

    if (currentConnections.length > 0) {
      const connectionDetails = currentConnections.map((connection) => ({
        ssid: connection.ssid,
        signalLevel: connection.signal_level,
        frequency: connection.frequency,
        security: connection.security,
        mac: connection.mac,
      }));

      res.json({
        status: "connected",
        details: connectionDetails,
        ssid: TARGET_SSID,
        password: PASSWORD,
      });
    } else {
      res.json({
        status: "disconnected",
        message: `Not connected to Wi-Fi network.`,
        ssid: TARGET_SSID,
        password: PASSWORD,
      });
    }
  } catch (error) {
    console.error("Error fetching Wi-Fi details:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve Wi-Fi connection details.",
    });
  }
});

export default wifiRouter;

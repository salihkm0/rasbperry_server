import axios from "axios";
import clc from "cli-color";
import { SERVER_URL, RPI_ID } from "../config/dotenv.js";

export const notifyMainServer = async () => {
  try {
    await axios.post(`${SERVER_URL}/api/notify-online`, { rpi_id: RPI_ID });
    console.log(clc.green.bold("✔ Notified main server of online status"));
  } catch (error) {
    console.error(clc.red.bold("✖ Failed to notify main server:"), error);
  }
};

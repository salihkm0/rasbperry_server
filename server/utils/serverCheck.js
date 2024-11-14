import axios from "axios";
import clc from "cli-color";
import { SERVER_URL } from "../config/dotenv.js";

export const isServerReachable = async () => {
  console.log(clc.yellow.bold("Checking Internet Connection:"));
  try {
    const serverRes = await axios.get(`${SERVER_URL}/api/ping`);
    if (serverRes.status === 200 && serverRes.data.success) {
      console.log(clc.green.bold("✔ Main server is reachable"));
      return true;
    } else {
      console.log(clc.red.bold("✖ Main server response was not successful"));
      return false;
    }
  } catch (error) {
    console.log(clc.yellow.bold("✖ Unable to reach server. Skipping sync."));
    return false;
  }
};

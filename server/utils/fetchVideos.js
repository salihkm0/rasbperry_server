import axios from "axios";
import clc from "cli-color";
import { SERVER_URL } from "../config/dotenv.js";

export const fetchVideosList = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/videos`);
    return response.data;
  } catch (error) {
    console.error(clc.red.bold("✖ Error fetching videos list:"), error);
    return [];
  }
};

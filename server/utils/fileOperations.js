// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const VIDEOS_DIR = path.join(__dirname, "../../ads-videos");

// export const initializeDirectory = () => {
//   if (!fs.existsSync(VIDEOS_DIR)) {
//     fs.mkdirSync(VIDEOS_DIR);
//   }
// };


// utils/fileOperations.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const VIDEOS_DIR = path.join(__dirname, "../../ads-videos");


export function initializeDirectory() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR);
  }
  return VIDEOS_DIR;
}

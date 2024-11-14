import fs from "fs";
import clc from "cli-color";
import { VIDEOS_DIR } from "../utils/fileOperations.js";
import { fetchVideosList } from "../utils/fetchVideos.js";
import { downloadVideo, syncVideos } from "./videoController.js";

export async function initializeAndSync() {
    if (!fs.existsSync(VIDEOS_DIR)) {
      fs.mkdirSync(VIDEOS_DIR);
    }
  
    const localFilenames = fs.readdirSync(VIDEOS_DIR);
  
    if (localFilenames.length === 0) {
      console.log(clc.yellow.bold("⚠ No videos found locally. Downloading all videos..."));
      const serverVideos = await fetchVideosList();
      for (const video of serverVideos) {
        await downloadVideo(video);
      }
      console.log(clc.green.bold("✔ Initial download complete."));
    } else {
      console.log(clc.yellow.bold("⚠ Videos already exist locally. Starting regular sync."));
    }
  
    setInterval(syncVideos, 60 * 1000);
  }
  

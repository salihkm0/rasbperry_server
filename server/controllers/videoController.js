// import fs from "fs";
// import path from "path";
// import axios from "axios";
// import clc from "cli-color";
// import { SERVER_URL } from "../config/dotenv.js";
// import { VIDEOS_DIR } from "../utils/fileOperations.js";
// import { fetchVideosList } from "../utils/fetchVideos.js";

// export const getVideosList = (req, res) => {
//   try {
//     const videos = fs
//       .readdirSync(VIDEOS_DIR)
//       .filter((file) => file.endsWith(".mp4"));
//     res.json({ videos });
//   } catch (error) {
//     console.error(clc.red.bold("✖ Error fetching video list:"), error);
//     res.status(500).json({ message: "Failed to retrieve video list" });
//   }
// };

// export const downloadVideo = async (req, res) => {
//   const { filename, fileUrl } = req.body;
//   const filePath = path.join(VIDEOS_DIR, `${filename}.mp4`);

//   try {
//     const response = await axios({
//       url: fileUrl,
//       method: "GET",
//       responseType: "stream",
//     });

//     const writer = fs.createWriteStream(filePath);
//     response.data.pipe(writer);

//     writer.on("finish", () => {
//       console.log(
//         clc.green.bold(`✔ Downloaded and saved video: ${filename}.mp4`)
//       );
//       res.json({ message: "Video downloaded successfully" });
//     });

//     writer.on("error", (err) => {
//       console.error(clc.red.bold("✖ Error writing file:", err));
//       res.status(500).json({ message: "Failed to download video" });
//     });

//   } catch (error) {
//     console.error(clc.red.bold("✖ Error downloading video:", error));
//     res.status(500).json({ message: "Failed to download video", error });
//   }
// };

// // Function to sync videos
// export const syncVideos = async () => {
//   try {
//     console.log(clc.blue.bold("ℹ Starting sync..."));

//     const online = await isServerReachable();
//     console.log("online : " + online);
//     if (!online) {
//       console.log(
//         clc.yellow.bold("⚠ Offline mode: Skipping sync and deletions.")
//       );
//       return;
//     }

//     const serverVideos = await fetchVideosList();
//     const serverFilenames = serverVideos.map((video) =>
//       video.filename.endsWith(".mp4") ? video.filename : `${video.filename}.mp4`
//     );
//     const localFilenames = fs.readdirSync(VIDEOS_DIR);

//     // Identify new videos to download
//     const videosToDownload = serverVideos.filter(
//       (video) =>
//         !localFilenames.includes(
//           video.filename.endsWith(".mp4")
//             ? video.filename
//             : `${video.filename}.mp4`
//         )
//     );

//     // Identify extra local files to delete
//     const videosToDelete = localFilenames.filter(
//       (filename) => !serverFilenames.includes(filename)
//     );

//     // Log a message if everything is up to date
//     if (videosToDownload.length === 0 && videosToDelete.length === 0) {
//       console.log(clc.cyan.bold("ℹ All videos are up to date."));
//     }

//     // Download new videos
//     for (const video of videosToDownload) {
//       await downloadVideo(video);
//     }

//     // Delete extra local videos
//     for (const filename of videosToDelete) {
//       const filePath = path.join(VIDEOS_DIR, filename);
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.log(
//             clc.red.bold("✖ Failed to delete ") + clc.red(filename),
//             err
//           );
//         } else {
//           console.log(clc.green.bold(`✔ Deleted extra file: ${filename}`));
//         }
//       });
//     }

//     console.log(clc.green.bold("✔ Sync complete."));
//   } catch (error) {
//     console.log(error);
//     res.json({ error: error });
//   }
// };

import fs from "fs";
import path from "path";
import axios from "axios";
import clc from "cli-color";
import { fileURLToPath } from "url";
// import { VIDEOS_DIR } from "../utils/fileOperations.js";
import { fetchVideosList } from "../utils/fetchVideos.js";
import { isServerReachable } from "../utils/serverCheck.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEOS_DIR = path.join(__dirname, "../../ads-videos");

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  console.log(`Directory created at: ${VIDEOS_DIR}`);
}

export const getVideosList = (req, res) => {
  try {
    const videos = fs
      .readdirSync(VIDEOS_DIR)
      .filter((file) => file.endsWith(".mp4"));
    res.json({ videos });
  } catch (error) {
    console.error(clc.red.bold("✖ Error fetching video list:"), error);
    res.status(500).json({ message: "Failed to retrieve video list" });
  }
};

// Helper function to download a video
// export const downloadVideo = async (video) => {
//   const filePath = path.join(VIDEOS_DIR, `${filename}.mp4`);
//   console.log("file url: " + fileUrl);
//   try {
//     const response = await axios({
//       url: fileUrl,
//       method: "GET",
//       responseType: "stream",
//     });

//     const writer = fs.createWriteStream(filePath);
//     response.data.pipe(writer);

//     return new Promise((resolve, reject) => {
//       writer.on("finish", () => {
//         console.log(clc.green.bold(`✔ Downloaded and saved video: ${filename}.mp4`));
//         resolve();
//       });
//       writer.on("error", (err) => {
//         console.error(clc.red.bold("✖ Error writing file:"), err);
//         reject(err);
//       });
//     });
//   } catch (error) {
//     console.error(clc.red.bold("✖ Error downloading video:"), error);
//     throw error;
//   }
// };

// // Express route handler to handle download requests
// export const downloadVideoRoute = async (req, res) => {
//   const { filename, fileUrl } = req.body;
//   if (!filename || !fileUrl) {
//     return res.status(400).json({ message: "Filename and fileUrl are required" });
//   }

//   try {
//     await downloadVideo(filename, fileUrl);
//     res.json({ message: "Video downloaded successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to download video", error });
//   }
// };

export const downloadVideo = async (video) => {
  const filenameWithExt = video.filename.endsWith(".mp4")
    ? video.filename
    : `${video.filename}.mp4`;
  const localPath = path.join(VIDEOS_DIR, filenameWithExt);
  const writer = fs.createWriteStream(localPath);

  try {
    const response = await axios.get(video.fileUrl, {
      responseType: "stream",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentComplete = Math.round((loaded * 100) / total);
        process.stdout.write(
          clc.blue.bold(
            `Downloading ${filenameWithExt}: ${percentComplete}% complete\r`
          )
        );
      },
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(
          clc.green.bold("\n✔ Download complete: ") + clc.green(filenameWithExt)
        );
        resolve();
      });
      writer.on("error", reject);
    });
  } catch (error) {
    console.log(
      clc.red.bold("✖ Failed to download ") + clc.red(filenameWithExt),
      error
    );
  }
};

// Sync videos function
export const syncVideos = async () => {
  try {
    console.log(clc.blue.bold("ℹ Starting sync..."));

    const online = await isServerReachable();
    console.log("online : " + online);
    if (!online) {
      console.log(
        clc.yellow.bold("⚠ Offline mode: Skipping sync and deletions.")
      );
      return;
    }

    const serverVideos = await fetchVideosList();
    const serverFilenames = serverVideos.map((video) =>
      video.filename.endsWith(".mp4") ? video.filename : `${video.filename}.mp4`
    );
    const localFilenames = fs.readdirSync(VIDEOS_DIR);

    const videosToDownload = serverVideos.filter(
      (video) =>
        !localFilenames.includes(
          video.filename.endsWith(".mp4")
            ? video.filename
            : `${video.filename}.mp4`
        )
    );

    const videosToDelete = localFilenames.filter(
      (filename) => !serverFilenames.includes(filename)
    );

    if (videosToDownload.length === 0 && videosToDelete.length === 0) {
      console.log(clc.cyan.bold("ℹ All videos are up to date."));
    }

    for (const video of videosToDownload) {
      await downloadVideo(video);
    }

    for (const filename of videosToDelete) {
      const filePath = path.join(VIDEOS_DIR, filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(
            clc.red.bold("✖ Failed to delete ") + clc.red(filename),
            err
          );
        } else {
          console.log(clc.green.bold(`✔ Deleted extra file: ${filename}`));
        }
      });
    }

    console.log(clc.green.bold("✔ Sync complete."));
  } catch (error) {
    console.error(clc.red.bold("✖ Error during sync:"), error);
  }
};

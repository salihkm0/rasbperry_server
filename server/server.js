
import express from "express";
import initializeServer from "./controllers/initializeServer.js";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes.js";
import { initializeDirectory } from "./utils/fileOperations.js";
import wifiRouter from "./routes/wifiRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", wifiRouter);
app.use("/api", videoRoutes);

const videosDirPath = initializeDirectory(); 
app.use("/videos", express.static(videosDirPath));

// Start the server
initializeServer(app);

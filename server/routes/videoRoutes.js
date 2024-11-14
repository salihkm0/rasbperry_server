import express from "express";
import { getVideosList, downloadVideo } from "../controllers/videoController.js";

const videoRouter = express.Router();

videoRouter.get("/videos-list", getVideosList);
videoRouter.post("/download-video", downloadVideo);

export default videoRouter;

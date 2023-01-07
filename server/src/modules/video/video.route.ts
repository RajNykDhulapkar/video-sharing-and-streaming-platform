import express from "express";
import requireUserMiddleware from "../../middlewares/requireUser.middleware";
import {
    findVideosHandler,
    streamVideoHandler,
    updateVideoHandler,
    uploadVideoHandler,
} from "./video.controller";

const router = express.Router();

// base route: /api/video

router.post("/", requireUserMiddleware, uploadVideoHandler);

router.patch("/:videoId", requireUserMiddleware, updateVideoHandler);

router.get("/:videoId", streamVideoHandler);

router.get("/", findVideosHandler);

export default router;

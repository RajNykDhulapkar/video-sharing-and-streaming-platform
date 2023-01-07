import express from "express";
import requireUserMiddleware from "../../middlewares/requireUser.middleware";
import { uploadVideoHandler } from "./video.controller";

const router = express.Router();

// base route: /api/video

router.post("/", requireUserMiddleware, uploadVideoHandler);

export default router;

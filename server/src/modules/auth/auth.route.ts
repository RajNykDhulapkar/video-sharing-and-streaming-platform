import express from "express";
import { googleOAuthHandler, loginHandler } from "./auth.controller";
import { loginSchema } from "./auth.schema";
import { processRequestBody } from "zod-express-middleware";

const router = express.Router();

router.post("/", processRequestBody(loginSchema.body), loginHandler);

router.get("/oauth/google", googleOAuthHandler);

export default router;

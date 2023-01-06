import express from "express";
import { processRequestBody } from "zod-express-middleware";
import { registerUserHandler } from "./user.controller";
import { registerUserSchema } from "./user.schema";

const router = express.Router();

// base route: /api/user

router.post("/", processRequestBody(registerUserSchema.body), registerUserHandler);

export default router;

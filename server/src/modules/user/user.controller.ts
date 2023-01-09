import { Request, Response, NextFunction } from "express";
import { RegisterUserBody } from "./user.schema";
import { createUser } from "./user.service";
import { StatusCodes } from "http-status-codes";
import HttpException from "../../core/exceptions/http.exception";

// path [POST] /api/user
export async function registerUserHandler(
    req: Request<{}, {}, RegisterUserBody>,
    res: Response,
    next: NextFunction
) {
    const { username, email, password } = req.body;
    try {
        // @ts-ignore
        await createUser({ username, email, password });
        return res.status(StatusCodes.CREATED).send({
            message: "User created successfully",
        });
    } catch (error: any) {
        if (error.code === 11000) {
            next(new HttpException("User already exists", StatusCodes.CONFLICT));
        }
        next(new HttpException(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

import { Request, Response, NextFunction } from "express";
import HttpException from "../../core/exceptions/http.exception";
import { findUserByEmail } from "../user/user.service";
import { LoginBody } from "./auth.schema";
import { StatusCodes } from "http-status-codes";

export async function loginHandler(
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction
) {
    const { email, password } = req.body;
    try {
        // find the user by email
        // if user not found, throw error
        // compare password with the hashed password
        // if password does not match, throw error
        // generate token
        // send token as cookie

        const user = await findUserByEmail(email);
        if (!user || !user.comparePassword(password)) {
            throw new HttpException("Invalid credentials", StatusCodes.UNAUTHORIZED);
        }

        const payload = omit();
    } catch (error) {}
}

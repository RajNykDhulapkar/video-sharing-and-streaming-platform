import { Request, Response, NextFunction } from "express";
import HttpException from "../../core/exceptions/http.exception";
import { findUserByEmail } from "../user/user.service";
import { LoginBody } from "./auth.schema";
import { StatusCodes } from "http-status-codes";
import omit from "../../core/helpers/omit";
import { User } from "../user/user.model";
import { signJWT } from "./auth.utils";

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

        // @ts-ignore
        const payload = omit<User>(user.toJSON(), ["password", "__v"]);
        const jwt = signJWT(payload);
        res.cookie("accessToken", jwt, {
            maxAge: 3.154e10, // 1 year
            httpOnly: true,
            domain: process.env.NODE_ENV === "production" ? "localhost" : undefined,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        return res.status(StatusCodes.OK).send({
            message: "Login successful",
        });
    } catch (error: any) {
        if (error instanceof HttpException) {
            return next(error);
        }
        next(new HttpException(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

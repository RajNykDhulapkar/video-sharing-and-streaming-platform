import { Request, Response, NextFunction, CookieOptions } from "express";
import HttpException from "../../core/exceptions/http.exception";
import { findUserByEmail } from "../user/user.service";
import { LoginBody } from "./auth.schema";
import { StatusCodes } from "http-status-codes";
import omit from "../../core/helpers/omit";
import { User } from "../user/user.model";
import { signJWT, signJWTRefreshToken } from "./auth.utils";
import { createSession } from "./auth.service";

const accessTokenCookieOptions: CookieOptions = {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
    domain: process.env.NODE_ENV === "production" ? "localhost" : undefined,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
};

const refreshTokenCookieOptions: CookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: 3.154e11, // 10 years
    // todo make this path dynamic
    path: "/api/auth/refresh",
};

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
        // generate token and create session
        // send token as cookie

        const user = await findUserByEmail(email);
        if (!user || !user.comparePassword(password)) {
            throw new HttpException("Invalid credentials", StatusCodes.UNAUTHORIZED);
        }

        // create a session
        const session = await createSession(user._id, req.get("user-agent") || "");

        // create access token
        // @ts-ignore
        const accessTokenPayload = omit<User>(user.toJSON(), ["password", "__v"]);

        const accessToken = signJWT(accessTokenPayload);

        res.cookie("accessToken", accessToken, accessTokenCookieOptions);

        // create refresh token
        // @ts-ignore
        const refreshTokenPayload = { session: session._id };
        const refreshToken = signJWTRefreshToken(refreshTokenPayload);

        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

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

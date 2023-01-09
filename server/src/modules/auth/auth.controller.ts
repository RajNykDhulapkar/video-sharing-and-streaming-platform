import { Request, Response, NextFunction, CookieOptions } from "express";
import HttpException from "../../core/exceptions/http.exception";
import { findAndUpdateUser, findUserByEmail } from "../user/user.service";
import { LoginBody } from "./auth.schema";
import { StatusCodes } from "http-status-codes";
import omit from "../../core/helpers/omit";
import { User } from "../user/user.model";
import { signJWT, signJWTRefreshToken } from "./auth.utils";
import { createSession, getGoogleOAuthTokens, getGoogleUser } from "./auth.service";
// import jwt from "jsonwebtoken";

const accessTokenCookieOptions: CookieOptions = {
    // TODO: make this dynamic
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
    domain: process.env.NODE_ENV === "production" ? "localhost" : undefined,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
};

const refreshTokenCookieOptions: CookieOptions = {
    ...accessTokenCookieOptions,
    // TODO: make this dynamic
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
        // @ts-ignore
        const accessToken = signJWT({ ...accessTokenPayload, session: session._id });

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

export async function googleOAuthHandler(req: Request, res: Response, next: NextFunction) {
    try {
        // get code from the qs
        // get id and access token with code
        // get user with token
        // upsert user and create session
        // create access and refresh token
        // set cookies and redirect back to client

        // get code from the query params
        const code = req.query.code as string;
        // get id and access token with code
        const { id_token, access_token } = await getGoogleOAuthTokens({ code });
        console.log({ id_token, access_token }, "from:auth.controller.ts");

        // alternative solution to get user with token is id_token not stored on client
        // const googleUser = jwt.decode(id_token) as any;
        // console.log({ googleUser }, "from:auth.controller.ts");

        const googleUser = await getGoogleUser({ id_token, access_token });
        if (!googleUser.verified_email) {
            throw new HttpException(
                "Email not verified by Google Oauth Provider, Google Account is not verified",
                StatusCodes.UNAUTHORIZED
            );
        }

        // upsert user
        // make sure the provider verifies the email eg: discord doesn't verify email of its users
        // alt solution use uniquer identifier from the provider eg: discord id, google id
        const user = await findAndUpdateUser(
            {
                email: googleUser.email,
            },
            {
                name: googleUser.name,
                email: googleUser.email,
                picture: googleUser.picture,
            },
            {
                upsert: true,
                new: true,
            }
        );

        // create a session
        if (!user) throw new HttpException("User not found", StatusCodes.NOT_FOUND);
        const session = await createSession(user._id, req.get("user-agent") || "");

        // create access token
        // @ts-ignore
        const accessTokenPayload = omit<User>(user.toJSON(), ["password", "__v"]);
        // @ts-ignore
        const accessToken = signJWT({ ...accessTokenPayload, session: session._id });

        res.cookie("accessToken", accessToken, accessTokenCookieOptions);

        // create refresh token
        // @ts-ignore
        const refreshTokenPayload = { session: session._id };
        const refreshToken = signJWTRefreshToken(refreshTokenPayload);

        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        // redirect back to client
        return res.redirect((process.env.CLIENT_URL as string) || "http://localhost:3000");
    } catch (error: any) {
        console.log(error);
        return res.redirect(
            ((process.env.CLIENT_URL as string) || "http://localhost:3000") + "/auth/oauth-error"
        );
    }
}

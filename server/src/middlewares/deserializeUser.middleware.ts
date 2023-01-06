import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../modules/auth/auth.utils";

export default function deserializeUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = (req.cookies.accessToken || req.headers.authorization || "").replace(
        /^Bearer\s/,
        ""
    );
    if (!accessToken) {
        return next();
    }
    try {
        const payload = verifyJWT(accessToken);
        if (payload) {
            res.locals.user = payload;
        }
    } catch (error) {
        return next();
    }
    return next();
}

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const EXPIRES_IN = process.env.EXPIRES_IN || "7d";

const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

export function signJWT(payload: string | Buffer | object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function signJWTRefreshToken(payload: string | Buffer | object) {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

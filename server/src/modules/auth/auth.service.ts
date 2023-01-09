import axios from "axios";
import { FilterQuery, UpdateQuery } from "mongoose";
import { Session, SessionModel } from "./auth.model";
import qs from "querystring";

export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });
    return session.toJSON();
}

export async function findSessions(query: FilterQuery<Session>) {
    return SessionModel.find(query).lean();
}

export async function updateSession(query: FilterQuery<Session>, update: UpdateQuery<Session>) {
    return SessionModel.updateOne(query, update);
}

// oauth google
export interface GoogleTokenResult {
    access_token: string;
    refresh_token: string;
    id_token: string;
    expires_in: number;
    scope: string;
}

export async function getGoogleOAuthTokens({ code }: { code: string }): Promise<GoogleTokenResult> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI as string,
        grant_type: "authorization_code",
    };
    console.log({ values });
    try {
        const res = await axios.post<GoogleTokenResult>(url, qs.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return res.data;
    } catch (error: any) {
        console.log(error, "from:auth.service.ts");
        // TODO throw proper error
        throw new Error(error);
    }
}

export interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export async function getGoogleUser({
    id_token,
    access_token,
}: {
    id_token: string;
    access_token: string;
}): Promise<GoogleUserResult> {
    const url = "https://www.googleapis.com/oauth2/v2/userinfo";
    try {
        const res = await axios.get<GoogleUserResult>(
            url +
                "?" +
                qs.stringify({
                    alt: "json",
                    access_token,
                }),
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        console.log(error, "from:auth.service.ts");
        // TODO throw proper error
        throw new Error(error);
    }
}

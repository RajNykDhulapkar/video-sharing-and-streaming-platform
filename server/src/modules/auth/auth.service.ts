import { FilterQuery, UpdateQuery } from "mongoose";
import { Session, SessionModel } from "./auth.model";

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

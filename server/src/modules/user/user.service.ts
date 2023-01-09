import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { User, UserModel } from "./user.model";

export async function createUser(user: Omit<User, "comparePassword">) {
    return UserModel.create(user);
}

export async function findUserByEmail(email: User["email"]) {
    return UserModel.findOne({ email });
}

export function findAndUpdateUser(
    query: FilterQuery<User>,
    update: UpdateQuery<User>,
    options: QueryOptions = {}
) {
    return UserModel.findOneAndUpdate(query, update, options);
}

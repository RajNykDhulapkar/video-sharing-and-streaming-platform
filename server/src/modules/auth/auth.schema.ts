import { object, string, TypeOf } from "zod";

export const loginSchema = {
    body: object({
        email: string({
            required_error: "Email is required",
        }).email({
            message: "Email is not valid",
        }),
        password: string({
            required_error: "Password is required",
        }),
    }),
};

export type LoginBody = TypeOf<typeof loginSchema.body>;

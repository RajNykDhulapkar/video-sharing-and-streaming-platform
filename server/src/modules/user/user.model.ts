import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import argon2 from "argon2";
import { StatusCodes } from "http-status-codes";
import HttpException from "../../core/exceptions/http.exception";

@pre<User>("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        try {
            const hash = await argon2.hash(this.password);
            this.password = hash;
            next();
        } catch (error: any) {
            next(new HttpException(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
        }
    } else {
        return next();
    }
})
export class User {
    @prop({ required: true, unique: true })
    public username: string;

    @prop({ required: true, unique: true })
    public email: string;

    @prop({ required: true })
    public password: string;

    @prop()
    public picture: string;

    public async comparePassword(password: string): Promise<boolean> {
        return argon2.verify(this.password, password);
    }
}

export const UserModel = getModelForClass(User, {
    schemaOptions: { timestamps: true },
});

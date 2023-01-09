import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "../user/user.model";

export class Session {
    @prop({
        required: true,
        ref: () => User,
    })
    public user: Ref<User>;

    @prop({
        default: true,
    })
    public valid: boolean;

    @prop()
    public userAgent: string;
}

export const SessionModel = getModelForClass(Session, {
    schemaOptions: {
        timestamps: true,
    },
});

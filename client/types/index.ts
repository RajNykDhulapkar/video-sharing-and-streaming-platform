export enum QueryKeys {
    ME = "me",
    USER = "user",
    VIDEO = "video",
    AUTH = "auth",
}

export interface Me {
    _id: string;
    username: string;
    email: string;
}

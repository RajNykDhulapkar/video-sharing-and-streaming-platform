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

export interface Video {
    _id: string;
    owner: string;
    published: boolean;
    videoId: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    extension: string;
    description: string;
    title: string;
}

import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "http://localhost:8000";

const userBase = `${base}/api/user`;
const authBase = `${base}/api/auth`;
const videoBase = `${base}/api/video`;

export function registerUser(payload: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}) {
    return axios.post(`${userBase}`, payload).then((res) => res.data);
}

export function loginUser(payload: { email: string; password: string }) {
    return axios
        .post(`${authBase}`, payload, {
            withCredentials: true,
        })
        .then((res) => res.data);
}

export function getMe() {
    return axios
        .get(`${userBase}`, {
            withCredentials: true,
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export function uploadVideo({
    formData,
    config,
}: {
    formData: FormData;
    config: {
        onUploadProgress: (progressEvent: any) => void;
    };
}) {
    return axios
        .post(videoBase, formData, {
            withCredentials: true,
            ...config,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => res.data);
}

export function updateVideo({
    videoId,
    ...payload
}: {
    videoId: string;
    title: string;
    description: string;
    published: boolean;
}) {
    console.log("payload", payload);
    return axios
        .patch(`${videoBase}/${videoId}`, payload, {
            withCredentials: true,
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log(err);
            throw err;
        });
}

export function getVideos() {
    return axios.get(videoBase).then((res) => res.data);
}

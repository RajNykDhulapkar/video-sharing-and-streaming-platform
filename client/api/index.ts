import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "http://localhost:8000";

const userBase = `${base}/api/user`;
const authBase = `${base}/api/auth`;

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

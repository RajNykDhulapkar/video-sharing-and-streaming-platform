import { StatusCodes } from "http-status-codes";
import HttpException from "./http.exception";

class VideoNotFoundException extends HttpException {
    constructor(
        public readonly message: string = "Video Not Found",
        public readonly status: number = StatusCodes.NOT_FOUND,
        public readonly error: string = "VideoNotFoundException"
    ) {
        super(message, status, error);
    }
}

export default VideoNotFoundException;

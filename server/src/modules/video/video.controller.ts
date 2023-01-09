import busboy from "busboy";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import HttpException from "../../core/exceptions/http.exception";
import { Video } from "./video.model";
import { createVideo, findVideo, findVideos } from "./video.service";
import fs from "fs";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";
import VideoNotFoundException from "../../core/exceptions/videoNotFound.exception";

const MIME_TYPES = ["video/mp4"];

const CHUNK_SIZE_IN_BYTES = 10 ** 6; // 1MB

function getPath({
    videoId,
    extension,
}: {
    videoId: Video["videoId"];
    extension: Video["extension"];
}) {
    return `${process.cwd()}/uploads/${videoId}.${extension}`;
}

export async function uploadVideoHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const bb = busboy({ headers: req.headers });
        const user = res.locals.user;
        const video = await createVideo({
            owner: user._id,
        });

        bb.on("file", async (_, file, info) => {
            if (!MIME_TYPES.includes(info.mimeType))
                throw new HttpException("Invalid File Type", StatusCodes.BAD_REQUEST);

            const extension = info.mimeType.split("/")[1];
            const filePath = getPath({
                videoId: video.videoId,
                extension: extension,
            });
            video.extension = extension;
            await video.save();
            const stream = fs.createWriteStream(filePath);
            file.pipe(stream);
        });

        bb.on("close", () => {
            res.writeHead(StatusCodes.CREATED, {
                Connection: "close",
                "Content-Type": "application/json",
            });
            res.write(JSON.stringify(video));
            res.end();
        });
        return req.pipe(bb);
    } catch (error) {
        if (error instanceof HttpException) {
            next(error);
        } else {
            next(new HttpException("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }
}

export async function updateVideoHandler(
    req: Request<UpdateVideoParams, {}, UpdateVideoBody>,
    res: Response,
    next: NextFunction
) {
    try {
        const { videoId } = req.params;
        const { title, description, published } = req.body;

        const video = await findVideo(videoId);

        // check if video exists
        if (!video) throw new VideoNotFoundException();

        // check if user is owner of video
        if (video.owner.toString() !== String(res.locals.user._id))
            throw new HttpException("Unauthorized", StatusCodes.UNAUTHORIZED);

        video.title = title;
        video.description = description;
        video.published = published;

        await video.save();

        return res.status(StatusCodes.OK).json(video);
    } catch (error) {
        if (error instanceof HttpException) {
            next(error);
        } else {
            next(new HttpException("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }
}

export async function streamVideoHandler(
    req: Request<UpdateVideoParams, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { videoId } = req.params;
        const range = req.headers.range;

        if (!range) throw new HttpException("Range header is required", StatusCodes.BAD_REQUEST);
        console.log(range);
        const video = await findVideo(videoId);

        if (!video) throw new VideoNotFoundException();

        const filePath = getPath({
            videoId: video.videoId,
            extension: video.extension,
        });
        const fileSizeInBytes = fs.statSync(filePath).size;
        const chunkStart = Number(range.replace(/\D/g, ""));
        const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, fileSizeInBytes - 1);
        const contentLength = chunkEnd - chunkStart + 1;
        const headers = {
            "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
            "Cross-Origin-Resource-Policy": "cross-origin",
        };
        res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);
        const videStream = fs.createReadStream(filePath, {
            start: chunkStart,
            end: chunkEnd,
        });
        videStream.pipe(res);
    } catch (error) {
        if (error instanceof HttpException) {
            next(error);
        } else {
            next(new HttpException("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }
}

export async function findVideosHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const videos = await findVideos();
        return res.status(StatusCodes.OK).json(videos);
    } catch (error) {
        next(new HttpException("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

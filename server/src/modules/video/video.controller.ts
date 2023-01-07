import busboy from "busboy";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import HttpException from "../../core/exceptions/http.exception";
import { Video } from "./video.model";
import { createVideo } from "./video.service";
import fs from "fs";

const MIME_TYPES = ["video/mp4"];

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

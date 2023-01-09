import { Dropzone } from "@mantine/dropzone";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Group, Text, Progress, Stack, TextInput, Switch } from "@mantine/core";
import { ArrowBigUpLine } from "tabler-icons-react";
import { useMutation } from "react-query";
import { updateVideo, uploadVideo } from "../api";
import { useForm } from "@mantine/form";
import { Video } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import { useVideo } from "../context/video";

const MIME_TYPES = {
    png: "image/png",
    gif: "image/gif",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    webp: "image/webp",
    mp4: "video/mp4",
    zip: "application/zip",
    csv: "text/csv",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    exe: "application/vnd.microsoft.portable-executable",
};

function EditVideoForm({
    videoId,
    setOpened,
}: {
    videoId: string;
    setOpened: Dispatch<SetStateAction<boolean>>;
}) {
    const { refetch } = useVideo();
    const form = useForm({
        initialValues: {
            title: "",
            description: "",
            published: true,
        },
    });
    const mutation = useMutation<
        AxiosResponse<Video>,
        AxiosError,
        Parameters<typeof updateVideo>[0]
    >(updateVideo, {
        onSuccess: () => {
            setOpened(false);
            refetch();
        },
    });

    const handleSubmit = (values: { title: string; description: string; published: boolean }) => {
        console.log({ videoId, ...values });
        return mutation.mutate({ videoId, ...values });
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput
                    label='Title'
                    required
                    placeholder='Title of my video'
                    {...form.getInputProps("title")}
                />
                <TextInput
                    label='Description'
                    required
                    placeholder='Description of my video'
                    {...form.getInputProps("description")}
                />
                <Switch label='Published' {...form.getInputProps("published")} />
                <Button type='submit' variant='outline' color='blue'>
                    Save
                </Button>
            </Stack>
        </form>
    );
}

function UploadVideo() {
    const [opened, setOpened] = useState(false);
    const [progress, setProgress] = useState(0);

    const mutation = useMutation(uploadVideo);

    const config = {
        onUploadProgress: (progressEvent: any) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
        },
    };

    function upload(files: File[]) {
        const formData = new FormData();
        formData.append("video", files[0]);
        mutation.mutate({ formData, config });
    }

    return (
        <>
            <Modal
                closeOnClickOutside={false}
                onClose={() => setOpened(false)}
                opened={opened}
                title='Upload Video'
                size='xl'
            >
                {progress === 0 && (
                    <Dropzone
                        onDrop={(files) => {
                            upload(files);
                            // setOpened(false);
                        }}
                        accept={[MIME_TYPES.mp4]}
                        multiple={false}
                    >
                        <Group
                            position='center'
                            spacing='xl'
                            style={{
                                minHeight: "50vh",
                                justifyContent: "center",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <ArrowBigUpLine />
                            <Text>Drag and drop your video here or click to find</Text>
                        </Group>
                    </Dropzone>
                )}
                {progress > 0 && (
                    <Progress size='xl' mb='xl' label={`${progress}%`} value={progress} />
                )}
                {mutation.data &&
                    (() => {
                        console.log(mutation.data);
                        return (
                            <EditVideoForm videoId={mutation.data.videoId} setOpened={setOpened} />
                        );
                    })()}
            </Modal>
            <Button onClick={() => setOpened(true)}>Upload Video</Button>
        </>
    );
}

export default UploadVideo;

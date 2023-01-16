import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";
import { Video } from "../types";

function VideoTeaser({ video }: { video: Video }) {
    return (
        <Link href={`/watch/${video.videoId}`} passHref>
            <Card
                shadow='sm'
                p='lg'
                withBorder
                radius='md'
                component='a'
                href={`/watch/${video.videoId}`}
            >
                <Card.Section>
                    <Image
                        src='https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80'
                        height={160}
                        alt='Norway'
                    />
                </Card.Section>

                <Group position='apart' mt='md' mb='xs'>
                    <Text weight={500}>{video.title}</Text>
                    <Badge color='pink' variant='light'>
                        On Sale
                    </Badge>
                </Group>
                <Text size='sm' color='dimmed'>
                    {video.description}
                </Text>

                <Button variant='light' color='blue' fullWidth mt='md' radius='md'>
                    Book classic tour now
                </Button>
            </Card>
        </Link>
    );
}

export default VideoTeaser;

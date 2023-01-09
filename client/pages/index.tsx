import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ReactElement } from "react";
import HomePageLayout from "../layout/Home";
import { useVideo } from "../context/video";
import VideoTeaser from "../components/VideoTeaser";
import { SimpleGrid } from "@mantine/core";

const Home = () => {
    const { videos } = useVideo();
    return (
        <div className={styles.container}>
            <SimpleGrid cols={3}>
                {(videos || []).map((video) => (
                    <VideoTeaser key={video.videoId} video={video} />
                ))}
            </SimpleGrid>
        </div>
    );
};

Home.getLayout = function (page: ReactElement) {
    return <HomePageLayout>{page}</HomePageLayout>;
};

export default Home;

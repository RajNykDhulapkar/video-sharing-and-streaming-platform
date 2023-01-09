import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ReactElement } from "react";
import HomePageLayout from "../layout/Home";
import { useVideo } from "../context/video";

const Home = () => {
    const { videos } = useVideo();
    return <div className={styles.container}>{JSON.stringify(videos)}</div>;
};

Home.getLayout = function (page: ReactElement) {
    return <HomePageLayout>{page}</HomePageLayout>;
};

export default Home;

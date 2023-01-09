import { Loader } from "@mantine/core";
import React, { createContext } from "react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from "react-query";
import { getVideos } from "../api";
import { QueryKeys, Video } from "../types";

const VideoContext = createContext<{
    videos: Video[] | undefined;
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<any, unknown>>;
    // @ts-ignore
}>(null);

const VideoContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading, refetch } = useQuery(QueryKeys.VIDEO, getVideos);
    return (
        <VideoContext.Provider
            value={{
                videos: data,
                refetch,
            }}
        >
            {isLoading ? <Loader /> : children}
        </VideoContext.Provider>
    );
};

const useVideo = () => React.useContext(VideoContext);

export { VideoContextProvider, useVideo };

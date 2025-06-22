"use client";
import { useNowPlaying } from "@/hooks/useNowPlaying";

export const ListenersCount = () => {
    const { data: nowPlayingData } = useNowPlaying(true);
    const listenersCount = nowPlayingData?.station?.mounts?.[0]?.listeners?.current || 0;
    return (
        <p className="text-xs text-white">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {listenersCount} oyente{listenersCount > 1 ? "s" : ""} conectado{listenersCount > 1 ? "s" : ""}
        </p>
    );
};

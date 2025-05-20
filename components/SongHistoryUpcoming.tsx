"use client";

import { getNowPlaying } from "@/api/endpoints/nowPlayingEndpoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { formatTime } from "@/lib/dates";
import { NowPlayingResponse } from "@/types/NowPlayingResponse";
import { Song } from "@/types/Song";
import { Clock, Music, History, Calendar } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function SongHistoryUpcoming() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const { data: nowPlaying } = useNowPlaying();


    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            setCurrentTime(`${hours}:${minutes}`);
        };

        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 60000);

        return () => clearInterval(interval);
    }, []);
    // Renderizar una canción
    const renderSong = (song: Song, isHistory: boolean, time: number) => (
        <div
            key={song.id}
            className="flex items-center gap-3 p-3 border-b border-gray-700 hover:bg-[#2a2a2a] transition-colors"
        >
            <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                <Image src={song.art || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{song.title}</h4>
                <p className="text-xs text-gray-300 truncate">{song.artist}</p>
            </div>

            <div className="flex items-center gap-1 text-xs text-[#03a9f4]">
                {isHistory ? <History className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                <span>{formatTime(time)}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-[#333333] rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-700">
                <Music className="h-5 w-5 text-[#03a9f4]" />
                <h3 className="text-xl font-bold">Canciones</h3>
                <div className="ml-auto flex items-center gap-1 text-xs bg-[#424242] px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3 text-[#03a9f4]" />
                    <span>Ahora: {currentTime}</span>
                </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid grid-cols-2 p-0 bg-[#2a2a2a]">
                    <TabsTrigger
                        value="upcoming"
                        className="data-[state=active]:bg-[#03a9f4] data-[state=active]:text-white rounded-none py-3"
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        Próxima
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="data-[state=active]:bg-[#03a9f4] data-[state=active]:text-white rounded-none py-3"
                    >
                        <History className="h-4 w-4 mr-2" />
                        Historial
                    </TabsTrigger>
                </TabsList>
                {nowPlaying && (
                    <>
                        <TabsContent value="upcoming" className="m-0 max-h-[400px] overflow-y-auto">
                            <div className="divide-y divide-gray-700">
                                {nowPlaying.playing_next && renderSong(nowPlaying.playing_next?.song, false, nowPlaying.playing_next?.played_at)}
                            </div>
                        </TabsContent>
                        <TabsContent value="history" className="m-0 max-h-[400px] overflow-y-auto">
                            <div className="divide-y divide-gray-700">
                                {nowPlaying?.song_history?.map((song) => renderSong(song.song, true, song?.played_at))}
                            </div>
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
}

"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { WelcomeDialog } from "./WelcomeDialog";

export function FloatingPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(80);
    const [elapsed, setElapsed] = useState(0);
    const { data: nowPlaying } = useNowPlaying();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isLive = nowPlaying?.live?.is_live ?? false;
    const playingInfo = useMemo(() => {
        if (isLive) {
            return {
                title: "En vivo",
                artist: nowPlaying?.live?.streamer_name,
                album: nowPlaying?.station?.name,
                artwork: nowPlaying?.live?.art || "/placeholder.svg",
            };
        } else {
            return {
                title: nowPlaying?.now_playing?.song?.title,
                artist: nowPlaying?.now_playing?.song?.artist,
                album: nowPlaying?.station?.name,
                artwork: nowPlaying?.now_playing?.song?.art || "/placeholder.svg",
            };
        }
    }, [isLive, nowPlaying]);
    const updateElapsed = () => {
        if (isLive) {
            const currentTime = Math.floor(Date.now() / 1000);
            const currentLivePlayedAt = nowPlaying?.live?.broadcast_start ?? currentTime;
            setElapsed(currentTime - currentLivePlayedAt);
            return;
        }
        if (nowPlaying?.now_playing) {
            const duration = nowPlaying.now_playing.duration;
            const currentTime = Math.floor(Date.now() / 1000);
            const currentTrackPlayedAt = nowPlaying.now_playing?.played_at ?? currentTime;
            let updatedElapsed = currentTime - currentTrackPlayedAt;
            if (updatedElapsed < 0) {
                updatedElapsed = 0;
            } else if (updatedElapsed >= duration) {
                updatedElapsed = duration;
            }
            setElapsed(updatedElapsed);
        }
    };
    const updateMediaMetadata = () => {
        if ("mediaSession" in navigator && (nowPlaying?.now_playing?.song || nowPlaying?.live)) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: playingInfo.title + " - " + playingInfo.album,
                artist: playingInfo.artist,
                album: playingInfo.album,
                artwork: [
                    {
                        src: playingInfo.artwork,
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            });
            navigator.mediaSession.setActionHandler("stop", togglePlayPause);
            navigator.mediaSession.setActionHandler("play", togglePlayPause);
            navigator.mediaSession.setActionHandler("pause", togglePlayPause);
        } else {
            navigator.mediaSession.metadata = new MediaMetadata({});
        }
    };

    const togglePlayPause = useCallback(() => {
        let isMediaStatePaused = false;
        if ("mediaSession" in navigator) {
            isMediaStatePaused = navigator.mediaSession.playbackState == "paused";
        }
        if (isPlaying && !isMediaStatePaused) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setIsPlaying(false);
            if ("mediaSession" in navigator) {
                navigator.mediaSession.playbackState = "paused";
            }
        } else {
            if (nowPlaying?.station?.listen_url) {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = ""; // Evita que quede colgado
                    audioRef.current = null;
                }
                const newAudio = new Audio(nowPlaying.station.listen_url);
                newAudio.volume = volume / 100;
                newAudio.play().catch((error) => {
                    console.error("Error playing audio:", error);
                });
                audioRef.current = newAudio;
                navigator.mediaSession.playbackState = "playing";
                setIsPlaying(true);
            }
        }
    }, [isPlaying, nowPlaying?.station?.listen_url, volume]);

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0]);
    };

    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeX className="h-4 w-4" />;
        if (volume < 50) return <Volume1 className="h-4 w-4" />;
        return <Volume2 className="h-4 w-4" />;
    };

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Calculate progress percentage
    const progressPercentage = (elapsed / (nowPlaying?.now_playing?.duration ?? 0)) * 100;

    useEffect(() => {
        let metadataInterval: NodeJS.Timeout | null = null;
        if (isPlaying) {
            updateMediaMetadata();
            metadataInterval = setInterval(() => {
                updateMediaMetadata();
            }, 4000);
        }

        return () => {
            if (metadataInterval) {
                clearInterval(metadataInterval);
            }
        };
    }, [isPlaying, nowPlaying,isLive, togglePlayPause]);
    useEffect(() => {
        if (nowPlaying) {
            progressIntervalRef.current = setInterval(() => {
                updateElapsed();
            }, 1000);
        }
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [nowPlaying]);

    useEffect(() => {
        audioRef.current = new Audio(nowPlaying?.station?.listen_url);
        audioRef.current.volume = volume / 100;
        if(nowPlaying?.station?.listen_url){
            setShowWelcomeDialog(true);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [nowPlaying?.station?.listen_url]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    return (
        <>
            {showWelcomeDialog && <WelcomeDialog onStartPlaying={()=>{
                if(!isPlaying) {
                    togglePlayPause();
                }
            }} playingInfo={
                playingInfo
            }/>}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800">
                <div className="flex flex-row gap-2">
                    <div
                        className="h-1 bg-[var(--primary-color)]"
                        style={{ width: `${isLive ? 0 : progressPercentage}%`, transition: "width 0.1s linear" }}
                    ></div>
                </div>
            </div>
            <div className="fixed top-1 left-0 right-0 z-50 bg-[#333333] border-b border-none shadow-md">
                <div className="mx-auto px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={togglePlayPause}
                                className="bg-[var(--primary-color)] hover:bg-[var(--primary-dark-color)] text-white min-h-10  min-w-10 rounded-full p-0"
                                aria-label={isPlaying ? "Pausar" : "Reproducir"}
                            >
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                            </Button>

                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                <img
                                    src={playingInfo.artwork}
                                    alt={`${nowPlaying?.now_playing?.song?.title} cover`}
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-sm text-white">{playingInfo.title}</span>
                                <span className="text-xs text-gray-300">{playingInfo.artist}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {nowPlaying?.is_online && (
                                <span className="text-xs text-gray-300">
                                    {isLive ? (
                                        formatTime(elapsed)
                                    ) : (
                                        <>
                                            {formatTime(elapsed)}/{formatTime(nowPlaying?.now_playing?.duration ?? 0)}
                                        </>
                                    )}
                                </span>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-[var(--primary-color)]">{getVolumeIcon()}</span>
                                <Slider
                                    value={[volume]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={handleVolumeChange}
                                    className="w-12 lg:w-16"
                                    aria-label="Volumen"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { NowPlayingResponse } from "@/types/NowPlayingResponse";
import { getNowPlaying } from "@/api/endpoints/nowPlayingEndpoints";

interface Song {
    title: string;
    artist: string;
    cover: string;
    duration: number; // duración en segundos
}

export function FloatingPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(80);
    const [nowPlaying, setNowPlaying] = useState<NowPlayingResponse | undefined>();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchNowPlaying = async () => {
        try {
            const res = await getNowPlaying();
            setNowPlaying(res.data);
        } catch (error) {
            console.error("Error fetching now playing data:", error);
        }
    };

    useEffect(() => {
        fetchNowPlaying();
        const interval = setInterval(() => {
            fetchNowPlaying();
        }, 10000); // Fetch every 10 seconds

        return () => {
            clearInterval(interval);
        };
    }, []);

    // Lista de canciones de ejemplo para simular cambios
    const sampleSongs: Song[] = [
        {
            title: "Amanecer",
            artist: "Los Rayos del Sol",
            cover: "/placeholder.svg?height=60&width=60",
            duration: 217, // 3:37
        },
        {
            title: "Noche de Verano",
            artist: "Luna Llena",
            cover: "/placeholder.svg?height=60&width=60",
            duration: 243, // 4:03
        },
        {
            title: "Ritmo Latino",
            artist: "Grupo Tropical",
            cover: "/placeholder.svg?height=60&width=60",
            duration: 198, // 3:18
        },
        {
            title: "Melodía Suave",
            artist: "Voces del Viento",
            cover: "/placeholder.svg?height=60&width=60",
            duration: 274, // 4:34
        },
    ];

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio(nowPlaying?.station?.listen_url);
        audioRef.current.volume = volume / 100;
        audioRef.current.autoplay = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [nowPlaying?.station?.listen_url]);

    // Update volume when changed
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.error("Error playing audio:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

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
    const progressPercentage = ((nowPlaying?.now_playing?.elapsed ?? 0) / (nowPlaying?.now_playing?.duration ?? 0)) * 100;

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800">
                <div className="flex flex-row gap-2">
                    <div
                        className="h-1 bg-[#03a9f4]"
                        style={{ width: `${progressPercentage}%`, transition: "width 0.1s linear" }}
                    ></div>
                </div>
            </div>
            <div className="fixed top-1 left-0 right-0 z-50 bg-[#333333] border-b border-[#03a9f4]/20 shadow-md">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={togglePlayPause}
                                className="bg-[#03a9f4] hover:bg-[#0288d1] min-h-10  min-w-10 rounded-full p-0"
                                aria-label={isPlaying ? "Pausar" : "Reproducir"}
                            >
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                            </Button>

                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                <img
                                    src={nowPlaying?.now_playing?.song?.art || "/placeholder.svg"}
                                    alt={`${nowPlaying?.now_playing?.song?.title} cover`}
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-sm text-white">
                                    {nowPlaying?.now_playing?.song?.title}
                                </span>
                                <span className="text-xs text-gray-300">{nowPlaying?.now_playing?.song?.artist}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[#03a9f4]">{getVolumeIcon()}</span>
                                <Slider
                                    value={[volume]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={handleVolumeChange}
                                    className="w-8 lg:w-24"
                                    aria-label="Volumen"
                                />
                            </div>
                            {nowPlaying?.is_online && (
                                <span className="text-xs text-gray-300">
                                    {formatTime(nowPlaying?.now_playing?.elapsed ?? 0)}/
                                    {formatTime(nowPlaying?.now_playing?.duration ?? 0)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

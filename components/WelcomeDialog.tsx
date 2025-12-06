"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Music, X, Ban, Info } from "lucide-react";
import Image from "next/image";
import { ListenersCount } from "./ListenersCount";

interface WelcomeDialogProps {
    onStartPlaying: () => void;
    playingInfo: PlayingInfo;
}

export function WelcomeDialog({ onStartPlaying, playingInfo }: WelcomeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const storedUntil = localStorage.getItem("welcome-until");

        if (!storedUntil || Date.now() > Number(storedUntil)) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handlePlayNow = () => {
        onStartPlaying();
        setIsOpen(false);
    };

    const handleDontShowAgain = () => {
        setIsOpen(false);
        // Set a timestamp for 3 days from now to avoid showing the dialog again
        const threeDaysFromNow = Date.now() + 3 * 24 * 60 * 60 * 1000;
        localStorage.setItem("welcome-until", String(threeDaysFromNow));
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="md:max-w-md md:h-auto max-w-full w-full h-full bg-[#333333] border-gray-700 text-white">
                <DialogHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-[#f44336]/10 rounded-full flex items-center justify-center">
                        <Music className="h-8 w-8 text-[var(--primary-color)]" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-center">
                        ¡Bienvenido a <span className="text-[var(--primary-color)]">Refugio musical</span>!
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Estamos transmitiendo en vivo. Únete a nuestra comunidad de oyentes.
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-[#424242] rounded-lg p-4 my-2 h-fit">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={playingInfo?.artwork || "/placeholder.svg"}
                                alt={`${playingInfo?.title} cover`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-red-400 uppercase tracking-wide">
                                    EN VIVO
                                </span>
                            </div>
                            <h3 className="font-bold text-white truncate text-wrap">{playingInfo?.title}</h3>
                            <p className="text-sm text-gray-300 truncate">{playingInfo?.artist}</p>
                            <p className="text-xs text-[var(--primary-color)] truncate">{playingInfo?.album}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={handlePlayNow}
                        className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-dark-color)] text-white font-bold py-3 text-base"
                    >
                        <Play className="h-5 w-5 mr-2 fill-current" />
                        Reproducir Ahora
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className=" border-gray-600 text-gray-300 hover:bg-[#424242] hover:text-white py-3 bg-transparent"
                    >
                        <X className="h-5 w-5 mr-2 fill-current" />
                        Reproducir mas tarde
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleDontShowAgain}
                        className=" border-gray-600 text-gray-300 hover:bg-[#424242] hover:text-white bg-transparent"
                    >
                        <Ban className="h-5 w-5 mr-2" />
                        No volver a mostrar
                    </Button>
                </div>

                <div className="bg-[#2a2a2a] rounded-lg p-3  h-fit">
                    <div className="flex items-start gap-3">
                        <div>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                <Info className="h-4 w-4 mr-1 inline-flex" /> También puedes iniciar la reproducción en
                                cualquier momento haciendo clic en el botón{" "}
                                <span className="inline-flex items-center mx-1 px-1 py-1 bg-[var(--primary-color)] text-white rounded text-xs font-medium">
                                    <Play className="h-2 w-2 mr-1 fill-current" />
                                    Play
                                </span>{" "}
                                del reproductor.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-2 border-t border-gray-700">
                    <ListenersCount />
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Music, Volume2, X } from "lucide-react";
import Image from "next/image";
import { useNowPlaying } from "@/hooks/useNowPlaying";

interface WelcomeDialogProps {
    onStartPlaying: () => void;
    playingInfo: PlayingInfo;
}

export function WelcomeDialog({ onStartPlaying, playingInfo }: WelcomeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: nowPlayingData } = useNowPlaying(true);
    // Verificar si mostrar el diálogo al cargar la página
    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem("radio-cabral-welcome-seen");
        if (!hasSeenWelcome) {
            // Mostrar el diálogo después de un pequeño delay para mejor UX
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
        localStorage.setItem("radio-cabral-welcome-seen", "true");
    };

    const handleClose = () => {
        setIsOpen(false);
        // No marcar como visto permanentemente, solo cerrar por esta sesión
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="md:max-w-md md:h-auto max-w-full w-full h-full bg-[#333333] border-gray-700 text-white">
                <DialogHeader className="text-center space-y-3">
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

                {/* Información de la canción actual */}
                <div className="bg-[#424242] rounded-lg p-4 my-4">
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
                            <h3 className="font-bold text-white truncate">{playingInfo?.title}</h3>
                            <p className="text-sm text-gray-300 truncate">{playingInfo?.artist}</p>
                            <p className="text-xs text-[var(--primary-color)] truncate">{playingInfo?.album}</p>
                        </div>
                    </div>
                </div>

                {/* Botón principal de reproducir */}
                <Button
                    onClick={handlePlayNow}
                    className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-dark-color)] text-white font-bold py-3 text-base"
                >
                    <Play className="h-5 w-5 mr-2 fill-current" />
                    Reproducir Ahora
                </Button>
                <Button
                    variant="outline"
                    onClick={()=>setIsOpen(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-[#424242] hover:text-white bg-transparent mt-[-2rem] md:mt-0  mb-3"
                >
                    Reproducir mas tarde
                </Button>

                {/* Información adicional */}
                <div className="bg-[#2a2a2a] rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[var(--primary-color)]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Volume2 className="h-4 w-4 text-[var(--primary-color)]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                También puedes iniciar la reproducción en cualquier momento haciendo clic en el botón{" "}
                                <span className="inline-flex items-center mx-1 px-2 py-1 bg-[var(--primary-color)] text-white rounded text-xs font-medium">
                                    <Play className="h-3 w-3 mr-1 fill-current" />
                                    Play
                                </span>{" "}
                                del reproductor.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDontShowAgain}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-[#424242] hover:text-white bg-transparent"
                    >
                        No volver a mostrar
                    </Button>
                </div>

                {/* Indicador de usuarios en línea */}
                <div className="text-center pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        {nowPlayingData?.station?.mounts?.[0].listeners?.current} oyentes conectados
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import type React from "react";
import { io, Socket } from "socket.io-client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Maximize2, Minimize2, Facebook, LogOut, Lock } from "lucide-react";
import { StorageFacebookInfo } from "@/types/StorageFacebookInfo";
import { authWithFacebook } from "@/lib/facebookAuth";
import { getChat, postAuthSocket, postChatLogout, postChatMessage } from "@/api/endpoints/chatApi";
import { FB_AUTH_KEY, MAX_CHAT_MESSAGES } from "@/lib/constants";
import { ChatMessage } from "@/types/ChatMessage";
import { AnonymousLogin } from "./AnonymousLogin";

interface props {
    exclusive?: boolean;
}

export const LiveChat: React.FC<props> = ({ exclusive = false }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const socketRef = useRef<Socket>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [facebookUser, setFacebookUser] = useState<StorageFacebookInfo | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [showProfileTooltip, setShowProfileTooltip] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const profileButtonRef = useRef<HTMLButtonElement>(null);
    const isAuthenticated = !!facebookUser;
    const authSocket = async (socketId: string) => {
        try {
            const authStore = localStorage.getItem(FB_AUTH_KEY);
            if (!authStore) {
                throw new Error("No se encontró autenticación de Facebook en localStorage");
            }
            await postAuthSocket(socketId);
            setFacebookUser(JSON.parse(authStore));
        } catch (error) {
            console.error("Error al autenticar socket:", error);
        }
    };

    const fetchChat = async () => {
        try {
            const res = await getChat();
            setMessages(res.data.messages);
            setOnlineUsers(res.data.activeUsers ?? 0);
        } catch (error) {
            console.error("Error al autenticar socket:", error);
        }
    };
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isFullscreen]);

    useEffect(() => {
        fetchChat();
        const handleActiveUsers = (payload: number) => {
            console.log({ payload });
            setOnlineUsers(payload);
        };
        const handleNewMessage = (payload: ChatMessage) => {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, payload];
                if (updatedMessages.length > MAX_CHAT_MESSAGES) {
                    updatedMessages.splice(0, updatedMessages.length - MAX_CHAT_MESSAGES);
                }
                return updatedMessages;
            });
        };
        socketRef.current = io({
            autoConnect: true,
            transports: ["websocket"],
        });
        socketRef.current.on("connect", async () => {
            const socketId = socketRef.current?.id;
            const facebookAuth = localStorage.getItem(FB_AUTH_KEY);
            if (facebookAuth && socketId) {
                authSocket(socketId);
            }
        });
        socketRef.current.on("active-users", handleActiveUsers);
        socketRef.current.on("new-message", handleNewMessage);
        return () => {
            socketRef.current?.off("active-users", handleActiveUsers);
            socketRef.current?.off("new-message", handleNewMessage);
            socketRef.current?.disconnect();
        };
    }, []);

    const handleFacebookLogin = async () => {
        setIsAuthenticating(true);

        try {
            const socketId = socketRef.current?.id;
            const facebookAuth = await authWithFacebook();
            localStorage.setItem(FB_AUTH_KEY, JSON.stringify(facebookAuth));
            if (socketId) {
                await authSocket(socketId);
            }
        } catch (error) {
            console.error("Error al autenticar con Facebook:", error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleLogout = async () => {
        setFacebookUser(null);
        setShowProfileTooltip(false);
        if (socketRef.current) {
            postChatLogout(socketRef.current?.id ?? "")
                .then(() => {
                    localStorage.setItem(FB_AUTH_KEY, "");
                })
                .catch((error) => {});
        }
    };

    // Bloquear el scroll del body cuando está en pantalla completa
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isFullscreen]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;
        try {
            await postChatMessage(socketRef.current?.id || "", newMessage);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
        setNewMessage("");
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const toggleProfileTooltip = () => {
        setShowProfileTooltip(!showProfileTooltip);
    };

    const renderChatMessages = (ref: React.RefObject<HTMLDivElement>) => (
        <div
            ref={ref}
            className="flex-1 overflow-y-auto p-2 space-y-1 text-sm bg-[#0e0e10]"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 #0e0e10" }}
        >
            {messages.map((message) => (
                <div key={message.id} className="leading-tight">
                    <span className="text-gray-400 text-xs mr-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{ color: message.color }} className="font-semibold">
                        {message.username}:{" "}
                    </span>
                    <span className="text-gray-200">{message.text}</span>
                </div>
            ))}
        </div>
    );
    const renderProfileTooltip = () => {
        if (!showProfileTooltip || !facebookUser) return null;

        return (
            <div className="absolute bottom-full left-0 mb-2 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <img
                            src={facebookUser.user.picture.data.url || "/placeholder.svg"}
                            alt={facebookUser.user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-white font-medium text-sm">{facebookUser.user.name}</p>
                        <div className="flex items-center gap-1">
                            <span className="text-[var(--primary-color)] text-xs" title="Usuario verificado">
                                ✓
                            </span>
                            <span className="text-gray-400 text-xs">Verificado</span>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#333] p-2"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                </Button>
            </div>
        );
    };

    const renderChatInput = () => {
        if (!isAuthenticated) {
            return (
                <div className="p-2 border-t border-gray-800 bg-[#1f1f23] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Autentícate para escribir mensajes</span>
                    </div>
                    <Button
                        onClick={handleFacebookLogin}
                        disabled={isAuthenticating}
                        className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-white font-medium"
                        size="sm"
                    >
                        {isAuthenticating ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Conectando...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Facebook className="h-4 w-4" />
                                Continuar con Facebook
                            </div>
                        )}
                    </Button>
                </div>
            );
        }

        return (
            <div className="p-2 border-t border-gray-800 bg-[#1f1f23]">
                <form
                    className="flex gap-2 items-center"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                >
                    <div className="relative mb-[-3px]">
                        <button
                            ref={profileButtonRef}
                            type="button"
                            onClick={toggleProfileTooltip}
                            className="relative h-7 w-7  rounded-full overflow-hidden hover:ring-2 hover:ring-[var(--primary-color)] transition-all"
                        >
                            <img
                                src={facebookUser.user.picture.data.url || "/placeholder.svg"}
                                alt={facebookUser.user.name || "Usuario"}
                                className="w-full h-full object-cover"
                            />
                        </button>
                        {renderProfileTooltip()}
                    </div>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Enviar un mensaje"
                        className="bg-[#18181b] border-gray-700 text-white text-sm h-8 focus-visible:ring-[var(--primary-color)] flex-1"
                    />
                    <Button type="submit" size="sm" className="bg-[var(--primary-color)] hover:bg-[#0288d1] h-8 px-2">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        );
    };

    const renderChatWrapper = (children: React.JSX.Element) => {
        if (exclusive) {
            return (
                <div className="h-[100vh] w-[100vw] fixed top-0 left-0 z-50 bg-[#0e0e10] flex flex-col">{children}</div>
            );
        }
        if (isFullscreen) {
            return (
                <div
                    className="fixed inset-0 z-50 bg-[#0e0e10] flex flex-col"
                    style={{ top: "69px", height: "calc(100vh - 69px)" }}
                >
                    {children}
                </div>
            );
        }

        return (
            <div className="flex flex-col h-[400px] bg-[#18181b] rounded-lg overflow-hidden border border-gray-700">
                {children}
            </div>
        );
    };

    return renderChatWrapper(
        <>
        <AnonymousLogin/>
            <div className="bg-[#1f1f23] p-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-[var(--primary-color)]" />
                <h3 className="font-bold text-sm text-white">CHAT EN VIVO</h3>
                <div className="ml-auto flex items-center gap-2">
                    <div className="bg-[var(--primary-color)] text-white text-xs px-2 py-0.5 rounded-full">
                        {onlineUsers} en línea
                    </div>
                    {!exclusive && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-[#333]"
                        >
                            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </div>

            {renderChatMessages(chatContainerRef)}
            {renderChatInput()}
        </>
    );
};

"use client";

import type React from "react";
import { io, Socket } from "socket.io-client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Maximize2, Minimize2, Facebook, LogOut, Lock, LogIn } from "lucide-react";
import { StorageFacebookInfo } from "@/types/StorageFacebookInfo";
import { authWithFacebook } from "@/lib/facebookAuth";
import { getChat, postAuthSocket, postChatLogin, postChatLogout, postChatMessage } from "@/api/endpoints/chatApi";
import { SOCKET_TOKEN_KEY, MAX_CHAT_MESSAGES, USER_INFO_KEY } from "@/lib/constants";
import { ChatMessage } from "@/types/ChatMessage";
import { AnonymousLogin } from "./AnonymousLogin";
import { LoginCredentials } from "@/types/LoginCredentials";
import { ChatUser } from "@/types/ChatUser";
import { useToast } from "@/hooks/useToast";

interface props {
    exclusive?: boolean;
}

export const LiveChat: React.FC<props> = ({ exclusive = false }) => {
    const [messages, setMessages] = useState<ChatMessage[] | undefined>([]);
    const socketRef = useRef<Socket>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [user, setUser] = useState<ChatUser | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [showProfileTooltip, setShowProfileTooltip] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const profileButtonRef = useRef<HTMLButtonElement>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { toast } = useToast();
    const isAuthenticated = !!user;
    const handleSessionExpired = async () => {
        toast({
            title: "Sesión expirada",
            description: "Por favor, inicia sesión nuevamente para continuar.",
            variant: "destructive",
        });
        setUser(null);
        await handleLogout();
        setIsFormOpen(true);
    };

    const authSocket = async (socketId: string) => {
        try {
            const authStore = localStorage.getItem(SOCKET_TOKEN_KEY);
            const userInfo = localStorage.getItem(USER_INFO_KEY);
            if (!authStore || !userInfo) {
                throw new Error("No se encontró autenticación de Facebook en localStorage");
            }
            await postAuthSocket(socketId);
            setUser(JSON.parse(userInfo));
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
            const socketAuth = localStorage.getItem(SOCKET_TOKEN_KEY);
            if (socketAuth && socketId) {
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

    const handleLogout = async () => {
        setUser(null);
        setShowProfileTooltip(false);
        localStorage.setItem(SOCKET_TOKEN_KEY, "");
        localStorage.setItem(USER_INFO_KEY, "");
        if (socketRef.current) {
            postChatLogout(socketRef.current?.id ?? "");
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
        } catch (error: any) {
            if (error.response?.status === 401) {
                handleSessionExpired();
            } else {
                toast({
                    title: "Error al enviar mensaje",
                    description: error.message || "Ocurrió un error al enviar mensaje.",
                    variant: "destructive",
                });
            }
        }
        setNewMessage("");
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const toggleProfileTooltip = () => {
        setShowProfileTooltip(!showProfileTooltip);
    };

    const handleLogin = async (data: LoginCredentials) => {
        console.log("Form submitted with data:", data);
        try {
            const socketId = socketRef.current?.id;
            if (socketId) {
                const res = await postChatLogin(socketId, data.username, data.email);
                setUser(res.data.user);
                setIsFormOpen(false);
                localStorage.setItem(SOCKET_TOKEN_KEY, res.data.token);
                localStorage.setItem(USER_INFO_KEY, JSON.stringify(res.data.user));
            } else {
                throw new Error("Socket ID is not available");
            }
        } catch (err: any) {
            toast({
                title: "Error al iniciar sesión",
                description: err.message || "Ocurrió un error al intentar iniciar sesión.",
                variant: "destructive",
            });
        }
    };

    const renderChatMessages = (ref: React.RefObject<HTMLDivElement>) => (
        <div
            ref={ref}
            className="flex-1 overflow-y-auto p-2 space-y-1 text-sm bg-[#0e0e10]"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 #0e0e10" }}
        >
            {messages?.map((message) => (
                <div key={message.id} className="leading-tight">
                    <span className="text-gray-400 text-xs mr-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12:true })}
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
        if (!showProfileTooltip || !user) return null;

        return (
            <div className="absolute bottom-full left-0 mb-2 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <img
                            src={`https://ui-avatars.com/api/?&name=${user.name.replace(
                                " ",
                                "+"
                            )}background=f44336&color=fff`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
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
                        onClick={() => setIsFormOpen(true)}
                        className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-white font-medium"
                        size="sm"
                    >
                        <div className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Ingresar
                        </div>
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
                                src={`https://ui-avatars.com/api/?&name=${user.name.replace(
                                    " ",
                                    "+"
                                )}background=f44336&color=fff`}
                                alt={user.name}
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
                    <Button type="submit" size="sm" className="bg-[var(--primary-color)] text-white hover:scale-105 hover:bg-[var(--primary-color)]  h-8 px-2">
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
            <AnonymousLogin isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleLogin} />
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

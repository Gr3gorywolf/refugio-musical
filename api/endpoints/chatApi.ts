import { FacebookUser } from "@/types/FacebookUser";
import { ChatApiClient } from "../config/baseApi"
import { ChatMessage } from "@/types/ChatMessage";
import { ChatUser } from "@/types/ChatUser";

export const postAuthSocket = async (socketId: string) => {
    return ChatApiClient.post<{ success: boolean }>('/auth-socket', { socketId });
}

export const postChatMessage = async (socketId: string, text: string) => {
    return ChatApiClient.post<{ success: boolean }>('/send-message', { socketId, text });
}

export const postChatLogin = async (socketId: string, userName:string,email:string) => {
    return ChatApiClient.post<{ token:string, user:ChatUser }>('/login', { socketId, userName, email });
}

export const postChatLogout = async (socketId: string) => {
    return ChatApiClient.post<{ success: boolean }>('/logout', { socketId });
}

export const getChat = async () => {
    return ChatApiClient.get<{ activeUsers: number, messages: ChatMessage[] }>('/chat-status');
}
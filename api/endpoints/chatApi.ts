import { FacebookUser } from "@/types/FacebookUser";
import { AppApiClient } from "../config/baseApi"
import { ChatMessage } from "@/types/ChatMessage";
import { ChatUser } from "@/types/ChatUser";

export const postAuthSocket = async (socketId: string) => {
    return AppApiClient.post<{ success: boolean }>('/auth-socket', { socketId });
}

export const postChatMessage = async (socketId: string, text: string) => {
    return AppApiClient.post<{ success: boolean }>('/send-message', { socketId, text });
}

export const postChatLogin = async (socketId: string, userName:string,email:string) => {
    return AppApiClient.post<{ token:string, user:ChatUser }>('/login', { socketId, userName, email });
}

export const postChatLogout = async (socketId: string) => {
    return AppApiClient.post<{ success: boolean }>('/logout', { socketId });
}

export const getChat = async () => {
    return AppApiClient.get<{ activeUsers: number, messages: ChatMessage[] }>('/chat-status');
}
import { FacebookUser } from "@/types/FacebookUser";
import { AppApiClient } from "../config/baseApi"
import { ChatMessage } from "@/types/ChatMessage";

export const postAuthSocket = async (socketId: string) => {
    return AppApiClient.post<{ success: boolean }>('/auth-socket', { socketId });
}

export const postChatMessage = async (socketId: string, text: string) => {
    return AppApiClient.post<{ success: boolean }>('/send-message', { socketId, text });
}

export const postChatLogout = async (socketId: string) => {
    return AppApiClient.post<{ success: boolean }>('/logout', { socketId });
}

export const getChat = async () => {
    return AppApiClient.get<{ activeUsers: number, messages: ChatMessage[] }>('/chat-status');
}
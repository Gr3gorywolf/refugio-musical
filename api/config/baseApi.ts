import axios, { AxiosInstance } from "axios";
import { addChatApiBearerRequestInterceptor } from "./interceptors";

export const AzuraCastApiClient: AxiosInstance = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_AZURACAST_URL}/api` });
export const ChatApiClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_CHAT_API_URL + `/api` });
addChatApiBearerRequestInterceptor(ChatApiClient);
import { SOCKET_TOKEN_KEY } from "@/lib/constants";
import { AxiosInstance } from "axios";

export function addChatApiBearerRequestInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use(
        async (config: any) => {

            const authData = localStorage.getItem(SOCKET_TOKEN_KEY);
            if (authData) {
                config.headers = { ...(config.headers ?? {}), authorization: `Bearer ${authData}` };
                return config;
            }
             return config;
        },
        (error) => {
            Promise.reject(error);
        }
    );
}

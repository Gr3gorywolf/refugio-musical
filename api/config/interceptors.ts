import { SOCKET_TOKEN } from "@/lib/constants";
import { StorageFacebookInfo } from "@/types/StorageFacebookInfo";
import { AxiosInstance } from "axios";

export function addFacebookBearerRequestInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use(
        async (config: any) => {

            const authData = localStorage.getItem(SOCKET_TOKEN);
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

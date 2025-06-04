import { FB_AUTH_KEY } from "@/lib/constants";
import { StorageFacebookInfo } from "@/types/StorageFacebookInfo";
import { AxiosInstance } from "axios";

export function addFacebookBearerRequestInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use(
        async (config: any) => {

            const authData = localStorage.getItem(FB_AUTH_KEY);
            if (authData) {
                const parsedAuth: StorageFacebookInfo = JSON.parse(authData);
                config.headers = { ...(config.headers ?? {}), authorization: `Bearer ${parsedAuth.auth.accessToken}` };
                return config;
            }
             return config;
        },
        (error) => {
            Promise.reject(error);
        }
    );
}

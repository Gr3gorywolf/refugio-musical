import axios, { AxiosInstance } from "axios";
import { addFacebookBearerRequestInterceptor } from "./interceptors";

export const AzuraCastApiClient: AxiosInstance = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_AZURACAST_URL}/api` });
export const AppApiClient = axios.create({ baseURL: `/api` });
addFacebookBearerRequestInterceptor(AppApiClient);
import axios, { AxiosInstance } from "axios";

export const AzuraCastApiClient: AxiosInstance = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_AZURACAST_URL}/api` });

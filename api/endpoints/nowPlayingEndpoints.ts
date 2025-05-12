import { NowPlayingResponse } from "@/types/NowPlayingResponse"
import { AzuraCastApiClient } from "../config/baseApi"

export const getNowPlaying = async () => {
    return  AzuraCastApiClient.get<NowPlayingResponse>(`/nowplaying/${process.env.NEXT_PUBLIC_STATION_NAME}`)
}
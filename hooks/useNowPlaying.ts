import { getNowPlaying } from "@/api/endpoints/azuracastEndpoints"
import { NowPlayingResponse } from "@/types/NowPlayingResponse"
import { useQuery } from "@tanstack/react-query"

export const useNowPlaying = (autoRefetch = true) => {
    return useQuery({
        queryKey: ["nowPlaying"], queryFn: async () => {
            const res = await getNowPlaying()
            return res.data
        },
        refetchInterval: autoRefetch ? 10 * 1000 : undefined,
    })
}
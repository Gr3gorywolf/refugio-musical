import { Song } from "./Song"

export interface NowPlaying {
  sh_id: number
  played_at: number
  duration: number
  playlist: string
  streamer: string
  is_request: boolean
  song: Song
  elapsed: number
  remaining: number
}

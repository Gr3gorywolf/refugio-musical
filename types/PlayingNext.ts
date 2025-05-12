import { Song } from "./Song"

export interface PlayingNext {
  cued_at: number
  played_at: number
  duration: number
  playlist: string
  is_request: boolean
  song: Song
}

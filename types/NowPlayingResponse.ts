import { Listeners } from "./Listeners"
import { Live } from "./Live"
import { NowPlaying } from "./NowPlaying"
import { PlayingNext } from "./PlayingNext"
import { Station } from "./Station"

export interface NowPlayingResponse {
  station: Station
  listeners: Listeners
  live: Live
  now_playing: NowPlaying
  playing_next: PlayingNext
  song_history: any[]
  is_online: boolean
  cache: any
}












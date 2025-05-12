import { Mount } from "./Mount"

export interface Station {
  id: number
  name: string
  shortcode: string
  description: string
  frontend: string
  backend: string
  timezone: string
  listen_url: string
  url: string
  public_player_url: string
  playlist_pls_url: string
  playlist_m3u_url: string
  is_public: boolean
  mounts: Mount[]
  remotes: any[]
  hls_enabled: boolean
  hls_is_default: boolean
  hls_url: any
  hls_listeners: number
}

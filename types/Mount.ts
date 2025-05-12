import { Listeners } from "./Listeners"

export interface Mount {
  id: number
  name: string
  url: string
  bitrate: number
  format: string
  listeners: Listeners
  path: string
  is_default: boolean
}
export interface FacebookDebugData {
  data: Data
}

interface Data {
  app_id: string
  type: string
  application: string
  data_access_expires_at: number
  expires_at: number
  is_valid: boolean
  scopes: string[]
  user_id: string
}

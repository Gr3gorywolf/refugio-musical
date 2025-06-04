export interface FacebookUser {
  id: string
  name: string
  picture: Picture
  email: string
}

export interface Picture {
  data: Data
}

export interface Data {
  height: number
  is_silhouette: boolean
  url: string
  width: number
}

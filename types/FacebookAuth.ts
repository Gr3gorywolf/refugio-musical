export interface FacebookAuth {
  userID: string
  expiresIn: number
  accessToken: string
  signedRequest: string
  graphDomain: string
  data_access_expiration_time: number
}
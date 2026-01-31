import { v4 as uuidv4 } from 'uuid'
import config from '../../config'
import { getSpotifyUserTokenWithRefresh } from '../../spotify'

export async function getSpotifyRedirectURI(): Promise<string> {
  const state = uuidv4()
  const scope = 'user-read-private user-read-email playlist-modify-public'

  const queryString = new URLSearchParams({
    response_type: 'code',
    client_id: config.spotify.clientId,
    scope: scope,
    redirect_uri: config.spotify.redirectURI,
    state: state,
  })

  return `https://accounts.spotify.com/authorize?${queryString.toString()}`
}

export async function refreshToken(token: string) {
  return await getSpotifyUserTokenWithRefresh(token)
}

import axios from 'axios'
import type express from 'express'
import { SearchType, type TPlaylistEntry } from 'playlist-generator-utilities'
import { Literal, Number, Optional, Record, String, Union } from 'runtypes'
import config from './config'
import { logger } from './utilities'

const SpotifyToken = Record({
  access_token: String,
  token_type: Union(Literal('Bearer')),
  expires_in: Number,
  refresh_token: Optional(String),
})

export const handleSpotifyUserRedirect = async (query: express.Request['query']) => {
  const SpotifyRedirect = Record({ code: String, state: String })
  try {
    const { state, code } = SpotifyRedirect.check(query)
    if (state === null) {
      return null
    }
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.spotify.redirectURI,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${config.spotify.clientId}:${config.spotify.clientSecret}`).toString('base64')}`,
        },
      },
    )
    const { access_token, expires_in, refresh_token } = SpotifyToken.check(response.data)

    const urlSearchParams = new URLSearchParams()
    urlSearchParams.append('access_token', access_token)
    urlSearchParams.append('expires_in', expires_in.toString())
    if (refresh_token) {
      urlSearchParams.append('refresh_token', refresh_token)
    }

    return `${config.frontendUrl}?${urlSearchParams.toString()}`
  } catch (e) {
    logger(e)
    return null
  }
}

const getSpotifyClientToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'client_credentials',
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  if (!response.data) {
    throw new Error('Failed to fetch Spotify Token')
  }
  try {
    return SpotifyToken.check(response.data)
  } catch (_error) {
    throw Error('Failed to decode Token')
  }
}

export const getSpotifyUserTokenWithRefresh = async (refreshToken: string) => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${config.spotify.clientId}:${config.spotify.clientSecret}`).toString('base64')}`,
      },
    },
  )

  if (!response.data) {
    throw new Error('Failed to fetch Spotify Token with refresh')
  }
  try {
    const data = SpotifyToken.check(response.data)
    return {
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      accessToken: data.access_token,
    }
  } catch (_error) {
    throw Error('Failed to decode Token after refresh')
  }
}

let cachedAccessToken: string | null = null
const expiresIn = {
  value: new Date(),
}
const getSpotifyAccessToken = async (): Promise<string> => {
  if (!cachedAccessToken || expiresIn.value < new Date()) {
    const token = await getSpotifyClientToken()
    cachedAccessToken = token.access_token
    expiresIn.value = new Date(expiresIn.value.getTime() + token.expires_in * 1000)
  }
  return cachedAccessToken
}

export type GetRecommendationsForPlaylistOptions = {
  seed_artists?: string[] | string
  seed_tracks?: string[] | string
  market: string
  limit: number
  min_energy?: number
  max_energy?: number
  target_energy?: number
  target_danceability?: number
  target_popularity?: number
  target_tempo?: number
  target_valence?: number
}

type Options = { seed_artists: string[]; seed_tracks: string[]; market: string; limit: number }
export const getRecommendedArtist = async (market: string, seeds: { id: string; type: SearchType }[]) => {
  // This algorithm could definitely be improved. Kind of blocked until I find a solution on creating a graph of spotify artists.
  const accessToken = await getSpotifyAccessToken()

  const options: Options = { seed_artists: [], seed_tracks: [], market, limit: 1 }
  seeds.forEach((seed) => {
    if (seed.type === SearchType.Artist) {
      options.seed_artists.push(seed.id)
    } else if (seed.type === SearchType.Track) {
      options.seed_tracks.push(seed.id)
    }
  })

  const params = new URLSearchParams({
    market: options.market,
    limit: options.limit.toString(),
    ...(options.seed_artists.length > 0 && { seed_artists: options.seed_artists.join(',') }),
    ...(options.seed_tracks.length > 0 && { seed_tracks: options.seed_tracks.join(',') }),
  })

  const response = await axios.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data?.tracks?.[0]?.artists?.[0]?.id
}

export const getRecommendationsForPlaylist = async (
  options: GetRecommendationsForPlaylistOptions,
): Promise<{ [key: string]: TPlaylistEntry }> => {
  const accessToken = await getSpotifyAccessToken()
  try {
    const params = new URLSearchParams({
      market: options.market,
      limit: options.limit.toString(),
      ...(options.seed_artists && {
        seed_artists: Array.isArray(options.seed_artists) ? options.seed_artists.join(',') : options.seed_artists,
      }),
      ...(options.seed_tracks && {
        seed_tracks: Array.isArray(options.seed_tracks) ? options.seed_tracks.join(',') : options.seed_tracks,
      }),
      ...(options.min_energy !== undefined && { min_energy: options.min_energy.toString() }),
      ...(options.max_energy !== undefined && { max_energy: options.max_energy.toString() }),
      ...(options.target_energy !== undefined && { target_energy: options.target_energy.toString() }),
      ...(options.target_danceability !== undefined && { target_danceability: options.target_danceability.toString() }),
      ...(options.target_popularity !== undefined && { target_popularity: options.target_popularity.toString() }),
      ...(options.target_tempo !== undefined && { target_tempo: options.target_tempo.toString() }),
      ...(options.target_valence !== undefined && { target_valence: options.target_valence.toString() }),
    })

    const response = await axios.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const playlistTracks = response.data?.tracks?.map(
      ({ id, name, artists, album, uri, external_urls: { spotify } }) => {
        return {
          id,
          artists: artists.map((artist) => ({ name: artist.name, href: artist.external_urls.spotify })),
          album: {
            name: album.name,
            href: album.external_urls.spotify,
          },
          image: album.images.length > 0 ? album.images[0].url : '',
          name,
          uri,
          href: spotify,
        }
      },
    )

    if (!playlistTracks || playlistTracks.length === 0) {
      return {}
    }

    return playlistTracks.reduce(
      (accum, curr) => {
        accum[curr.id] = curr
        return accum
      },
      {} as { [key: string]: TPlaylistEntry },
    )
  } catch (error: any) {
    console.log(error)
    console.log(error.name)
    console.log(error.message)
    return {}
  }
}

type GetArtistOptions = {
  seed_artists: string[] | string
  market: string
}

export const getArtistFromOptions = async (options: GetArtistOptions) => {
  const accessToken = await getSpotifyAccessToken()
  try {
    const params = new URLSearchParams({
      market: options.market,
      ...(options.seed_artists && {
        seed_artists: Array.isArray(options.seed_artists) ? options.seed_artists.join(',') : options.seed_artists,
      }),
    })

    const response = await axios.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return (
      response.data?.tracks?.map(({ id, name, artists, album, uri, external_urls: { spotify } }) => {
        return {
          id,
          artists: artists.map((artist) => ({ name: artist.name, href: artist.external_urls.spotify })),
          album: {
            name: album.name,
            href: album.external_urls.spotify,
          },
          image: album.images.length > 0 ? album.images[0].url : '',
          name,
          uri,
          href: spotify,
        }
      }) || []
    )
  } catch (error: any) {
    console.log(error)
    console.log(error.name)
    console.log(error.message)
    return []
  }
}

export default getSpotifyAccessToken

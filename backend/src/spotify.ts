import { Literal, Number, Optional, Record, String, Union } from 'runtypes'
import express from 'express'
import config from './config'
import axios from 'axios'
import SpotifyWebApi from 'spotify-web-api-node'
import { logger } from './utilities'

const SpotifyToken = Record({
    access_token: String,
    token_type: Union(Literal('Bearer')),
    expires_in: Number,
    refresh_token: Optional(String)
})

export const handleSpotifyUserRedirect = async (query: express.Request['query']) => {
    const SpotifyRedirect = Record({ code: String, state: String, })
    try {
        const { state, code } = SpotifyRedirect.check(query)
        if (state === null) {
            return null
        }
        const response = await axios.post('https://accounts.spotify.com/api/token', {
            grant_type: 'authorization_code',
            code,
            redirect_uri: config.spotify.redirectURI,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(config.spotify.clientId + ':' + config.spotify.clientSecret).toString('base64'))
            },
        })
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
    const response = await axios.post('https://accounts.spotify.com/api/token', {
        grant_type: 'client_credentials',
        client_id: config.spotify.clientId,
        client_secret: config.spotify.clientSecret
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    if (!response.data) {
        throw new Error("Failed to fetch Spotify Token")
    }
    try {
        return SpotifyToken.check(response.data)
    } catch (error) {
        throw Error("Failed to decode Token")
    }
}

export const getSpotifyUserTokenWithRefresh = async (refreshToken: string) => {
    const response = await axios.post('https://accounts.spotify.com/api/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(config.spotify.clientId + ':' + config.spotify.clientSecret).toString('base64'))
        },
    })

    if (!response.data) {
        throw new Error("Failed to fetch Spotify Token with refresh")
    }
    try {
        const data = SpotifyToken.check(response.data)
        return {
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
        }
    } catch (error) {
        throw Error("Failed to decode Token after refresh")
    }
}

const expiresIn = {
    value: new Date()
}
const getSpotifyClient = async () => {
    const spotifyApi = new SpotifyWebApi({
        clientId: config.spotify.clientId,
        clientSecret: config.spotify.clientSecret,
    });
    if (!spotifyApi.getAccessToken() || expiresIn.value < new Date()) {
        const token = await getSpotifyClientToken()
        spotifyApi.setAccessToken(token.access_token)

        expiresIn.value = new Date(expiresIn.value.getTime() + token.expires_in * 1000); // There might be something off with the TTL here.
    }
    return spotifyApi

}


type GetRecommendationsForPlaylistOptions = {
    seed_artists: string[] | string
    market: string,
    limit: number,
    min_energy?: number,
    max_energy?: number
}

type Options = { seed_artists: string[], market: string, limit: number }
export const getRelatedArtistFromArtists = async (market: string, artistIdStart: string, artistIdEnd: string) => {
    // This algorithm could definitely be improved. Kind of blocked until I find a solution on creating a graph of spotify artists.
    const client = await getSpotifyClient()

    const options: Options = { seed_artists: [], market, limit: 1 }
    options.seed_artists.push(artistIdStart, artistIdEnd)

    const results = await client.getRecommendations(options)
    return results.body?.tracks[0].artists[0].id

}

export const getRecommendationsForPlaylist = async (options: GetRecommendationsForPlaylistOptions) => {
    const client = await getSpotifyClient()
    try {
        const results = await client.getRecommendations(options)
        return results.body?.tracks?.map(({ id, name, artists, album, uri, external_urls: { spotify } }) => {
            return {
                id,
                artists: artists.map(artist => ({ name: artist.name, href: artist.external_urls.spotify })),
                album: {
                    name: album.name,
                    href: album.external_urls.spotify
                },
                image: album.images.length > 0 ? album.images[0].url : '',
                name,
                uri,
                href: spotify
            }
        })
    } catch (error: any) {
        console.log(error)
        console.log(error.name)
        console.log(error.message)
        return []
    }
}

type GetArtistOptions = {
    seed_artists: string[] | string
    market: string,
}

export const getArtistFromOptions = async (options: GetArtistOptions) => {
    const client = await getSpotifyClient()
    try {
        const results = await client.getRecommendations(options)
        console.log(results.body)
        return results.body?.tracks?.map(({ id, name, artists, album, uri, external_urls: { spotify } }) => {
            return {
                id,
                artists: artists.map(artist => ({ name: artist.name, href: artist.external_urls.spotify })),
                album: {
                    name: album.name,
                    href: album.external_urls.spotify
                },
                image: album.images.length > 0 ? album.images[0].url : '',
                name,
                uri,
                href: spotify
            }
        })
    } catch (error: any) {
        console.log(error)
        console.log(error.name)
        console.log(error.message)
        return []
    }
}



export default getSpotifyClient
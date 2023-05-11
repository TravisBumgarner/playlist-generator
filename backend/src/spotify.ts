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
        console.log(state, code)
        if (state === null) {
            return null
        }
        console.log(config.spotify)
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

        return `http://localhost:3001?${urlSearchParams.toString()}`
    } catch (e) {
        console.log('sad panda')
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

let expiresIn: Date = new Date()
const SpotifyClientPromise = (async () => {
    const spotifyApi = new SpotifyWebApi({
        clientId: config.spotify.clientId,
        clientSecret: config.spotify.clientSecret,
    });
    if (expiresIn < new Date()) {
        const token = await getSpotifyClientToken()
        spotifyApi.setAccessToken(token.access_token)

        expiresIn = new Date(expiresIn.getTime() + token.expires_in * 1000); // There might be something off with the TTL here.
    }
    return spotifyApi

})()

export default SpotifyClientPromise
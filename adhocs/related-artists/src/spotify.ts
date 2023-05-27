import { Literal, Number, Optional, Record, String, Union } from 'runtypes'
import config from './config'
import axios from 'axios'
import SpotifyWebApi from 'spotify-web-api-node'

const SpotifyToken = Record({
    access_token: String,
    token_type: Union(Literal('Bearer')),
    expires_in: Number,
    refresh_token: Optional(String)
})

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

export default getSpotifyClient
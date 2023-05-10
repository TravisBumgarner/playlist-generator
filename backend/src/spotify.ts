import { Literal, Number, Record, String, Union } from 'runtypes'
import config from './config'
import axios from 'axios'
import SpotifyWebApi from 'spotify-web-api-node'

const Token = Record({
    access_token: String,
    token_type: Union(Literal('Bearer')),
    expires_in: Number
})

const getSpotifyToken = async () => {
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
        return Token.check(response.data)
    } catch (error) {
        throw Error("Failed to decode Token")
    }
}

let expiresIn: Date = new Date()
const SpotifyClientPromise = (async () => {
    const spotifyApi = new SpotifyWebApi({
        clientId: config.spotify.clientId,
        clientSecret: config.spotify.clientSecret,
    });
    console.log(spotifyApi.getAccessToken())
    if (expiresIn < new Date()) {
        const token = await getSpotifyToken()
        spotifyApi.setAccessToken(token.access_token)

        expiresIn = new Date(expiresIn.getTime() + token.expires_in * 1000); // There might be something off with the TTL here.
    }
    console.log(spotifyApi.getAccessToken())
    return spotifyApi

})()

export default SpotifyClientPromise
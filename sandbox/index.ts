import SpotifyWebApi from 'spotify-web-api-node'
import axios from 'axios'

import 'dotenv/config'
import { String, Record, Number } from 'runtypes'


const Env = Record({
    mongo: Record({
        user: String,
        password: String,
        route: String
    }),
    spotify: Record({
        clientId: String,
        clientSecret: String
    })

})

const getEnv = () => {
    const env = {
        mongo: {
            user: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD,
            route: process.env.MONGO_ROUTE,
        },
        spotify: {
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        }
    }
    try {
        return Env.check(env)
    } catch (error) {
        throw Error('Invalid project config')
    }
}

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
        console.log(response.data)
        return response.data.access_token
    } catch (error) {
        throw Error("Failed to decode Token")
    }
}

const config = getEnv()

const SpotifyClientPromise = (async () => {
    const spotifyApi = new SpotifyWebApi({
        clientId: config.spotify.clientId,
        clientSecret: config.spotify.clientSecret,
        // redirectUri: 'http://www.example.com/callback'
    });
    const token = await getSpotifyToken()
    console.log(token)
    await spotifyApi.setAccessToken(token)
    return spotifyApi

})()

const main = async () => {
    const client = await SpotifyClientPromise
    const results = await client.createPlaylist('foobar')
    console.log(results)
}

main()
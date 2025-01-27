import 'dotenv/config'
import { Record, String } from 'runtypes'


const Env = Record({
    spotify: Record({
        clientId: String,
        clientSecret: String,
        redirectURI: String
    }),
    frontendUrl: String,
})

const getNonSecretKeys = () => {
    if (process.env.NODE_ENV !== 'production') {
        return {
            frontendUrl: 'http://localhost:3000',
            spotifyRedirectURI: 'http://localhost:8000/spotify_redirect',
        }
    }
    return {
        frontendUrl: 'https://playlists.sillysideprojects.com',
        spotifyRedirectURI: 'https://playlists.sillysideprojects.com/api/spotify_redirect',
    }
}



const getEnv = () => {
    const nonSecretKeys = getNonSecretKeys()

    const env = {
        spotify: {
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectURI: nonSecretKeys.spotifyRedirectURI,
        },
        frontendUrl: nonSecretKeys.frontendUrl,
    }
    try {
        return Env.check(env)
    } catch (error) {
        throw Error('Invalid project config')
    }
}

const config = getEnv()

export default config
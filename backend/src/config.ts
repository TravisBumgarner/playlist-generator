import 'dotenv/config'
import { String, Record, Number } from 'runtypes'


const Env = Record({
    spotify: Record({
        clientId: String,
        clientSecret: String,
        redirectURI: String
    }),
    frontendUrl: String

})

const getEnv = () => {
    const env = {
        spotify: {
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectURI: process.env.SPOTIFY_REDIRECT_URI,
        },
        frontendUrl: process.env.FRONTEND_URL
    }
    try {
        return Env.check(env)
    } catch (error) {
        throw Error('Invalid project config')
    }
}

const config = getEnv()

export default config
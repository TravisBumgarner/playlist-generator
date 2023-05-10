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
        clientSecret: String,
        frontendRedirectURI: String,
        backendRedirectURI: String
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
            frontendRedirectURI: process.env.SPOTIFY_REDIRECT_FRONTEND_URI,
            backendRedirectURI: process.env.SPOTIFY_REDIRECT_BACKEND_URI,
        }
    }
    try {
        return Env.check(env)
    } catch (error) {
        throw Error('Invalid project config')
    }
}

const config = getEnv()

export default config
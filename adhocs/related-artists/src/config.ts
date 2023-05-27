import 'dotenv/config'
import { String, Record } from 'runtypes'

const Env = Record({
    spotify: Record({
        clientId: String,
        clientSecret: String,
    }),
})

const getEnv = () => {
    const env = {
        spotify: {
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        },
    }
    try {
        return Env.check(env)
    } catch (error) {
        throw Error('Invalid project config')
    }
}

const config = getEnv()

export default config
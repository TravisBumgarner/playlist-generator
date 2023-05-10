import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { useServer } from 'graphql-ws/lib/use/ws'
import cors from 'cors'
import bodyParser from 'body-parser'
import { WebSocketServer } from 'ws'
import schema from './schemas'
import { logger } from './utilities'
import { Number, Record, String } from 'runtypes'
import config from './config'
import axios from 'axios'
const app = express()

// process.on('uncaughtException', (error: any) => logger(error))
// process.on('unhandledRejection', (error: any) => logger(error))

// app.use(Sentry.Handlers.requestHandler())
// app.use(Sentry.Handlers.tracingHandler())

const CORS_DEV = [
  'localhost:3001',
]

const COORS_PROD = [
  'https://.app',
  '.best'
]

// For Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? COORS_PROD
    : CORS_DEV

}))

app.use(bodyParser.json())

app.get('/ok', async (req: express.Request, res: express.Response) => {
  res.send('pong!')
})

app.get('/spotify_redirect', async (req: express.Request, res: express.Response) => {
  const SpotifyRedirect = Record({ code: String, state: String, })
  try {
    const { state, code } = SpotifyRedirect.check(req.query)
    if (state === null) {
      res.sendStatus(500)
      return
    }
    const response = await axios.post('https://accounts.spotify.com/api/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.spotify.backendRedirectURI,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(config.spotify.clientId + ':' + config.spotify.clientSecret).toString('base64'))
      },
    })
    console.log(response.data)
    const SpotifyToken = Record({ access_token: String, token_type: String, scope: String, expires_in: Number, refresh_token: String })
    const { access_token } = SpotifyToken.check(response.data)
    console.log(`${config.spotify.frontendRedirectURI}?access_token=${access_token}`)
    res.redirect(`${config.spotify.frontendRedirectURI}?access_token=${access_token}`)
  } catch (e) {
    logger(e)
    res.sendStatus(401)
  }
})

app.use('/graphql', graphqlHTTP(() => ({
  schema,
  graphiql: process.env.NODE_ENV !== 'production',
  customFormatErrorFn: (err: any) => {
    logger(err.message)
    // if (err.message in errorLookup) return errorLookup[err.message]
    return {
      statusCode: 500,
      message: 'Something went wrong'
    }
  }
})))

// app.use(Sentry.Handlers.errorHandler())
// app.use((err, req: express.Request, res: express.Response) => {
//   res.statusCode = 500
// })

// Sentry.init({
//   dsn: 'https://f0f907615c134aff90c1a7d1ea17eb34@o4504279410671616.ingest.sentry.io/4504279411851264',
//   integrations: [
//     new Sentry.Integrations.Http({ tracing: true }),
//     new Tracing.Integrations.Express({ app }),
//   ],
//   tracesSampleRate: 1.0,
// })

const server = app.listen(5001, '0.0.0.0', () => {
  console.log('App listening at http://0.0.0.0:5001') //eslint-disable-line

  const wsServer = new WebSocketServer({ server, path: '/graphql' })
  useServer({ schema }, wsServer)
})

export { }
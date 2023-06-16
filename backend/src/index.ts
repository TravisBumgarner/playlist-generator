import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { useServer } from 'graphql-ws/lib/use/ws'
import * as Sentry from '@sentry/node'
import cors from 'cors'
import bodyParser from 'body-parser'
import { WebSocketServer } from 'ws'

import schema from './schemas'
import { logger } from './utilities'
import { handleSpotifyUserRedirect } from './spotify'
import * as Foo from 'utilities'

const app = express()
Sentry.init({
  dsn: 'https://838c24cda4bd47d09cfbe44a11406585@o196886.ingest.sentry.io/4505303436886016',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

const CORS_DEV = ['localhost:3001']

const COORS_PROD = ['https://playlists.sillysideprojects.com/']

// For Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? COORS_PROD : CORS_DEV,
  })
)

app.use(bodyParser.json())

app.get('/ok', async (req: express.Request, res: express.Response) => {
  console.log(Foo)
  res.send(`${Foo.foo}`)
})

app.get(
  '/spotify_redirect',
  async (req: express.Request, res: express.Response) => {
    const response = await handleSpotifyUserRedirect(req.query)
    if (response === null) {
      res.sendStatus(500)
      return
    }
    res.redirect(response)
  }
)

app.use(
  '/graphql',
  graphqlHTTP(() => ({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    customFormatErrorFn: (err: any) => {
      logger(err.message)
      // if (err.message in errorLookup) return errorLookup[err.message]
      return {
        statusCode: 500,
        message: 'Something went wrong',
      }
    },
  }))
)

app.use(Sentry.Handlers.errorHandler())

const server = app.listen(8080, '0.0.0.0', () => {
  console.log('App listening at http://0.0.0.0:8080') //eslint-disable-line

  const wsServer = new WebSocketServer({ server, path: '/graphql' })
  useServer({ schema }, wsServer)
})

export { }

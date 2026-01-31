import * as Sentry from '@sentry/node'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { createHandler } from 'graphql-http/lib/use/express'
import { GraphQLError } from 'graphql'
import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'
import https from 'https'
import fs from 'fs'
import path from 'path'
import config from './config'

import schema from './schemas'
import { handleSpotifyUserRedirect } from './spotify'
import { logger } from './utilities'

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

const CORS_DEV = ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://127.0.0.1:3000', 'https://localhost:3000']
const CORS_PROD = ['https://playlists.sillysideprojects.com']

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? CORS_PROD : CORS_DEV,
  })
)

app.use(bodyParser.json())

app.get('/ok', async (req: express.Request, res: express.Response) => {
  res.send('Pong!')
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

app.all(
  '/graphql',
  createHandler({
    schema,
    formatError: (err) => {
      logger(err.message)
      return new GraphQLError('Something went wrong')
    },
  })
)

app.use(Sentry.Handlers.errorHandler())

const PORT = 8000

let server: https.Server | import("http").Server
if (config.isProd) {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
  })
} else {
  server = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, '/../localhost-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '/../localhost.pem')),
    },
    app
  )

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening at https://127.0.0.1:${PORT}`)
  })
}

const wsServer = new WebSocketServer({ server, path: '/graphql' })
useServer({ schema }, wsServer)
export { }

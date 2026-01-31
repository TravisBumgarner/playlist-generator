import * as Sentry from '@sentry/node'
import cors from 'cors'
import express from 'express'
import { GraphQLError } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'
import { useServer } from 'graphql-ws/use/ws'
import { WebSocketServer } from 'ws'
import config from './config'

import schema from './schemas'
import { handleSpotifyUserRedirect } from './spotify'
import { logger } from './utilities'

const app = express()
Sentry.init({
  dsn: 'https://838c24cda4bd47d09cfbe44a11406585@o196886.ingest.sentry.io/4505303436886016',
  integrations: [Sentry.httpIntegration(), Sentry.expressIntegration()],
  tracesSampleRate: 1.0,
})

const CORS_DEV = ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://127.0.0.1:3000', 'https://localhost:3000']
const CORS_PROD = ['https://playlists.sillysideprojects.com']

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? CORS_PROD : CORS_DEV,
  }),
)

app.use(express.json())

app.get('/ok', async (_req: express.Request, res: express.Response) => {
  res.send('Pong!')
})

app.get('/spotify_redirect', async (req: express.Request, res: express.Response) => {
  const response = await handleSpotifyUserRedirect(req.query)
  if (response === null) {
    res.sendStatus(500)
    return
  }
  res.redirect(response)
})

app.all(
  '/graphql',
  createHandler({
    schema,
    formatError: (err) => {
      logger(err.message)
      return new GraphQLError('Something went wrong')
    },
  }),
)

Sentry.setupExpressErrorHandler(app)

const PORT = 8000

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

const wsServer = new WebSocketServer({ server, path: '/graphql' })
useServer({ schema }, wsServer)

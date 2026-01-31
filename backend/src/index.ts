import * as Sentry from '@sentry/node'
import cors from 'cors'
import express from 'express'
import type { SearchType } from 'playlist-generator-utilities'
import { sendBadRequest, sendInternalError, sendSuccess } from './responses'
import savePlaylist from './schemas/mutations/savePlaylist'
import { getSpotifyRedirectURI, refreshToken } from './schemas/queries/auth'
import autocomplete from './schemas/queries/autocomplete'
import playlistContrastPairs from './schemas/queries/playlistContrastPairs'
import playlistDiscoveryDial from './schemas/queries/playlistDiscoveryDial'
import playlistFocusMode from './schemas/queries/playlistFocusMode'
import playlistFullControl from './schemas/queries/playlistFullControl'
import playlistGenreDrift from './schemas/queries/playlistGenreDrift'
import playlistGoodBeatsToGoodSleeps from './schemas/queries/playlistGoodBeatsToGoodSleeps'
import playlistGradient from './schemas/queries/playlistGradient'
import playlistMashup from './schemas/queries/playlistMashup'
import playlistMoodSwing from './schemas/queries/playlistMoodSwing'
import playlistPartyCurve from './schemas/queries/playlistPartyCurve'
import playlistRandomWalk from './schemas/queries/playlistRandomWalk'
import playlistTempoLock from './schemas/queries/playlistTempoLock'
import playlistTimeMachine from './schemas/queries/playlistTimeMachine'
import playlistWorkoutArc from './schemas/queries/playlistWorkoutArc'
import { handleSpotifyUserRedirect } from './spotify'
import { logger } from './utilities'

const app = express()
Sentry.init({
  dsn: 'https://838c24cda4bd47d09cfbe44a11406585@o196886.ingest.sentry.io/4505303436886016',
  integrations: [Sentry.httpIntegration(), Sentry.expressIntegration()],
  tracesSampleRate: 1.0,
})

const CORS_DEV = ['http://127.0.0.1:3033', 'http://localhost:3033', 'https://127.0.0.1:3033', 'https://localhost:3033']
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

// Auth routes
app.get('/api/auth/spotify-redirect-uri', async (_req, res) => {
  try {
    const uri = await getSpotifyRedirectURI()
    sendSuccess(res, uri)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/auth/refresh-token', async (req, res) => {
  try {
    const { refreshToken: token } = req.query
    if (!token || typeof token !== 'string') {
      sendBadRequest(res)
      return
    }
    const result = await refreshToken(token)
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

// Search routes
app.get('/api/search/autocomplete', async (req, res) => {
  try {
    const { query, market } = req.query
    if (!query || !market || typeof query !== 'string' || typeof market !== 'string') {
      sendBadRequest(res)
      return
    }
    const result = await autocomplete({ query, market })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

// Playlist routes
app.get('/api/playlist/gradient', async (req, res) => {
  try {
    const { startWithId, endWithId, startWithType, endWithType, market, trackCount } = req.query
    if (!startWithId || !endWithId || !startWithType || !endWithType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistGradient({
      startWithId: startWithId as string,
      endWithId: endWithId as string,
      startWithType: startWithType as string as SearchType,
      endWithType: endWithType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/full-control', async (req, res) => {
  try {
    const { selectedId, selectedType, market, filters, trackCount } = req.query
    if (!selectedId || !selectedType || !market || !filters || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistFullControl({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      market: market as string,
      filters: filters as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/good-beats-to-good-sleeps', async (req, res) => {
  try {
    const { selectedId, selectedType, market, trackCount } = req.query
    if (!selectedId || !selectedType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistGoodBeatsToGoodSleeps({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/mashup', async (req, res) => {
  try {
    const { artistIds: rawArtistIds, trackIds: rawTrackIds, market, trackCount } = req.query
    if (!market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const artistIds = typeof rawArtistIds === 'string' ? rawArtistIds.split(',').filter(Boolean) : []
    const trackIds = typeof rawTrackIds === 'string' ? rawTrackIds.split(',').filter(Boolean) : []
    const result = await playlistMashup({
      artistIds,
      trackIds,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/time-machine', async (req, res) => {
  try {
    const { selectedId, selectedType, era, market, trackCount } = req.query
    if (!selectedId || !selectedType || !era || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistTimeMachine({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      era: era as string,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/mood-swing', async (req, res) => {
  try {
    const { selectedId, selectedType, market, trackCount } = req.query
    if (!selectedId || !selectedType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistMoodSwing({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/workout-arc', async (req, res) => {
  try {
    const { selectedId, selectedType, market, trackCount } = req.query
    if (!selectedId || !selectedType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistWorkoutArc({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/discovery-dial', async (req, res) => {
  try {
    const { selectedId, selectedType, adventurousness, market, trackCount } = req.query
    if (!selectedId || !selectedType || !adventurousness || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistDiscoveryDial({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      adventurousness: parseFloat(adventurousness as string),
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/tempo-lock', async (req, res) => {
  try {
    const { selectedId, selectedType, bpm, market, trackCount } = req.query
    if (!selectedId || !selectedType || !bpm || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistTempoLock({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      bpm: parseInt(bpm as string, 10),
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/genre-drift', async (req, res) => {
  try {
    const { startWithId, endWithId, startWithType, endWithType, market, trackCount } = req.query
    if (!startWithId || !endWithId || !startWithType || !endWithType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistGenreDrift({
      startWithId: startWithId as string,
      endWithId: endWithId as string,
      startWithType: startWithType as string as SearchType,
      endWithType: endWithType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/party-curve', async (req, res) => {
  try {
    const { selectedId, selectedType, market, trackCount } = req.query
    if (!selectedId || !selectedType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistPartyCurve({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/contrast-pairs', async (req, res) => {
  try {
    const { firstId, firstType, secondId, secondType, market, trackCount } = req.query
    if (!firstId || !firstType || !secondId || !secondType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistContrastPairs({
      firstId: firstId as string,
      firstType: firstType as string as SearchType,
      secondId: secondId as string,
      secondType: secondType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/focus-mode', async (req, res) => {
  try {
    const { selectedId, selectedType, market, trackCount } = req.query
    if (!selectedId || !selectedType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistFocusMode({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.get('/api/playlist/random-walk', async (req, res) => {
  try {
    const { selectedId, selectedType, market, trackCount } = req.query
    if (!selectedId || !selectedType || !market || !trackCount) {
      sendBadRequest(res)
      return
    }
    const result = await playlistRandomWalk({
      selectedId: selectedId as string,
      selectedType: selectedType as string as SearchType,
      market: market as string,
      trackCount: parseInt(trackCount as string, 10),
    })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

app.post('/api/playlist/save', async (req, res) => {
  try {
    const { uris, accessToken, playlistTitle, playlistDescription } = req.body
    if (!uris || !accessToken || !playlistTitle || !playlistDescription) {
      sendBadRequest(res)
      return
    }
    const result = await savePlaylist({ uris, accessToken, playlistTitle, playlistDescription })
    sendSuccess(res, result)
  } catch (e) {
    logger(e)
    sendInternalError(res)
  }
})

Sentry.setupExpressErrorHandler(app)

const PORT = 8048

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

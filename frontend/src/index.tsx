import { ApolloProvider } from '@apollo/client/react'
import * as Sentry from '@sentry/react'
import ResultsContext from 'context'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { apolloClient } from './utilities'

Sentry.init({
  dsn: 'https://59d667a871be4737959f079fb3031167@o196886.ingest.sentry.io/4505303387144192',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracePropagationTargets: ['localhost', /^https:\/\/playlists.sillysideprojects\.com/],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

const container = document.getElementById('root') as unknown as HTMLElement
const root = createRoot(container)
root.render(
  <BrowserRouter>
    <ResultsContext>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ResultsContext>
  </BrowserRouter>,
)

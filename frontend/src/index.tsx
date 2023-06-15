import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ApolloProvider } from '@apollo/client'
import * as Sentry from '@sentry/react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from './utilities'

import ResultsContext from 'context'
import App from './App'

Sentry.init({
  dsn: 'https://59d667a871be4737959f079fb3031167@o196886.ingest.sentry.io/4505303387144192',
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/playlists.sillysideprojects\.com/,
      ],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
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
  </BrowserRouter>
)

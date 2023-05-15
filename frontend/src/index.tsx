import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ApolloProvider } from '@apollo/client'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from './utilities'

import ResultsContext from 'context'
import App from './App'

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

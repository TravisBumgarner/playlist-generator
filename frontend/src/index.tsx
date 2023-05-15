import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import ResultsContext from 'context'
import App from './App'

const wsLink = new GraphQLWsLink(createClient({ url: __API_WS_ENDPOINT__ }))
const httpLink = new HttpLink({ uri: __API_HTTP_ENDPOINT__ })

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
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

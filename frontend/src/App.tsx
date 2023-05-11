import { CssBaseline } from "@mui/material"
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'

import { PageHeader, Alert, Router, Navigation } from "./components"

const wsLink = new GraphQLWsLink(createClient({ url: __API_WS_ENDPOINT__ }))
const httpLink = new HttpLink({ uri: __API_HTTP_ENDPOINT__ })

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

const App = () => {
  return (
    <ApolloProvider client={apolloClient} >
      <CssBaseline />
      <PageHeader />
      <Navigation />
      <Alert />
      <Router />
    </ApolloProvider >
  )
}

export default App

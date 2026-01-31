import { ApolloClient, gql, HttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import type { Action } from 'context'
import { createClient } from 'graphql-ws'

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
type Exactly<T, K extends keyof T> = Pick<T, K>

const logger = (message: any) => {
  console.log(JSON.stringify(message)) // eslint-disable-line
}

enum ELocalStorageItems {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  ExpiresAt = 'expiresAt',
}

const getLocalStorage = (key: ELocalStorageItems) => {
  const result = localStorage.getItem(key)
  return result ? JSON.parse(result) : null
}

const setLocalStorage = (key: ELocalStorageItems, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const deleteLocalStorage = (key: ELocalStorageItems) => {
  localStorage.removeItem(key)
}

const logout = (dispatch: (value: Action) => void) => {
  deleteLocalStorage(ELocalStorageItems.AccessToken)
  deleteLocalStorage(ELocalStorageItems.ExpiresAt)
  deleteLocalStorage(ELocalStorageItems.RefreshToken)
  dispatch({ type: 'LOGOUT' })
}

const GET_SPOTIFY_REDIRECT_URI_QUERY = gql`
query GetSpotifyRedirectURI {
    getSpotifyRedirectURI
  }
`

const wsLink = new GraphQLWsLink(createClient({ url: __API_WS_ENDPOINT__ }))
const httpLink = new HttpLink({ uri: __API_HTTP_ENDPOINT__ })

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
})

const login = async (dispatch: (value: Action) => void) => {
  dispatch({ type: 'LOGIN_INITIATED' })
  const response = await apolloClient.query<{ getSpotifyRedirectURI: string }>({
    query: GET_SPOTIFY_REDIRECT_URI_QUERY,
  })
  if (response.data) {
    window.open(response.data.getSpotifyRedirectURI, '_self')
  } else {
    dispatch({ type: 'ADD_ALERT', data: { text: 'Login failed', severity: 'error' } })
  }
}

export {
  logger,
  type AtLeast,
  type Exactly,
  getLocalStorage,
  setLocalStorage,
  deleteLocalStorage,
  ELocalStorageItems,
  login,
  logout,
}

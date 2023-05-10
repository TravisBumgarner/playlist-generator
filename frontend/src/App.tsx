import { CssBaseline } from "@mui/material"
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { Record, String, Array } from 'runtypes'
import { useNavigate, useParams } from "react-router"
import { useCallback, useContext, useEffect } from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom"

import { Alert, Router, Navigation } from "./components"
import { ELocalStorageItems, getLocalStorage, logger, setLocalStorage } from "utilities"
import { context } from "context"

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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate();
  const { dispatch, state } = useContext(context)


  useEffect(() => {
    // TODO - maybe a better way to redirect users home if they log out.
    if (!state.user) navigate('/')
  }, [window.location, state.user])

  const getUserDetails = useCallback(async () => {
    const accessToken = getLocalStorage(ELocalStorageItems.AccessToken)
    if (!accessToken) {
      logger("No access token")
      dispatch({
        type: "ADD_MESSAGE",
        data: { message: "Please login again" }
      })
    }
    const response = await axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const User = Record({
      display_name: String,
      images: Array(Record({
        url: String,
      })),
      uri: String
    })

    const { display_name, images, uri } = User.check(response.data)
    return {
      uri,
      displayName: display_name,
      image: images.length > 0 ? images[0].url : null
    }
  }, [])

  useEffect(() => {
    // On app load, if url searchParams includes access_token after Spotify redirect, set it as local storage.
    const accessTokenSearchParam = searchParams.get('access_token')
    if (accessTokenSearchParam) {
      setLocalStorage(ELocalStorageItems.AccessToken, accessTokenSearchParam)
      navigate('.', { replace: true });
      getUserDetails().then(data => dispatch({ type: "LOGIN", data })) // TODO - Could be optimized later.
      return
    }

    const accessTokenLocalStorage = getLocalStorage(ELocalStorageItems.AccessToken)
    if (accessTokenLocalStorage) {
      getUserDetails().then(data => dispatch({ type: "LOGIN", data })) // TODO - Could be optimized later.
    }

  }, [])

  return (
    <ApolloProvider client={apolloClient} >
      <CssBaseline />
      <Navigation />
      <Alert />
      <Router />
    </ApolloProvider >
  )
}

export default App

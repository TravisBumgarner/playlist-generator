import { Login } from 'sharedComponents'
import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import axios from 'axios'
import { context } from 'context'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Array, Record, String } from 'runtypes'
import { theme } from 'theme'
import useAsyncEffect from 'use-async-effect'
import { ELocalStorageItems, getLocalStorage, logger, logout, setLocalStorage } from 'utilities'
import { Footer, Header, Navigation, Router } from './components'

const REFRESH_TOKEN_QUERY = gql`
query RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken){
      expiresIn,
      refreshToken,
      accessToken
    }
  }
`

const App = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { state, dispatch } = useContext(context)
  const [refreshToken] = useLazyQuery<{
    refreshToken: { refreshToken: string; accessToken: string; expiresIn: string }
  }>(REFRESH_TOKEN_QUERY)
  const [hasAppInitialized, setHasAppInitialized] = useState(false)

  const getUserDetails = useCallback(async () => {
    const accessToken = getLocalStorage(ELocalStorageItems.AccessToken) as string
    if (!accessToken) {
      logger('No access token')
      dispatch({
        type: 'ADD_ALERT',
        data: { text: 'Please login again', severity: 'info' },
      })
    }
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const User = Record({
        display_name: String,
        images: Array(
          Record({
            url: String,
          }),
        ),
        uri: String,
        country: String,
      })

      const parsed = User.check(response.data)
      const user = {
        displayName: parsed.display_name,
        image: parsed.images.length > 0 ? parsed.images[0].url : '',
        uri: parsed.uri,
        market: parsed.country,
      }

      dispatch({ type: 'LOGIN', data: user })
    } catch (e) {
      logger(e)
      // This 401's if the user's not logged in.
      // dispatch({ type: 'ADD_ALERT', data: { text: 'Something went wrong', severity: 'error' } })
      logout(dispatch)
    }
    setHasAppInitialized(true)
  }, [dispatch])

  const updateTokenLocalStorage = useCallback(
    (args: { accessToken: string; expiresIn: string; refreshToken: string }) => {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + parseInt(args.expiresIn, 10) * 1000) // expiresIn is in seconds

      setLocalStorage(ELocalStorageItems.AccessToken, args.accessToken)
      setLocalStorage(ELocalStorageItems.ExpiresAt, expiresAt)
      setLocalStorage(ELocalStorageItems.RefreshToken, args.refreshToken)
    },
    [],
  )

  const checkUrlForTokenAndSetLocalStorage = useCallback(() => {
    // On app load, if url searchParams includes access_token after Spotify redirect, set it as local storage.
    const accessTokenSearchParam = searchParams.get('access_token')
    const refreshTokenParam = searchParams.get('refresh_token')
    const expiresInParam = searchParams.get('expires_in')

    if (accessTokenSearchParam && refreshTokenParam && expiresInParam) {
      updateTokenLocalStorage({
        accessToken: accessTokenSearchParam,
        refreshToken: refreshTokenParam,
        expiresIn: expiresInParam,
      })
      navigate('.', { replace: true })
      return true
    }
    return false
  }, [navigate, updateTokenLocalStorage, searchParams])

  const refreshTokenInStorage = useCallback(async () => {
    const refreshTokenLocalStorage = getLocalStorage(ELocalStorageItems.RefreshToken)
    if (!refreshTokenLocalStorage) {
      return false
    }
    const response = await refreshToken({ variables: { refreshToken: refreshTokenLocalStorage } })
    if (!response.data) {
      return false
    }

    updateTokenLocalStorage(response.data.refreshToken)
    return true
  }, [refreshToken, updateTokenLocalStorage])

  const checkTokenValidInStorage = useCallback(async (): Promise<'valid' | 'expired' | 'does_not_exist'> => {
    const accessTokenLocalStorage = getLocalStorage(ELocalStorageItems.AccessToken)
    if (accessTokenLocalStorage) {
      const expiresAtLocalStorage = new Date(getLocalStorage(ELocalStorageItems.ExpiresAt))
      const isTokenInvalid = expiresAtLocalStorage < new Date() || !(expiresAtLocalStorage instanceof Date)
      return isTokenInvalid ? 'valid' : 'expired'
    }
    return 'does_not_exist'
  }, [])

  const OpenModal = useMemo(() => {
    if (state.openModal === null) {
      return null
    }

    return <Login isOpen={true} />
  }, [state.openModal])

  useAsyncEffect(
    async (isMounted) => {
      if (hasAppInitialized || !isMounted) return

      const inUrl = checkUrlForTokenAndSetLocalStorage()

      if (!inUrl) {
        const status = await checkTokenValidInStorage()
        if (status === 'does_not_exist') {
          return
        }

        if (status === 'expired') {
          await refreshTokenInStorage()
        }

        await getUserDetails()
      }
    },
    [checkUrlForTokenAndSetLocalStorage, hasAppInitialized],
  )
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          <Navigation />
          <Router />
          {OpenModal}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App

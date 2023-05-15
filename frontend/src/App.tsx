import { CssBaseline, type LinkProps, ThemeProvider, createTheme } from '@mui/material'
import { gql, useLazyQuery } from '@apollo/client'
import { Link as RouterLink, type LinkProps as RouterLinkProps, useSearchParams } from 'react-router-dom'
import { Record, String, Array } from 'runtypes'
import { useNavigate } from 'react-router'
import { forwardRef, useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import useAsyncEffect from 'use-async-effect'

import { Alert, Router, Header, Navigation } from './components'
import { ELocalStorageItems, getLocalStorage, logger, logout, setLocalStorage } from 'utilities'
import { context } from 'context'

const REFRESH_TOKEN_QUERY = gql`
query RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken){
      expiresIn,
      refreshToken,
      accessToken
    }
  }
`

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  return <RouterLink ref={ref} to={href} {...other} />
})
LinkBehavior.displayName = 'LinkBehavior'

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior
      } as LinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    }
  }
})

const App = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { dispatch } = useContext(context)
  const [refreshToken] = useLazyQuery<{ refreshToken: { refreshToken: string, accessToken: string, expiresIn: string } }>(REFRESH_TOKEN_QUERY)
  const [hasAppInitialized, setHasAppInitialized] = useState(false)

  const getUserDetails = useCallback(async () => {
    const accessToken = (getLocalStorage(ELocalStorageItems.AccessToken)) as string
    if (!accessToken) {
      logger('No access token')
      dispatch({
        type: 'ADD_MESSAGE',
        data: { message: 'Please login again' }
      })
    }
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const User = Record({
        display_name: String,
        images: Array(Record({
          url: String
        })),
        uri: String
      })

      const { display_name, images, uri } = User.check(response.data)
      dispatch({ type: 'LOGIN', data: { displayName: display_name, image: images.length > 0 ? images[0].url : '', uri } })
    } catch (e) {
      logger(e)
      logout(dispatch)
    }
    setHasAppInitialized(true)
  }, [dispatch])

  const updateTokenLocalStorage = useCallback((args: { accessToken: string, expiresIn: string, refreshToken: string }) => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + parseInt(args.expiresIn, 10) * 1000) // expiresIn is in seconds

    setLocalStorage(ELocalStorageItems.AccessToken, args.accessToken)
    setLocalStorage(ELocalStorageItems.ExpiresAt, expiresAt)
    setLocalStorage(ELocalStorageItems.RefreshToken, args.refreshToken)
  }, [])

  const checkUrlForTokenAndSetLocalStorage = useCallback(() => {
    // On app load, if url searchParams includes access_token after Spotify redirect, set it as local storage.
    const accessTokenSearchParam = searchParams.get('access_token')
    const refreshTokenParam = searchParams.get('refresh_token')
    const expiresInParam = searchParams.get('expires_in')

    if (accessTokenSearchParam && refreshTokenParam && expiresInParam) {
      updateTokenLocalStorage({
        accessToken: accessTokenSearchParam,
        refreshToken: refreshTokenParam,
        expiresIn: expiresInParam
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

  useAsyncEffect(async (isMounted) => {
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
  }, [checkUrlForTokenAndSetLocalStorage, hasAppInitialized])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Navigation />
      <Alert />
      <Router />
    </ThemeProvider>
  )
}

export default App

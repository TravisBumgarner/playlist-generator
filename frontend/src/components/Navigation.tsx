import { useCallback, useContext, useMemo } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { gql, useLazyQuery } from '@apollo/client'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import { Avatar } from '@mui/material'

import { context } from 'context'
import { logout } from 'utilities'

const GET_SPOTIFY_REDIRECT_URI_QUERY = gql`
query GetSpotifyRedirectURI {
    getSpotifyRedirectURI
  }
`

const Navigation = () => {
  const [login] = useLazyQuery<{ getSpotifyRedirectURI: string }>(GET_SPOTIFY_REDIRECT_URI_QUERY)
  const { dispatch, state } = useContext(context)

  const handleLogin = useCallback(async () => {
    const redirectURI = await login()
    if (redirectURI.data) {
      window.open(redirectURI.data.getSpotifyRedirectURI, '_self')
    } else {
      dispatch({ type: 'ADD_MESSAGE', data: { message: 'Login failed' } })
    }
  }, [dispatch, login])

  const handleLogout = useCallback(() => {
    logout(dispatch)
  }, [dispatch])

  const Login = useMemo(() => {
    return (<IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={handleLogin}
    >
      <LoginIcon />
    </IconButton>)
  }, [handleLogin])

  const AuthedUser = useMemo(() => {
    if (!state.user) return null

    return (<div>
      <IconButton
        size="large"
      >
        <Avatar src={state.user.image ?? ''} alt={state.user.displayName} />
      </IconButton>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={handleLogout}
      >
        <LogoutIcon />
      </IconButton>
    </div>
    )
  }, [handleLogout, state.user])

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Playlist Generator
        </Typography>
        {state.user ? AuthedUser : Login}
      </Toolbar>
    </AppBar >
  )
}

export default Navigation

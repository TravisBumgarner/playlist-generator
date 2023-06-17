import { useCallback, useContext, useMemo } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import { Avatar, Link } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import { context } from 'context'
import { Loading } from 'sharedComponents'

const Header = () => {
  const { dispatch, state } = useContext(context)

  const login = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', data: 'login' })
  }, [dispatch])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [dispatch])

  const Login = useMemo(() => {
    return (state.isLoggingIn
      ? <Loading />
      : <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={login}
      >
        <LoginIcon />
      </IconButton>)
  }, [login, state.isLoggingIn])

  const handleMenuClick = useCallback(() => {
    dispatch({ type: 'TOGGLE_MENU' })
  }, [dispatch])

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
        onClick={logout}
      >
        <LogoutIcon />
      </IconButton>
    </div>
    )
  }, [state.user, logout])

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          <Link css={{ color: 'white' }} href="/">
            Playlist Generator
          </Link>
        </Typography>
        {state.user ? AuthedUser : Login}
      </Toolbar>
    </AppBar >
  )
}

export default Header

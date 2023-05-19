import { useCallback, useContext, useMemo } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import { Avatar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useLocation } from 'react-router'

import { context } from 'context'
import { logout, login } from 'utilities'
import { ALROGITHM_ROUTES } from './Navigation'

const Header = () => {
  const { dispatch, state } = useContext(context)
  const { pathname } = useLocation()

  const subtitle = useMemo(() => {
    const match = ALROGITHM_ROUTES.find(({ href }) => href === pathname)
    return match ? `: ${match.text}` : ''
  }, [pathname])

  const handleLogin = useCallback(async () => {
    await login(dispatch)
  }, [dispatch])

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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Playlist Generator{subtitle}
        </Typography>
        {state.user ? AuthedUser : Login}
      </Toolbar>
    </AppBar >
  )
}

export default Header

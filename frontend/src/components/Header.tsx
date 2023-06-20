import { useCallback, useContext, useMemo } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import { Avatar, Link, Tooltip } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import { logout } from 'utilities'
import { context } from 'context'

const Header = () => {
  const { dispatch, state } = useContext(context)

  const login = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', data: 'login' })
  }, [dispatch])

  const handleLogout = useCallback(() => {
    logout(dispatch)
  }, [dispatch])

  const Login = useMemo(() => {
    return (
      <Tooltip title="Login">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={login}
        >
          <LoginIcon />
        </IconButton>
      </Tooltip>)
  }, [login])

  const handleMenuClick = useCallback(() => {
    dispatch({ type: 'TOGGLE_MENU' })
  }, [dispatch])

  const AuthedUser = useMemo(() => {
    if (!state.user) return null

    return (<>
      <Avatar sx={{ marginRight: '1rem' }} src={state.user.image ?? ''} alt={state.user.displayName} />
      <Tooltip title="Logout">
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
      </Tooltip>
    </>
    )
  }, [state.user, handleLogout])

  return (
    <AppBar position="static">
      <Toolbar>
        <Tooltip title="Menu">
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
        </Tooltip>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          <Link css={{ color: 'white', textDecoration: 'none' }} href="/">
            Manifest Playlists
          </Link>
        </Typography>
        {state.user ? AuthedUser : Login}
      </Toolbar>
    </AppBar >
  )
}

export default Header

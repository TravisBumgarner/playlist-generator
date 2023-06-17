import { useMemo, useContext, useCallback } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Home'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import AddCommentIcon from '@mui/icons-material/AddComment'

import { context } from 'context'
import { ALGORITHM_ROUTES } from '../algorithms'
import { Login, Logout } from '@mui/icons-material'

const Navigation = () => {
  const { state, dispatch } = useContext(context)

  const algorithmRoutes = useMemo(() => {
    if (!state.user) return null

    return ALGORITHM_ROUTES.map(({ title: text, href }) => {
      return (
        <ListItem disablePadding key={text}>
          <ListItemButton href={href}>
            <ListItemIcon>
              <PlaylistPlayIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      )
    })
  }, [state.user])

  const login = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', data: 'login' })
  }, [dispatch])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [dispatch])

  const LoginOrLogout = useMemo(() => {
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={state.user ? logout : login}>
          <ListItemIcon>
            {state.user ? <Logout /> : <Login />}
          </ListItemIcon>
          <ListItemText primary={state.user ? 'Logout' : 'Login'} />
        </ListItemButton>
      </ListItem>
    )
  }, [state.user, login, logout])

  const toggleDrawer =
    () => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      dispatch({ type: 'TOGGLE_MENU' })
    }

  return (
    <Drawer anchor={'left'} open={state.isMenuOpen} onClose={toggleDrawer()}>
      <Box
        sx={{
          width: 300,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          height: '100%'
        }}
        role="presentation"
        onClick={toggleDrawer()}
        onKeyDown={toggleDrawer()}
      >
        <Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton href="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>{algorithmRoutes}</List>
        </Box>
        <Box>
          <List>
            {LoginOrLogout}
            <ListItem disablePadding>
              <ListItemButton
                target="_blank"
                href="https://forms.gle/Sx34MTubf5vb8YFL7"
              >
                <ListItemIcon>
                  <AddCommentIcon />
                </ListItemIcon>
                <ListItemText primary="Provide Feedback" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  )
}

export default Navigation

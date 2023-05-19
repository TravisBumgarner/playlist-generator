import { useMemo, useContext } from 'react'
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

import { context } from 'context'

export const ALROGITHM_ROUTES: Array<{ text: string, href: string }> = [
  {
    text: 'Progressively Energetic',
    href: '/a/progressively_energetic'
  }
]

const Navigation = () => {
  const { state, dispatch } = useContext(context)

  const algorithmRoutes = useMemo(() => {
    if (!state.user) return null

    return ALROGITHM_ROUTES.map(({ text, href }) => {
      return (
        <ListItem disablePadding key={text} >
          <ListItemButton href={href}>
            <ListItemIcon>
              <PlaylistPlayIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem >
      )
    })
  }, [state.user])

  const toggleDrawer = () =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
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
    <Drawer
      anchor={'left'}
      open={state.isMenuOpen}
      onClose={toggleDrawer()}
    >
      <Box
        sx={{ width: 300 }}
        role="presentation"
        onClick={toggleDrawer()}
        onKeyDown={toggleDrawer()}
      >
        <List>
          <ListItem disablePadding >
            <ListItemButton href="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {algorithmRoutes}
        </List>
      </Box>
    </Drawer>
  )
}

export default Navigation

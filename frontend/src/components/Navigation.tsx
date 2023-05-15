import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import HomeIcon from '@mui/icons-material/Home'
import { Link as RouterLink } from 'react-router-dom'

import { context } from 'context'

const Navigation = () => {
  const { state, dispatch } = React.useContext(context)

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
          <ListItem disablePadding >
            <ListItemButton href="/a/progressively_energetic">
              <ListItemIcon>
                <PlaylistPlayIcon />
              </ListItemIcon>
              <ListItemText primary="Progressively Energetic" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export default Navigation

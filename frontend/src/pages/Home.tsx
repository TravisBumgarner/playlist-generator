import { Container, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useContext } from 'react'
import ListItem from '@mui/material/ListItem'
import { context } from 'context'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'

import { ALGORITHM_ROUTES } from '../components/Navigation'

const Algorithms = () => {
  return (
    <List>
      {
        ALGORITHM_ROUTES.map(({ text, href, description }) => {
          return (
            <ListItem disablePadding key={text} >
              <ListItemButton href={href}>
                <ListItemIcon>
                  <PlaylistPlayIcon />
                </ListItemIcon>
                <ListItemText primary={text} secondary={description} />
              </ListItemButton>
            </ListItem >
          )
        })}
    </List>
  )
}

const Home = () => {
  const { state } = useContext(context)

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Welcome!</Typography>
      {!(state.user) && <Typography variant="h3">Please login.</Typography>}

      {(state.user) && <Algorithms />}
    </Container>
  )
}

export default Home

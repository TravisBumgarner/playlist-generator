import { Container, List, ListItem, Typography, ListItemIcon, ListItemText } from '@mui/material'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'

import { ALGORITHM_ROUTES } from '../algorithms'

const Algorithms = () => {
  return (
    <List>
      {
        ALGORITHM_ROUTES.map(({ title: text, href, description }) => {
          return (
            <ListItem disablePadding key={text} >
              <ListItemIcon>
                <PlaylistPlayIcon />
              </ListItemIcon>
              <ListItemText primary={text} secondary={description} />
            </ListItem >
          )
        })}
    </List>
  )
}

const LandingPage = () => {
  return (
    <Container css={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '60vh' }}>
      <Typography variant="h2" gutterBottom>Welcome!</Typography>
      <Typography variant="body1">Manifest Playlists offer a collection of playlist generators for scratching your musical itch. Browse the list of generators below.</Typography>
      <Typography variant="body1"> Don&#39;t see the one you&#39;re looking for? Leave feedback and I will create it!</Typography>
      <Algorithms />
    </Container>
  )
}

export default LandingPage

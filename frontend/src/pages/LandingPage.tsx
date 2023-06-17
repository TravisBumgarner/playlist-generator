import { Container, List, ListItem, Typography, ListItemIcon, ListItemText, Link } from '@mui/material'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'

import { ALGORITHM_ROUTES } from '../algorithms'
import { pageWrapperCSS } from 'theme'

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
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>Welcome!</Typography>
      <Typography variant="body1">Manifest Playlists offers a collection of playlist generators for scratching your musical itch.</Typography>
      <Algorithms />
      <Typography variant="body1"> Don&#39;t see the one you&#39;re looking for? <Link target="_blank" href="https://forms.gle/Sx34MTubf5vb8YFL7" >Leave feedback</Link> and I will create it!</Typography>
    </Container>
  )
}

export default LandingPage

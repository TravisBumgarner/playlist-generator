import { Container, List, ListItem, Typography, ListItemText, Link } from '@mui/material'

import { ALGORITHM_ROUTES } from '../algorithms'
import { pageWrapperCSS } from 'theme'

const Algorithms = () => {
  return (
    <List>
      {
        ALGORITHM_ROUTES.map(({ title: text, href, description }) => {
          return (
            <ListItem disablePadding key={text} sx={{ margin: '1rem 0' }} >
              <ListItemText primary={<strong>{text}</strong>} secondary={<span>{description}</span>} />
            </ListItem >
          )
        })}
    </List >
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

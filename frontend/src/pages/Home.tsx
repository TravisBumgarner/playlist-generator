import { Box, Container, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'

import { ALGORITHM_ROUTES } from '../algorithms'

const Algorithms = () => {
  return (
    <List>
      {
        ALGORITHM_ROUTES.map(({ title: text, href, description }) => {
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
  return (
    <Container css={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '60vh' }}>
      <Typography variant="h2" gutterBottom>Playlist Generators!</Typography>
      <Box component="ul" sx={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <Algorithms />
      </Box>
    </Container>
  )
}

export default Home

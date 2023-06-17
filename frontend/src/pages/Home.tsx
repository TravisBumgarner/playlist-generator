import { Container, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import AddCommentIcon from '@mui/icons-material/AddComment'

import { ALGORITHM_ROUTES } from '../algorithms'
import { pageWrapperCSS } from 'theme'

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
      <ListItem disablePadding key="wantmore" >
        <ListItemButton target="_blank" href="https://forms.gle/Sx34MTubf5vb8YFL7">
          <ListItemIcon>
            <AddCommentIcon />
          </ListItemIcon>
          <ListItemText primary="Want more?" secondary="Request a playlist generator!" />
        </ListItemButton>
      </ListItem >
    </List>
  )
}

const Home = () => {
  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>Manifest Playlists!</Typography>
      <Algorithms />
    </Container>
  )
}

export default Home

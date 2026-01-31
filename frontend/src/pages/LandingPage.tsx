import { Container, Typography, Link, Button, Grid } from '@mui/material'

import { ALGORITHM_ROUTES } from '../algorithms'
import { pageWrapperCSS } from 'theme'
import { useCallback, useContext } from 'react'
import { context } from 'context'

const Algorithms = () => {
  return (
    <Grid rowSpacing={{ xs: 2, sm: 6 }} columnSpacing={{ xs: 1, sm: 3 }} columns={{ xs: 1, sm: 2 }} container>
      {
        ALGORITHM_ROUTES.map(({ title: text, href, description }) => {
          return (
            <Grid size={{ xs: 1, sm: 1 }} key={text} >
              <Typography variant="h6">{text}</Typography>
              <Typography variant='body1'><span>{description}</span></Typography>
            </Grid >
          )
        })}
    </Grid >
  )
}

const LandingPage = () => {
  const { dispatch } = useContext(context)

  const handleLogin = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', data: 'login' })
  }, [dispatch])

  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>Welcome!</Typography>
      <Typography textAlign="center" variant="body1">Manifest Playlists offers a collection of playlist generators for scratching your musical itch.</Typography>
      <Typography variant="body1">To start generating playlists, you will need to login to Spotify.</Typography>
      <Button sx={{ margin: '2rem' }} variant="contained" onClick={handleLogin}>Login</Button>
      <Algorithms />
      <Typography sx={{ marginTop: '2rem' }} variant="body1"> Don&#39;t see the one you&#39;re looking for? <Link target="_blank" href="https://forms.gle/Sx34MTubf5vb8YFL7" >Leave feedback</Link> and I will create it!</Typography>
    </Container>
  )
}

export default LandingPage

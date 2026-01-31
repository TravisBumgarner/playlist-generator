import { Box, Button, Link, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { context } from 'context'
import { useCallback, useContext } from 'react'
import { ALGORITHM_ROUTES } from '../algorithms'
import PageWrapper from '../styles/shared/PageWrapper'
import { SPACING, subtleBackground } from '../styles/styleConsts'

const Algorithms = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: SPACING.MEDIUM.PX,
        width: '100%',
        '@media (max-width: 480px)': {
          gridTemplateColumns: '1fr',
        },
      }}
    >
      {ALGORITHM_ROUTES.map(({ title, description }) => (
        <Box
          key={title}
          sx={{
            padding: SPACING.MEDIUM.PX,
            backgroundColor: subtleBackground(theme.palette.mode),
          }}
        >
          <Typography variant="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </Box>
      ))}
    </Box>
  )
}

const LandingPage = () => {
  const { dispatch } = useContext(context)

  const handleLogin = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', data: 'login' })
  }, [dispatch])

  return (
    <PageWrapper>
      <Typography variant="h2" gutterBottom>
        Welcome!
      </Typography>
      <Typography textAlign="center" variant="body1">
        Manifest Playlists offers a collection of playlist generators for scratching your musical itch.
      </Typography>
      <Typography variant="body1">To start generating playlists, you will need to login to Spotify.</Typography>
      <Button sx={{ margin: SPACING.LARGE.PX }} variant="contained" onClick={handleLogin}>
        Login
      </Button>
      <Algorithms />
      <Typography sx={{ marginTop: SPACING.MEDIUM.PX }} variant="body1">
        Don&#39;t see what you&#39;re looking for? <Link href="/contact">Request a playlist generator</Link>
      </Typography>
    </PageWrapper>
  )
}

export default LandingPage

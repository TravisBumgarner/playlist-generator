import { Box, Link, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
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
      {ALGORITHM_ROUTES.map(({ title, href, description }) => (
        <Box
          key={title}
          component="a"
          href={href}
          sx={{
            padding: SPACING.MEDIUM.PX,
            backgroundColor: subtleBackground(theme.palette.mode),
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              backgroundColor: subtleBackground(theme.palette.mode, 'slightly'),
            },
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

const Home = () => {
  return (
    <PageWrapper>
      <Typography variant="h2" gutterBottom>
        Manifest Playlists!
      </Typography>
      <Algorithms />
      <Typography sx={{ marginTop: SPACING.MEDIUM.PX }} variant="body1">
        Don&#39;t see what you&#39;re looking for? <Link href="/contact">Request a playlist generator</Link>
      </Typography>
    </PageWrapper>
  )
}

export default Home

import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import spotifyLogo from '../static/spotify_dark.png'
import { SPACING, subtleBackground } from '../styles/styleConsts'
import Alert from './Alert'

const Footer = () => {
  const theme = useTheme()

  return (
    <>
      <Alert />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: SPACING.SMALL.PX,
          backgroundColor: subtleBackground(theme.palette.mode),
        }}
      >
        <Typography variant="body2">Manifest Playlists</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: SPACING.SMALL.PX }}>
          <Typography variant="body2">Powered by</Typography>
          <Box component="img" src={spotifyLogo} sx={{ height: '24px' }} />
        </Box>
      </Box>
    </>
  )
}

export default Footer

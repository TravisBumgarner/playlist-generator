import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import spotifyLogoBlack from '../static/Spotify_Full_Logo_RGB_Black.png'
import spotifyLogoWhite from '../static/Spotify_Full_Logo_RGB_White.png'
import { SPACING } from '../styles/styleConsts'
import Alert from './Alert'

const Footer = () => {
  const theme = useTheme()
  const spotifyLogo = theme.palette.mode === 'dark' ? spotifyLogoWhite : spotifyLogoBlack

  return (
    <>
      <Alert />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: SPACING.SMALL.PX,
          padding: SPACING.SMALL.PX,
        }}
      >
        <Typography variant="body2">Powered by</Typography>
        <Box component="img" src={spotifyLogo} sx={{ height: '24px' }} />
      </Box>
    </>
  )
}

export default Footer

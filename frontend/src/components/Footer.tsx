import { Box, Typography } from '@mui/material'
import spotifyLogo from '../static/spotify_dark.png'
import { SPACING } from '../styles/styleConsts'
import Alert from './Alert'

const Footer = () => {
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

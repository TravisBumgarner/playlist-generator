import { Container, Typography } from '@mui/material'

const LandingPage = () => {
  return (
    <Container css={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '60vh' }}>
      <Typography variant="h2" gutterBottom>Welcome!</Typography>
      <Typography variant="body1">Please login with Spotify to Continue.</Typography>
    </Container>
  )
}

export default LandingPage

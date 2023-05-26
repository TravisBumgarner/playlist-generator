import { Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <Container>
    <Typography variant="h2">Whoops!</Typography>
    <Typography variant="body1">We could not find the page you are looking for.</Typography>
    <Typography variant="body1"><Link to="/" >Return Home</Link></Typography>
  </Container>
)

export default NotFound

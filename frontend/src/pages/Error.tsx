import { Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Error = () => (
  <Container>
    <Typography variant="h2">Whoops!</Typography>
    <Typography variant="body1">Sorry, there was an error.</Typography>
    <Typography variant="body1"><Link to="/" >Return Home</Link></Typography>
  </Container>
)

export default Error

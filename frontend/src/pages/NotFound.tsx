import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import PageWrapper from '../styles/shared/PageWrapper'

const NotFound = () => (
  <PageWrapper>
    <Typography variant="h2">Whoops!</Typography>
    <Typography variant="body1">We could not find the page you are looking for.</Typography>
    <Typography variant="body1">
      <Link to="/">Return Home</Link>
    </Typography>
  </PageWrapper>
)

export default NotFound

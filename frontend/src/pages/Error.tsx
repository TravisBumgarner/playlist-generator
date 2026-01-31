import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import PageWrapper from '../styles/shared/PageWrapper'

const Error = () => (
  <PageWrapper>
    <Typography variant="h2">Whoops!</Typography>
    <Typography variant="body1">Sorry, there was an error.</Typography>
    <Typography variant="body1">
      <Link to="/">Return Home</Link>
    </Typography>
  </PageWrapper>
)

export default Error

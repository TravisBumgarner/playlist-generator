import { Container, List, Typography } from '@mui/material'
import { useContext } from 'react'
import ListItem from '@mui/material/ListItem'
import { context } from 'context'
import { Link } from 'react-router-dom'

const Algorithms = () => {
  return (
    <List>
      <ListItem disablePadding>
        <Link to="/a/progressively_energetic">Progressively Energetic</Link>
      </ListItem>
    </List>
  )
}

const Home = () => {
  const { state } = useContext(context)

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Welcome!</Typography>
      {!(state.user) && <Typography variant="h3">Please login.</Typography>}

      {(state.user) && <Algorithms />}
    </Container>
  )
}

export default Home

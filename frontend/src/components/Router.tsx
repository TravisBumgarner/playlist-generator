import { Loading } from 'sharedComponents'
import { Container } from '@mui/material'
import { context } from 'context'
import { type JSX, useContext } from 'react'
import { Route, Routes } from 'react-router'
import { Navigate } from 'react-router-dom'
import { ALGORITHM_ROUTES } from '../algorithms'
import { Changelog, Contact, Error, Home, LandingPage, NotFound, Sandbox } from '../pages'

interface ConditionalRouteProps {
  authedComponent: JSX.Element
  unauthedComponent?: JSX.Element
}

const ConditionalRoute = ({ authedComponent, unauthedComponent }: ConditionalRouteProps) => {
  const { state } = useContext(context)
  if (state.user) {
    return authedComponent
  }
  return unauthedComponent ?? <Navigate to="/" />
}

const Router = () => {
  const { state } = useContext(context)

  if (state.hasErrored) {
    return <Error />
  }

  if (state.isLoggingIn) {
    return (
      <Container sx={{ marginTop: '40vh' }}>
        <Loading />
      </Container>
    )
  }

  return (
    <Routes>
      <Route path="/error" element={<Error />} />
      <Route path="/" element={<ConditionalRoute authedComponent={<Home />} unauthedComponent={<LandingPage />} />} />
      {ALGORITHM_ROUTES.map(({ href, component, title, description }) => {
        return (
          <Route
            key={href}
            path={href}
            element={
              <ConditionalRoute authedComponent={component(title, description)} unauthedComponent={<LandingPage />} />
            }
          />
        )
      })}
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rudaruda" element={<Sandbox />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Router

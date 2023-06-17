import { useContext } from 'react'
import { Routes, Route } from 'react-router'
import { Navigate } from 'react-router-dom'

import { context } from 'context'
import { Home, Error, LandingPage, NotFound, Sandbox } from '../pages'
import { ALGORITHM_ROUTES } from '../algorithms'
import { Loading } from 'sharedComponents'
import { Container } from '@mui/material'

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
      <Route path="/" element={(
        <ConditionalRoute
          authedComponent={<Home />}
          unauthedComponent={<LandingPage />}
        />
      )}
      />
      {ALGORITHM_ROUTES.map(({ href, component, title, description }) => {
        return (
          <Route key={href} path={href} element={(
            <ConditionalRoute
              authedComponent={component(title, description)}
              unauthedComponent={<LandingPage />}
            />
          )}
          />
        )
      })}
      <Route path="/rudaruda" element={<Sandbox />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default Router

import { useContext } from 'react'
import { Routes, Route } from 'react-router'
import { Navigate } from 'react-router-dom'

import { context } from 'context'
import { Home, Error, LandingPage, NotFound } from '../pages'
import { ALGORITHM_ROUTES } from '../algorithms'

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
        console.log(href)
        return (
          <Route key={href} path={href} element={(
            <ConditionalRoute
              authedComponent={component(title, description)}
              unauthedComponent={<Home />}
            />
          )}
          />
        )
      })}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default Router

import { useContext } from 'react'
import { Routes, Route } from 'react-router'
import { Navigate } from 'react-router-dom'

import { context } from 'context'
import { Home, Error, LandingPage } from '../pages'
import { ProgressivelyEnergetic } from '../pages/algorithms'

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
      <Route path="/a/progressively_energetic" element={(
        <ConditionalRoute
          authedComponent={<ProgressivelyEnergetic />}
          unauthedComponent={<Home />}
        />
      )}
      />
    </Routes>
  )
}

export default Router

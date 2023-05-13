import { useReducer, createContext } from 'react'

import { logger } from 'utilities'

interface State {
  message: {
    body: string
  } | null
  hasErrored: boolean
  user: {
    displayName: string
    image: string | null
    uri: string
  } | null
}

const EMPTY_STATE: State = {
  message: null,
  hasErrored: false,
  user: null
}

interface Login {
  type: 'LOGIN'
  data: {
    displayName: string
    uri: string
    image: string | null
  }
}

interface Logout {
  type: 'LOGOUT'
}

interface HasErrored {
  type: 'HAS_ERRORED'
}

interface AddMessage {
  type: 'ADD_MESSAGE'
  data: {
    message: string
  }
}

interface DeleteMessage {
  type: 'DELETE_MESSAGE'
}

type Action =
  | AddMessage
  | DeleteMessage
  | HasErrored
  | Login
  | Logout

const context = createContext({
  state: EMPTY_STATE,
  dispatch: () => { }
} as {
  state: State
  dispatch: React.Dispatch<Action>
}
)

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'HAS_ERRORED': {
      return { ...state, hasErrored: true }
    }
    case 'ADD_MESSAGE': {
      return { ...state, message: { body: action.data.message } }
    }
    case 'DELETE_MESSAGE': {
      return { ...state, message: null }
    }
    case 'LOGIN': {
      return { ...state, user: { ...action.data } }
    }
    case 'LOGOUT': {
      return { ...state, user: null }
    }
    default: {
      logger(`Swallowing action: ${JSON.stringify(action)}`)
      return state
    }
  }
}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE)

  const { Provider } = context

  return (
    <Provider value={
      { state, dispatch }
    }>
      {children}
    </Provider>
  )
}

export default ResultsContext
export {
  context,
  type Action
}

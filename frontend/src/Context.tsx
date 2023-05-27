import { useReducer, createContext } from 'react'

import { logger } from 'utilities'

interface State {
  alert: {
    text: string
    severity: 'error' | 'warning' | 'info' | 'success'
    url?: string
  } | null
  hasErrored: boolean
  user: {
    displayName: string
    image: string | null
    uri: string
    market: string
  } | null
  isMenuOpen: boolean
  isLoggingIn: boolean
}

const EMPTY_STATE: State = {
  alert: null,
  hasErrored: false,
  user: null,
  isMenuOpen: false,
  isLoggingIn: false
}

interface Login {
  type: 'LOGIN'
  data: {
    displayName: string
    uri: string
    image: string | null
    market: string
  }
}

interface LoginInitiated {
  type: 'LOGIN_INITIATED'
}

interface Logout {
  type: 'LOGOUT'
}

interface HasErrored {
  type: 'HAS_ERRORED'
}

interface ToggleMenu {
  type: 'TOGGLE_MENU'
}

interface AddMessage {
  type: 'ADD_ALERT'
  data: {
    text: string
    severity: 'error' | 'warning' | 'info' | 'success'
    url?: string
  }
}

interface DeleteMessage {
  type: 'DELETE_ALERT'
}

type Action =
  | AddMessage
  | DeleteMessage
  | HasErrored
  | Login
  | Logout
  | ToggleMenu
  | LoginInitiated

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
    case 'TOGGLE_MENU': {
      return { ...state, isMenuOpen: !state.isMenuOpen }
    }
    case 'HAS_ERRORED': {
      return { ...state, hasErrored: true }
    }
    case 'ADD_ALERT': {
      return { ...state, alert: { ...action.data } }
    }
    case 'DELETE_ALERT': {
      return { ...state, alert: null }
    }
    case 'LOGIN': {
      return { ...state, user: { ...action.data }, isLoggingIn: false }
    }
    case 'LOGIN_INITIATED': {
      return { ...state, isLoggingIn: true }
    }
    case 'LOGOUT': {
      return { ...state, user: null, isLoggingIn: false }
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

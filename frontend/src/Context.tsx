import { useReducer, createContext, Provider } from 'react'

import { logger } from 'utilities'

type State = {
    message: {
        body: string
    } | null
    hasErrored: boolean
    user: {
        displayName: string,
        image: string | null
        uri: string
    } | null
}

const EMPTY_STATE: State = {
    message: null,
    hasErrored: false,
    user: null
}

type Login = {
    type: "LOGIN",
    data: {
        displayName: string
        uri: string
        image: string | null
    }
}

type HasErrored = {
    type: 'HAS_ERRORED'
}

type AddMessage = {
    type: 'ADD_MESSAGE'
    data: {
        message: string
    }
}

type DeleteMessage = {
    type: 'DELETE_MESSAGE'
}

type Action =
    | AddMessage
    | DeleteMessage
    | HasErrored
    | Login

const context = createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { },
    } as {
        state: State,
        dispatch: React.Dispatch<Action>
    },
)

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'HAS_ERRORED': {
            return { ...state, hasErrored: true }
        }
        case 'ADD_MESSAGE': {
            console.log(action.data.message)
            return { ...state, message: { body: action.data.message } }
        }
        case 'DELETE_MESSAGE': {
            return { ...state, message: null }
        }
        case "LOGIN": {
            return { ...state, user: { ...action.data } }
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
    Action,
}
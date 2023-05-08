import { useContext } from 'react'
import { Alert as AlertMUI, Button, Collapse } from '@mui/material'
import { css } from '@emotion/react'

import { context } from 'context'

const AlertPositionerCSS = css`
    z-index: 999;
    position: fixed;
    bottom: 5vw;
    left: 5vw;
    right: 5vw;
    display: flex;
    justify-content: center;
    opacity: 1;
`

const Alert = () => {
    const { state, dispatch } = useContext(context)

    const handleSubmit = () => {
        dispatch({ type: 'DELETE_MESSAGE' })
    }

    if (!state.message) return null

    return (
        <div css={AlertPositionerCSS}>
            <Collapse>
                <AlertMUI
                    action={
                        <Button color="inherit" size="small" onClick={handleSubmit}>
                            Close
                        </Button>
                    }
                    severity="error">{state.message.body}</AlertMUI>
            </Collapse>
        </div >
    )
}

export default Alert
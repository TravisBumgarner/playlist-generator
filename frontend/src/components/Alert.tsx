import { useContext } from 'react'
import { Alert as AlertMUI, Box, Button, Link } from '@mui/material'
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
    dispatch({ type: 'DELETE_ALERT' })
  }

  if (!state.alert) return null

  return (
    <Box css={AlertPositionerCSS}>
      <AlertMUI
        action={
          <Button color="inherit" size="small" onClick={handleSubmit}>
            Close
          </Button>
        }
        severity={state.alert.severity}>{state.alert.text} {state.alert.url && <Link target="_blank" href={state.alert.url}>Open Playlist</Link>}</AlertMUI>
    </Box >
  )
}

export default Alert

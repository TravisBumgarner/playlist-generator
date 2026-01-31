import { css } from '@emotion/react'
import { Alert as AlertMUI, Box, Button, Link } from '@mui/material'
import { context } from 'context'
import { useContext } from 'react'

const AlertPositionerCSS = css`
    display: flex;
    justify-content: center;
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
        variant="outlined"
        action={
          <Button color="inherit" size="small" onClick={handleSubmit}>
            Close
          </Button>
        }
        severity={state.alert.severity}
      >
        {state.alert.text}{' '}
        {state.alert.url && (
          <Link target="_blank" href={state.alert.url}>
            Open Playlist
          </Link>
        )}
      </AlertMUI>
    </Box>
  )
}

export default Alert

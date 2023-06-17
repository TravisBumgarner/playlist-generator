import { type Dispatch, type SetStateAction, useCallback, useContext } from 'react'
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import { login } from 'utilities'
import { context } from 'context'

const LoginModal = ({ isOpen }: { isOpen: boolean }) => {
  const { dispatch } = useContext(context)
  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL' })
  }

  const handleSubmit = useCallback(async () => {
    await login(dispatch)
    dispatch({ type: 'CLOSE_MODAL' })
  }, [dispatch])

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle textAlign="center">Login</DialogTitle>
      <DialogContent>
        <Button fullWidth variant='contained' onClick={handleSubmit}>Login with Spotify</Button>
        <Typography sx={{ marginTop: '1rem' }} textAlign="center" component="p" variant="caption">
          I do not store any of your personal data.
        </Typography>
        <Typography textAlign="center" component="p" variant="caption">
          Access will allow generated playlists to be saved to your Spotify account.
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal

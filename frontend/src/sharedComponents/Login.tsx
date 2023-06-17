import React, { type Dispatch, type SetStateAction, useCallback, useContext } from 'react'
import {
  Modal,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import { login } from 'utilities'
import { context } from 'context'

const LoginModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24
}

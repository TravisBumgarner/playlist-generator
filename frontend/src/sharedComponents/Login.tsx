import React, { type Dispatch, type SetStateAction, useCallback, useContext } from 'react'
import {
  Modal,
  Typography,
  Box,
  Button
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
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography textAlign="center" variant="h3" component="h2" gutterBottom>
          Login
        </Typography>
        <Button fullWidth variant='contained' onClick={handleSubmit}>Login with Spotify</Button>
        <Typography sx={{ marginTop: '1rem' }} textAlign="center" component="p" variant="caption">
          I do not store any of your data. Access will allow generated playlists to be saved to your Spotify account.
        </Typography>
      </Box>
    </Modal>
  )
}

export default LoginModal

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  backgroundColor: 'white',
  borderRadius: '1rem',
  boxShadow: 24,
  p: 4
}

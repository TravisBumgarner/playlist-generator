import { Avatar, Box, Button, Link, Tooltip, Typography } from '@mui/material'
import { context } from 'context'
import { useCallback, useContext, useMemo } from 'react'
import { logout } from 'utilities'
import { SPACING } from '../styles/styleConsts'

const Header = () => {
  const { dispatch, state } = useContext(context)

  const handleLogin = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', data: 'login' })
  }, [dispatch])

  const handleLogout = useCallback(() => {
    logout(dispatch)
  }, [dispatch])

  const RightSide = useMemo(() => {
    if (state.user) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: SPACING.SMALL.PX }}>
          <Link href="/changelog" sx={{ textDecoration: 'none' }}>
            Changelog
          </Link>
          <Avatar sx={{ width: 32, height: 32 }} src={state.user.image ?? ''} alt={state.user.displayName} />
          <Tooltip title="Logout">
            <Button variant="text" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Tooltip>
        </Box>
      )
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: SPACING.SMALL.PX }}>
        <Link href="/changelog" sx={{ textDecoration: 'none' }}>
          Changelog
        </Link>
        <Button variant="contained" size="small" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    )
  }, [state.user, handleLogin, handleLogout])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${SPACING.SMALL.PX} ${SPACING.MEDIUM.PX}`,
        marginBottom: SPACING.MEDIUM.PX,
      }}
    >
      <Link href="/" sx={{ textDecoration: 'none' }}>
        <Typography variant="h3" component="h1">
          Manifest Playlists
        </Typography>
      </Link>
      {RightSide}
    </Box>
  )
}

export default Header

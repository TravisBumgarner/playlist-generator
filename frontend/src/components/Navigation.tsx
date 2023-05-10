import { useContext, useCallback } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LinkMUI from '@mui/icons-material/Link';
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { gql, useLazyQuery } from '@apollo/client';
import { context } from 'context';
import { Avatar } from '@mui/material';

const GET_SPOTIFY_REDIRECT_URI_QUERY = gql`
query GetSpotifyRedirectURI {
    getSpotifyRedirectURI
  }
`

export default function Navigation() {
    const [login] = useLazyQuery<{ getSpotifyRedirectURI: string }>(GET_SPOTIFY_REDIRECT_URI_QUERY)
    const { dispatch, state } = useContext(context)

    const handleAuth = useCallback(async () => {
        const redirectURI = await login()
        if (redirectURI.data) {
            window.open(redirectURI.data.getSpotifyRedirectURI, '_blank')
        } else {
            dispatch({ type: "ADD_MESSAGE", data: { message: "Login failed" } })
        }

    }, [])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleAuth}
                    >
                        <LoginIcon />
                    </IconButton>
                    <Link to="/">Home</Link>
                </Toolbar>
                {state.user ? <Avatar src={state.user.image || ''} alt={state.user.displayName} /> : null}
            </AppBar>
        </Box>
    );
}
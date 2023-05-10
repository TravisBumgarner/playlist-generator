import { useCallback, useState, MouseEvent, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { context } from 'context';
import { gql, useLazyQuery } from '@apollo/client';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { Avatar } from '@mui/material';
import { ELocalStorageItems, deleteLocalStorage, setLocalStorage } from 'utilities';


const GET_SPOTIFY_REDIRECT_URI_QUERY = gql`
query GetSpotifyRedirectURI {
    getSpotifyRedirectURI
  }
`

export default function MenuAppBar() {
    const [auth, setAuth] = useState(true);
    const [login] = useLazyQuery<{ getSpotifyRedirectURI: string }>(GET_SPOTIFY_REDIRECT_URI_QUERY)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { dispatch, state } = useContext(context)

    const handleLogin = useCallback(async () => {
        const redirectURI = await login()
        if (redirectURI.data) {
            window.open(redirectURI.data.getSpotifyRedirectURI, '_self')
        } else {
            dispatch({ type: "ADD_MESSAGE", data: { message: "Login failed" } })
        }

    }, [])

    const handleLogout = useCallback(() => {
        deleteLocalStorage(ELocalStorageItems.AccessToken)
        dispatch({ type: "LOGOUT" })

    }, [])

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Playlist Generator
                </Typography>
                {state.user ? (
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar src={state.user.image || ''} alt={state.user.displayName} />
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleLogout}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </div>
                ) : (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleLogin}
                    >
                        <LoginIcon />
                    </IconButton>
                )}
            </Toolbar>
        </AppBar >
    );
}
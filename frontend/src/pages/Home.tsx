import { gql, useLazyQuery } from "@apollo/client"
import { Box, Button, Container, List, ListItemButton, Typography } from "@mui/material"
import { useCallback, useContext, useState, useMemo } from "react"
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import SpotifyWebApi from 'spotify-web-api-node'

import { TAutocompleteEntry, TPlaylistEntry } from '../sharedTypes'
import { ELocalStorageItems, getLocalStorage } from "utilities"
import { context } from "context"
import { Link } from "react-router-dom";

const AUTOCOMPLETE_QUERY = gql`
query Autocomplete($query: String!) {
    autocomplete(query: $query, types: artist) {
        name
        id
        image
    }
  }
`

const CREATE_ENERGIZING_PLAYLIST_QUERY = gql`
query createEnergizingPlaylist($artistId: String!) {
    createEnergizingPlaylist(artistId: $artistId) {
        name
        id
        album
        artists
        uri
    }
  }
`

const PlaylistItem = (data: TPlaylistEntry) => {
    const handleClick = useCallback(() => alert(data.id), [])
    return (
        <ListItem onClick={handleClick}>
            <ListItemAvatar>
                <Avatar alt={data.name} />
            </ListItemAvatar>
            <ListItemText primary={data.name} secondary={data.artists} />
        </ListItem >
    )
}

const AutocompleteItem = ({ data, resultSelectedCallback }: { data: TAutocompleteEntry, resultSelectedCallback: (artistId: string) => void }) => {
    const handleClick = useCallback(() => resultSelectedCallback(data.id), [data.id])
    return (
        <ListItem onClick={handleClick}>
            <ListItemAvatar>
                <Avatar alt={data.name} src={data.image} />
            </ListItemAvatar>
            <ListItemText primary={data.name} />
        </ListItem >
    )
}

const SearchBox = ({ resultSelectedCallback }: { resultSelectedCallback: (artistId: string) => void }) => {
    const [autocomplete] = useLazyQuery<{ autocomplete: TAutocompleteEntry[] }>(AUTOCOMPLETE_QUERY)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<TAutocompleteEntry[]>([])

    const handleSubmit = useCallback(async () => {
        setResults([])
        const result = await autocomplete({ variables: { query } })
        if (result.data?.autocomplete) {
            setResults(result.data?.autocomplete)
        }
    }, [query])

    const handleResultSelected = useCallback((artistId: string) => {
        resultSelectedCallback(artistId)
        setResults([])
    }, [])

    const AutocompleteItemsList = useMemo(() => {
        return results.map(data => <AutocompleteItem resultSelectedCallback={handleResultSelected} key={data.id} data={data} />)
    }, [results])

    return (
        <Box>
            <TextField
                label="Artist"
                type="search"
                value={query}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setQuery(event.target.value);
                }}
            />
            <Button onClick={handleSubmit} variant="contained">Submit</Button>
            {AutocompleteItemsList}
        </Box>
    );
}

const Playlist = ({ artistId }: { artistId: string }) => {
    const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])
    const [createEnergizingPlaylist] = useLazyQuery<{ createEnergizingPlaylist: TPlaylistEntry[] }>(CREATE_ENERGIZING_PLAYLIST_QUERY)
    const { dispatch } = useContext(context)

    const handleCreatePlaylistSubmit = useCallback(async () => {
        setPlaylistEntries([])
        const result = await createEnergizingPlaylist({ variables: { artistId } })
        if (result.data?.createEnergizingPlaylist) {
            setPlaylistEntries(result.data?.createEnergizingPlaylist)
        }
    }, [artistId])

    const handleSavePlaylistSubmit = useCallback(async () => {
        const uris = playlistEntries.map(({ uri }) => uri)

        const spotifyApi = new SpotifyWebApi({});
        const accessToken = getLocalStorage(ELocalStorageItems.AccessToken)
        if (!accessToken) { //TODO - could warn sooner
            dispatch({ type: "ADD_MESSAGE", data: { message: "You need to login first" } })
            return
        }
        await spotifyApi.setAccessToken(accessToken)

        const playlist = await spotifyApi.createPlaylist('My Programatic Playlist')

        await spotifyApi.addTracksToPlaylist(playlist.body.id, uris)

        dispatch({ type: "ADD_MESSAGE", data: { message: `Success! Open Spotify https://open.spotify.com/playlist/${playlist.body.uri}` } })


        setPlaylistEntries([])
    }, [artistId, playlistEntries])

    const Playlist = useMemo(() => {
        return playlistEntries.map(result => <PlaylistItem key={result.uri} {...result} />)
    }, [playlistEntries])

    return (<Box>
        {
            playlistEntries.length === 0
                ? (<Button onClick={handleCreatePlaylistSubmit}>Create Energizing Playlist!</Button>)
                : (<Button onClick={handleSavePlaylistSubmit}>Save it to Travis's Playlist</Button>)
        }
        {Playlist}
    </Box>
    )
}

const Algorithms = () => {
    return (
        <List>
            <ListItem disablePadding>
                <Link to="/a/elevated_artist">Elevated Artist</Link>
            </ListItem>
        </List>
    )
}

const Home = () => {
    const { state } = useContext(context)

    return (
        <Container>
            <Typography variant="h2" gutterBottom>Welcome!</Typography>
            {!(state.user) && <Typography variant="h3">Please login.</Typography>}

            {(state.user) && <Algorithms />}
        </Container>
    )
}

export default Home

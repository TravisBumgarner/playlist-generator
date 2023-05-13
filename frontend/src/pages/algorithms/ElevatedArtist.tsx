import { gql, useLazyQuery } from "@apollo/client"
import { Box, Button, Container, Typography } from "@mui/material"
import { useCallback, useContext, useState, useMemo } from "react"
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import SpotifyWebApi from 'spotify-web-api-node'

import { TAutocompleteEntry, TPlaylistEntry } from '../../sharedTypes'
import { ELocalStorageItems, getLocalStorage } from "utilities"
import { context } from "context"

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

const SAVE_PLAYLIST_QUERY = gql`
query savePlaylist($accessToken: String! $playlistTitle: String! $uris: [String]!) {
    savePlaylist(accessToken: $accessToken, playlistTitle: $playlistTitle, uris: $uris) 
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
    const [savePlaylist] = useLazyQuery<{ savePlaylist: boolean }>(SAVE_PLAYLIST_QUERY)
    const { dispatch } = useContext(context)
    const [playlistTitle, setPlaylistTitle] = useState('')

    const handleCreatePlaylistSubmit = useCallback(async () => {
        setPlaylistEntries([])
        const result = await createEnergizingPlaylist({ variables: { artistId } })
        if (result.data?.createEnergizingPlaylist) {
            setPlaylistEntries(result.data?.createEnergizingPlaylist)
        }
    }, [artistId])

    const handleSavePlaylistSubmit = useCallback(async () => {
        const uris = playlistEntries.map(({ uri }) => uri)

        const accessToken = getLocalStorage(ELocalStorageItems.AccessToken)
        if (!accessToken) { //TODO - could warn sooner
            dispatch({ type: "ADD_MESSAGE", data: { message: "You need to login first" } })
            return
        }
        const playlistUri = await savePlaylist({ variables: { uris, playlistTitle, accessToken } })
        if (playlistUri) {
            dispatch({ type: "ADD_MESSAGE", data: { message: `Success! Open Spotify https://open.spotify.com/playlist/${playlistUri}` } })
        } else {
            dispatch({ type: "ADD_MESSAGE", data: { message: `Failed to save playlist` } })
        }


        setPlaylistEntries([])
    }, [artistId, playlistEntries])

    const Playlist = useMemo(() => {
        return playlistEntries.map(result => <PlaylistItem key={result.uri} {...result} />)
    }, [playlistEntries])

    return (<Box>
        {
            playlistEntries.length === 0
                ? (<Button onClick={handleCreatePlaylistSubmit}>Create Energizing Playlist!</Button>)
                : (<Box>
                    <TextField
                        label="Title"
                        type="title"
                        value={playlistTitle}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPlaylistTitle(event.target.value);
                        }}
                    />
                    <Button onClick={handleSavePlaylistSubmit}>Save it to your Spotify</Button>

                </Box>)
        }
        {Playlist}
    </Box>
    )
}

const Home = () => {
    const [artistId, setArtistId] = useState('')

    const resultSelectedCallback = useCallback((value: string) => {
        setArtistId(value)
    }, [])

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Elevated Artist
            </Typography>
            <SearchBox resultSelectedCallback={resultSelectedCallback} />
            <Playlist artistId={artistId} />

        </Container>
    )
}

export default Home

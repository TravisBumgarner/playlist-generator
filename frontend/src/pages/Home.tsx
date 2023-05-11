import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { Box, Button, Container, ListItemButton, Typography } from "@mui/material"
import { useCallback, useEffect, useState, useMemo } from "react"

import { Loading } from "sharedComponents"
import { TAutocompleteEntry, TPlaylistEntry } from '../../../shared/types'
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import TextField from '@mui/material/TextField';


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
mutation savePlaylist($uris: [String]!) {
    savePlaylist(uris: $uris)
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
    const [savePlaylist] = useMutation<{ savePlaylist: boolean }>(SAVE_PLAYLIST_QUERY)

    const handleCreatePlaylistSubmit = useCallback(async () => {
        setPlaylistEntries([])
        const result = await createEnergizingPlaylist({ variables: { artistId } })
        if (result.data?.createEnergizingPlaylist) {
            setPlaylistEntries(result.data?.createEnergizingPlaylist)
        }
    }, [artistId])

    const handleSavePlaylistSubmit = useCallback(async () => {
        console.log(playlistEntries)
        const uris = playlistEntries.map(({ uri }) => uri)
        console.log(uris.join(','))
        navigator.clipboard.writeText(uris.join(','))
        // const result = await savePlaylist({ variables: { uris } })
        // // if (result.data?.savePlaylist) {
        // //     setPlaylistEntries(result.data?.savePlaylist)
        // // }
        setPlaylistEntries([])
    }, [artistId, playlistEntries])

    const Playlist = useMemo(() => {
        return playlistEntries.map(result => <PlaylistItem key={result.uri} {...result} />)
    }, [playlistEntries])

    console.log(playlistEntries)

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

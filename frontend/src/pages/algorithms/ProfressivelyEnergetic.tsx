import { gql, useLazyQuery } from '@apollo/client'
import { Box, Button, Container, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'
import TextField from '@mui/material/TextField'

import { Search, Playlist } from 'sharedComponents'
import { type TAutocompleteEntry, type TPlaylistEntry } from '../../sharedTypes'
import { ELocalStorageItems, getLocalStorage } from 'utilities'
import { context } from 'context'
import { useNavigate } from 'react-router'

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

const ProgressivelyEnergetic = () => {
  const [savePlaylist] = useLazyQuery<{ savePlaylist: boolean }>(SAVE_PLAYLIST_QUERY)
  const [playlistTitle, setPlaylistTitle] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createEnergizingPlaylist] = useLazyQuery<{ createEnergizingPlaylist: TPlaylistEntry[] }>(CREATE_ENERGIZING_PLAYLIST_QUERY)
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])
  const { dispatch } = useContext(context)
  const navigate = useNavigate()

  const handleCreatePlaylistSubmit = useCallback(async () => {
    if (!selectedArtist) {
      return
    }

    setPlaylistEntries([])
    const result = await createEnergizingPlaylist({ variables: { artistId: selectedArtist.id } })
    if ((result.data?.createEnergizingPlaylist) != null) {
      setPlaylistEntries(result.data?.createEnergizingPlaylist)
    }
  }, [selectedArtist, createEnergizingPlaylist])

  const resultSelectedCallback = useCallback((value: TAutocompleteEntry) => {
    setSelectedArtist(value)
  }, [])

  const handleSavePlaylistSubmit = useCallback(async () => {
    const uris = playlistEntries.map(({ uri }) => uri)

    const accessToken = getLocalStorage(ELocalStorageItems.AccessToken)
    if (!accessToken) {
      dispatch({ type: 'ADD_MESSAGE', data: { message: 'You need to login first' } })
      navigate('/')
      return
    }
    const response = await savePlaylist({ variables: { uris, playlistTitle, accessToken } })
    if (response) {
      dispatch({ type: 'ADD_MESSAGE', data: { message: 'Success! Open Spotify https://open.spotify.com/playlist/' } })
    } else {
      dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to save playlist' } })
    }

    setPlaylistEntries([])
  }, [playlistEntries, dispatch, playlistTitle, savePlaylist, navigate])

  const content = useMemo(() => {
    if (!selectedArtist) {
      return (<Search label={'Artist'} resultSelectedCallback={resultSelectedCallback} />)
    }

    if (playlistEntries.length === 0) {
      return (
        <Box>
          <Typography variant="h2" gutterBottom>
            Selected Artist: {selectedArtist.name}
            <Button onClick={handleCreatePlaylistSubmit}>Create Energizing Playlist!</Button>
          </Typography>
        </Box>
      )
    }
    return (
      <>
        <TextField
          label="Title"
          type="title"
          value={playlistTitle}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPlaylistTitle(event.target.value)
          }}
        />
        <Button onClick={handleSavePlaylistSubmit}>Save it to your Spotify</Button>
        <Playlist playlistEntries={playlistEntries} />
      </>
    )
  }, [handleSavePlaylistSubmit, handleCreatePlaylistSubmit, playlistEntries, playlistTitle, resultSelectedCallback, selectedArtist])

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Progressively Energetic
      </Typography>
      {content}
    </Container>
  )
}

export default ProgressivelyEnergetic

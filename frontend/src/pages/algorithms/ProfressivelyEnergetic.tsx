import { gql, useLazyQuery } from '@apollo/client'
import { Box, Button, Container, Typography } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import TextField from '@mui/material/TextField'

import { Search, Playlist } from 'sharedComponents'
import { type TPlaylistEntry } from '../../sharedTypes'
import { ELocalStorageItems, getLocalStorage } from 'utilities'
import { context } from 'context'

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
  const [artistId, setArtistId] = useState('')
  const [createEnergizingPlaylist] = useLazyQuery<{ createEnergizingPlaylist: TPlaylistEntry[] }>(CREATE_ENERGIZING_PLAYLIST_QUERY)
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])
  const { dispatch } = useContext(context)

  const handleCreatePlaylistSubmit = useCallback(async () => {
    setPlaylistEntries([])
    const result = await createEnergizingPlaylist({ variables: { artistId } })
    if ((result.data?.createEnergizingPlaylist) != null) {
      setPlaylistEntries(result.data?.createEnergizingPlaylist)
    }
  }, [artistId, createEnergizingPlaylist])

  const resultSelectedCallback = useCallback((value: string) => {
    setArtistId(value)
  }, [])

  const handleSavePlaylistSubmit = useCallback(async () => {
    const uris = playlistEntries.map(({ uri }) => uri)

    const accessToken = getLocalStorage(ELocalStorageItems.AccessToken)
    if (!accessToken) { // TODO - could warn sooner
      dispatch({ type: 'ADD_MESSAGE', data: { message: 'You need to login first' } })
      return
    }
    const response = await savePlaylist({ variables: { uris, playlistTitle, accessToken } })
    if (response) {
      dispatch({ type: 'ADD_MESSAGE', data: { message: 'Success! Open Spotify https://open.spotify.com/playlist/' } })
    } else {
      dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to save playlist' } })
    }

    setPlaylistEntries([])
  }, [dispatch, playlistEntries, dispatch, playlistTitle, savePlaylist])

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Progressively Energetic
      </Typography>
      <Button onClick={handleCreatePlaylistSubmit}>Create Energizing Playlist!</Button>
      <Box>
        <TextField
          label="Title"
          type="title"
          value={playlistTitle}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPlaylistTitle(event.target.value)
          }}
        />
        <Button onClick={handleSavePlaylistSubmit}>Save it to your Spotify</Button>

      </Box>
      <Search resultSelectedCallback={resultSelectedCallback} />
      <Playlist playlistEntries={playlistEntries} />

    </Container>
  )
}

export default ProgressivelyEnergetic

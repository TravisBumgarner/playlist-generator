import { gql, useLazyQuery } from '@apollo/client'
import { Button, Container, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'
import TextField from '@mui/material/TextField'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TAutocompleteEntry, type TPlaylistEntry } from '../../sharedTypes'
import { ELocalStorageItems, getLocalStorage } from 'utilities'
import { context } from 'context'
import { useNavigate } from 'react-router'
import { useAlgorithmRoute } from '../../algorithms'

const CREATE_ENERGIZING_PLAYLIST_QUERY = gql`
query createEnergizingPlaylist($artistId: String!) {
    createEnergizingPlaylist(artistId: $artistId) {
        name
        id
        album {
          href
          name
        }
        artists {
          href
          name
        }
        uri
        image
        href
    }
  }
`

const SAVE_PLAYLIST_QUERY = gql`
query savePlaylist($accessToken: String! $playlistTitle: String! $uris: [String]!) {
    savePlaylist(accessToken: $accessToken, playlistTitle: $playlistTitle, uris: $uris) 
  }
`

const ProgressivelyEnergetic = () => {
  const [savePlaylist] = useLazyQuery<{ savePlaylist: string }>(SAVE_PLAYLIST_QUERY)
  const [playlistTitle, setPlaylistTitle] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createEnergizingPlaylist, { loading, called, data }] = useLazyQuery<{ createEnergizingPlaylist: TPlaylistEntry[] }>(CREATE_ENERGIZING_PLAYLIST_QUERY)
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])
  const { dispatch } = useContext(context)
  const [isSavingPlaylist, setIsSavingPlaylist] = useState(false)
  const navigate = useNavigate()
  const algorithm = useAlgorithmRoute()

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)
    setPlaylistEntries([])
    setPlaylistTitle(`Progressively Energetic with ${value.name}`)

    const result = await createEnergizingPlaylist({ variables: { artistId: value.id } })
    if ((result.data?.createEnergizingPlaylist) != null) {
      setPlaylistEntries(result.data?.createEnergizingPlaylist)
    }
  }, [createEnergizingPlaylist])

  const handleSavePlaylistSubmit = useCallback(async () => {
    setIsSavingPlaylist(true)
    const uris = playlistEntries.map(({ uri }) => uri)

    const accessToken = getLocalStorage(ELocalStorageItems.AccessToken)
    if (!accessToken) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'You need to login first', severity: 'info' } })
      navigate('/')
      return
    }
    const response = await savePlaylist({ variables: { uris, playlistTitle, accessToken } })
    console.log(response)
    if (response.data) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'Playlist created!', url: response.data.savePlaylist, severity: 'success' } })
      setPlaylistEntries([])
    } else {
      dispatch({ type: 'ADD_ALERT', data: { text: 'Failed to save playlist', severity: 'error' } })
    }

    setIsSavingPlaylist(false)
  }, [playlistEntries, dispatch, playlistTitle, savePlaylist, navigate])

  const content = useMemo(() => {
    if (!selectedArtist) {
      return (<Search label={'Artist'} resultSelectedCallback={resultSelectedCallback} />)
    }

    if (called && loading) {
      return (
        <>
          <Loading />
        </>
      )
    }

    if (!data) {
      return (
        <>
          <Typography variant="h2" gutterBottom>
            Fetching
          </Typography>
        </>
      )
    }
    return (
      <>
        <TextField
          fullWidth
          label="Title this Playlist"
          type="title"
          margin="normal"
          value={playlistTitle}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPlaylistTitle(event.target.value)
          }}
          css={{ marginBottom: '1rem' }}
        />
        <Button
          css={{ margin: '1rem 0' }}
          variant='contained' disabled={isSavingPlaylist} fullWidth onClick={handleSavePlaylistSubmit}>Save it to your Spotify</Button>
        {
          isSavingPlaylist
            ? <Loading />
            : <Playlist playlistEntries={playlistEntries} />
        }

      </>
    )
  }, [handleSavePlaylistSubmit, called, data, loading, isSavingPlaylist, playlistEntries, playlistTitle, resultSelectedCallback, selectedArtist])

  return (
    <Container sx={{ marginTop: '2rem', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h2" gutterBottom>{algorithm.title}</Typography>
      <Typography variant="body1" gutterBottom>{algorithm.description}</Typography>
      <Container sx={{ maxWidth: '500px', width: '500px' }}>
        {content}
      </Container>
    </Container >
  )
}

export default ProgressivelyEnergetic

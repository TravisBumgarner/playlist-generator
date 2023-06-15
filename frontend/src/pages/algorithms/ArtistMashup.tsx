import { gql, useLazyQuery } from '@apollo/client'
import { Avatar, Button, Container, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TAutocompleteEntry, type TPlaylistEntry } from '../../sharedTypes'
import { context } from 'context'

const CREATE_FROM_ARTIST_MASHUP_PLAYLIST = gql`
query createArtistMashupPlaylist($artistIds: [String]!, $market: String!) {
  createArtistMashupPlaylist(artistIds: $artistIds, market: $market) {
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

const ArtistsList = ({ selectedArtists }: { selectedArtists: TAutocompleteEntry[] }) => {
  const ListItems = selectedArtists.map(({ name, image, id }) => {
    return (
      <ListItem key={id}>
        <ListItemAvatar>
          <Avatar variant="square" alt={name} src={image} />
        </ListItemAvatar>
        <ListItemText primary={name} />
      </ListItem >
    )
  })

  return (
    <List>
      {ListItems}
    </List>
  )
}

interface ArtistMashupProps { title: string, description: string }
const ArtistMashup = ({ title, description }: ArtistMashupProps) => {
  const { state, dispatch } = useContext(context)
  const [selectedArtists, setSelectedArtists] = useState<TAutocompleteEntry[]>([])
  const [createArtistMashup] = useLazyQuery<{ createArtistMashupPlaylist: TPlaylistEntry[] }>(CREATE_FROM_ARTIST_MASHUP_PLAYLIST, { fetchPolicy: 'network-only' })
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resetState = useCallback(() => {
    setSelectedArtists([])
    setPlaylistEntries([])
  }, [])

  const onCreateCallback = useCallback(() => {
    resetState()
  }, [resetState])

  const addAnotherArtist = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtists(prev => ([...prev, value]))
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    if (!selectedArtists) return

    if (!state.user) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'User is not logged in', severity: 'error' } })
      return
    }

    const result = await createArtistMashup({ variables: { artistIds: selectedArtists.map(({ id }) => id), market: state.user.market } })
    if ((result.data?.createArtistMashupPlaylist) != null) {
      setPlaylistEntries(result.data?.createArtistMashupPlaylist)
    }

    setIsLoading(false)
  }, [selectedArtists, createArtistMashup, dispatch, state.user])

  const content = useMemo(() => {
    if (selectedArtists === null || playlistEntries === null) {
      return (
        <>
          <ArtistsList selectedArtists={selectedArtists} />
          <Search label={'Add Artist'} resultSelectedCallback={addAnotherArtist} />
          <Button disabled={selectedArtists === null} onClick={handleSubmit}>Submit</Button>
        </>
      )
    }

    if (isLoading) {
      return (
        <>
          <Loading />
        </>
      )
    }

    if (playlistEntries && playlistEntries.length === 0) {
      return (
        <Typography>
          No results found
        </Typography>
      )
    }

    return (
      <Playlist onCreateCallback={onCreateCallback} initialTitle={`Artist Mashup with ${selectedArtists.map(({ name }) => name).join(', ')}`} playlistEntries={playlistEntries} />
    )
  }, [playlistEntries, handleSubmit, addAnotherArtist, selectedArtists, onCreateCallback, isLoading])

  return (
    <Container sx={{ marginTop: '2rem', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h2" gutterBottom>{title}</Typography>
      <Typography variant="body1" gutterBottom>{description}</Typography>
      <Container sx={{ maxWidth: '500px', width: '500px' }}>
        {content}
      </Container>
    </Container >
  )
}

export default ArtistMashup

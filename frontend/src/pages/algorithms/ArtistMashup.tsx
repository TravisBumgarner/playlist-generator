import { gql, useLazyQuery } from '@apollo/client'
import { Avatar, Button, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TArtistMashup, type TAutocompleteEntry, type TPlaylistEntry } from 'utilties'
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

interface ArtistListItemProps {
  selectedArtist: TAutocompleteEntry
  removeArtist: (artistId: string) => void
}

const ArtistsListItem = ({ selectedArtist: { name, image, id }, removeArtist }: ArtistListItemProps) => {
  const handleClick = useCallback(() => {
    removeArtist(id)
  }, [id, removeArtist])

  return (
    <ListItem
      key={id}
      secondaryAction={
        <IconButton onClick={handleClick} aria-label="close">
          <CloseIcon />
        </IconButton>
      }>
      <ListItemAvatar>
        <Avatar variant="square" alt={name} src={image} />
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem >
  )
}

interface ArtistMashupProps { title: string, description: string }
const ArtistMashup = ({ title, description }: ArtistMashupProps) => {
  const { state, dispatch } = useContext(context)
  const [selectedArtists, setSelectedArtists] = useState<TAutocompleteEntry[]>([])
  const [createArtistMashup] = useLazyQuery<{ createArtistMashupPlaylist: TArtistMashup['Response'] }, TArtistMashup['Request']>(CREATE_FROM_ARTIST_MASHUP_PLAYLIST, { fetchPolicy: 'network-only' })
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const removeArtist = useCallback((artistId: string) => {
    setSelectedArtists(prev => prev.filter(({ id }) => id !== artistId))
  }, [])

  const resetState = useCallback(() => {
    setSelectedArtists([])
    setPlaylistEntries([])
  }, [])

  const resetStateCallback = useCallback(() => {
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
    const ListItems = selectedArtists.map((artist) => <ArtistsListItem key={artist.id} selectedArtist={artist} removeArtist={removeArtist} />)

    if (selectedArtists === null || playlistEntries === null) {
      return (
        <>
          <Search label={'Add Artist'} resultSelectedCallback={addAnotherArtist} />
          <List>
            {ListItems}
          </List>
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
      <Playlist resetStateCallback={resetStateCallback} initialTitle={`Artist Mashup with ${selectedArtists.map(({ name }) => name).join(', ')}`} playlistEntries={playlistEntries} />
    )
  }, [playlistEntries, handleSubmit, addAnotherArtist, selectedArtists, resetStateCallback, isLoading, removeArtist])

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

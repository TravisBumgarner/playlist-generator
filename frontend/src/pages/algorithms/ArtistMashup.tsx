import { useLazyQuery } from '@apollo/client'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import { Search } from 'sharedComponents'
import { type TArtistMashup, type TAutocompleteEntry, type TSharedRequestParams } from 'playlist-generator-utilities'
import AlgorithmWrapper from './AlgorithmWrapper'
import { CREATE_ARTIST_MASHUP_PLAYLIST } from './queries'

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
  const [selectedArtists, setSelectedArtists] = useState<TAutocompleteEntry[]>([])
  const [createArtistMashup] = useLazyQuery<{ createArtistMashupPlaylist: TArtistMashup['Response'] }, TArtistMashup['Request']>(CREATE_ARTIST_MASHUP_PLAYLIST, { fetchPolicy: 'network-only' })

  const removeArtist = useCallback((artistId: string) => {
    setSelectedArtists(prev => prev.filter(({ id }) => id !== artistId))
  }, [])

  const resetState = useCallback(() => {
    setSelectedArtists([])
  }, [])

  const addAnotherArtist = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtists(prev => ([...prev, value]))
  }, [])

  const apiCall = useCallback(async (shared: TSharedRequestParams) => {
    const result = await createArtistMashup({ variables: { artistIds: selectedArtists.map(({ id }) => id), ...shared } })
    return result.data?.createArtistMashupPlaylist
  }, [selectedArtists, createArtistMashup])

  const ListItems = useMemo(() => {
    return selectedArtists.map((artist) => <ArtistsListItem key={artist.id} selectedArtist={artist} removeArtist={removeArtist} />)
  }, [selectedArtists, removeArtist])

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      searchParams={
        <>
          <Search label={'Add an Artist'} resultSelectedCallback={addAnotherArtist} />
          <List>
            {ListItems}
          </List>
        </>
      }
      searchDisabled={selectedArtists.length < 2}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Artist Mashup with ${selectedArtists.map(({ name }) => name).join(', ')}`}
    >
    </AlgorithmWrapper >
  )
}

export default ArtistMashup

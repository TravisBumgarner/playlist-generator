import { gql, useLazyQuery } from '@apollo/client'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import { Search } from 'sharedComponents'
import { type TArtistMashup, type TAutocompleteEntry } from 'playlist-generator-utilities'
import { context } from 'context'
import AlgorithmWrapper from './AlgorithmWrapper'

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
  const { state } = useContext(context)
  const [selectedArtists, setSelectedArtists] = useState<TAutocompleteEntry[]>([])
  const [createArtistMashup] = useLazyQuery<{ createArtistMashupPlaylist: TArtistMashup['Response'] }, TArtistMashup['Request']>(CREATE_FROM_ARTIST_MASHUP_PLAYLIST, { fetchPolicy: 'network-only' })

  const removeArtist = useCallback((artistId: string) => {
    setSelectedArtists(prev => prev.filter(({ id }) => id !== artistId))
  }, [])

  const resetState = useCallback(() => {
    setSelectedArtists([])
  }, [])

  const addAnotherArtist = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtists(prev => ([...prev, value]))
  }, [])

  const apiCall = useCallback(async () => {
    const result = await createArtistMashup({ variables: { artistIds: selectedArtists.map(({ id }) => id), market: state.user!.market } })
    return result.data?.createArtistMashupPlaylist
  }, [selectedArtists, createArtistMashup, state.user])

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
    >
    </AlgorithmWrapper >
  )
}

export default ArtistMashup

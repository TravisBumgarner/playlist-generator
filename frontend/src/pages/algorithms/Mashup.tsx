import { useLazyQuery } from '@apollo/client'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import { Search } from 'sharedComponents'
import { SearchType, type TAlgorithmMashup, type TAutocompleteEntry, type TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import AlgorithmWrapper from './AlgorithmWrapper'
import { MASHUP } from './queries'

interface ArtistListItemProps {
  autocompleteEntry: TAutocompleteEntry
  removeAutocompleteEntry: (artistId: string) => void
}

const AutocompleteEntryListItem = ({ autocompleteEntry: { name, image, id }, removeAutocompleteEntry }: ArtistListItemProps) => {
  const handleClick = useCallback(() => {
    removeAutocompleteEntry(id)
  }, [id, removeAutocompleteEntry])

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

interface MashupProps { title: string, description: string }
const Mashup = ({ title, description }: MashupProps) => {
  const [selectedAutocompleteEntries, setSelectedAutocompleteEntries] = useState<TAutocompleteEntry[]>([])
  const [createPlaylistMashup] = useLazyQuery<{ playlistMashup: TAlgorithmMashup['Response'] }, TAlgorithmMashup['Request']>(MASHUP, { fetchPolicy: 'network-only' })

  const removeAutocompleteEntry = useCallback((entryId: string) => {
    setSelectedAutocompleteEntries(prev => prev.filter(({ id }) => id !== entryId))
  }, [])

  const resetState = useCallback(() => {
    setSelectedAutocompleteEntries([])
  }, [])

  const addAnotherAutocompleteEntry = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedAutocompleteEntries(prev => ([...prev, value]))
  }, [])

  const apiCall = useCallback(async (shared: TSharedAlgorithmRequestParams) => {
    const artistIds = selectedAutocompleteEntries.filter(({ type }) => type === SearchType.Artist).map(({ id }) => id)
    const trackIds = selectedAutocompleteEntries.filter(({ type }) => type === SearchType.Track).map(({ id }) => id)

    const result = await createPlaylistMashup({ variables: { artistIds, trackIds, ...shared } })
    return result.data?.playlistMashup
  }, [selectedAutocompleteEntries, createPlaylistMashup])

  const ListItems = useMemo(() => {
    return selectedAutocompleteEntries.map((entry) => <AutocompleteEntryListItem key={entry.id} autocompleteEntry={entry} removeAutocompleteEntry={removeAutocompleteEntry} />)
  }, [selectedAutocompleteEntries, removeAutocompleteEntry])

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      initialPlaylistDescription={description}
      searchParams={
        <>
          <Search resultSelectedCallback={addAnotherAutocompleteEntry} />
          <List>
            {ListItems}
          </List>
        </>
      }
      searchDisabled={selectedAutocompleteEntries.length < 2}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Artist Mashup with ${selectedAutocompleteEntries.map(({ name }) => name).join(', ')}`}
    >
    </AlgorithmWrapper >
  )
}

export default Mashup

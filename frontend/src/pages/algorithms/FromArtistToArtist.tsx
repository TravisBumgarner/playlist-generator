import { gql, useLazyQuery } from '@apollo/client'
import { Button, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TFromArtistToArtist, type TAutocompleteEntry, type TPlaylistEntry } from 'playlist-generator-utilities'
import { context } from 'context'
import AlgorithmWrapper from './AlgorithmWrapper'

const CREATE_FROM_ARTIST_TO_ARTIST_PLAYLIST = gql`
query createFromArtistToArtistPlaylist($artistIdStart: String!, $artistIdEnd: String!, $market: String!) {
  createFromArtistToArtistPlaylist(artistIdStart: $artistIdStart, artistIdEnd: $artistIdEnd, market: $market) {
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

interface FromArtistToArtistParams { title: string, description: string }
const FromArtistToArtist = ({ title, description }: FromArtistToArtistParams) => {
  const { state, dispatch } = useContext(context)
  const [selectedArtistStart, setSelectedArtistStart] = useState<{ id: string, name: string } | null>(null)
  const [selectedArtistEnd, setSelectedArtistEnd] = useState<{ id: string, name: string } | null>(null)
  const [createFromArtistToArtist] = useLazyQuery<{ createFromArtistToArtistPlaylist: TFromArtistToArtist['Response'] }, TFromArtistToArtist['Request']>(CREATE_FROM_ARTIST_TO_ARTIST_PLAYLIST, { fetchPolicy: 'network-only' })
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resetState = useCallback(() => {
    setSelectedArtistStart(null)
    setSelectedArtistEnd(null)
    setPlaylistEntries(null)
  }, [])

  const resetStateCallback = useCallback(() => {
    resetState()
  }, [resetState])

  const resultSelectedCallbackStart = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistStart(value)
  }, [])

  const resultSelectedCallbackEnd = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistEnd(value)
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    if (!selectedArtistStart || !selectedArtistEnd) return

    if (!state.user) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'User is not logged in', severity: 'error' } })
      return
    }

    const result = await createFromArtistToArtist({ variables: { artistIdStart: selectedArtistStart.id, artistIdEnd: selectedArtistEnd.id, market: state.user.market } })
    if ((result.data?.createFromArtistToArtistPlaylist) != null) {
      setPlaylistEntries(result.data?.createFromArtistToArtistPlaylist)
    }

    setIsLoading(false)
  }, [selectedArtistStart, selectedArtistEnd, createFromArtistToArtist, dispatch, state.user])

  const content = useMemo(() => {
    if (selectedArtistStart === null || selectedArtistEnd === null || playlistEntries === null) {
      return (
        <>
          <Search label={'Starting Artist'} resultSelectedCallback={resultSelectedCallbackStart} />
          <Search label={'Ending Artist'} resultSelectedCallback={resultSelectedCallbackEnd} />
          <Button fullWidth variant='contained' disabled={selectedArtistStart === null && selectedArtistEnd === null} onClick={handleSubmit}>Submit</Button>
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
      <Playlist resetStateCallback={resetStateCallback} initialTitle={`From ${selectedArtistStart.name} to ${selectedArtistEnd.name}`} playlistEntries={playlistEntries} />
    )
  }, [playlistEntries, handleSubmit, resultSelectedCallbackStart, resultSelectedCallbackEnd, selectedArtistStart, selectedArtistEnd, resetStateCallback, isLoading])

  return (
    <AlgorithmWrapper title={title} description={description}>
      {content}
    </AlgorithmWrapper>
  )
}

export default FromArtistToArtist

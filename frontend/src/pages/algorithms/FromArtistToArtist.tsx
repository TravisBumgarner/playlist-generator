import { useLazyQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { Search } from 'sharedComponents'
import { type TFromArtistToArtist, type TAutocompleteEntry, type TSharedRequestParams } from 'playlist-generator-utilities'
import AlgorithmWrapper from './AlgorithmWrapper'
import { CREATE_FROM_ARTIST_TO_ARTIST_PLAYLIST } from './queries'

interface FromArtistToArtistParams { title: string, description: string }
const FromArtistToArtist = ({ title, description }: FromArtistToArtistParams) => {
  const [selectedArtistStart, setSelectedArtistStart] = useState<{ id: string, name: string } | null>(null)
  const [selectedArtistEnd, setSelectedArtistEnd] = useState<{ id: string, name: string } | null>(null)
  const [createFromArtistToArtist] = useLazyQuery<{ createFromArtistToArtistPlaylist: TFromArtistToArtist['Response'] }, TFromArtistToArtist['Request']>(CREATE_FROM_ARTIST_TO_ARTIST_PLAYLIST, { fetchPolicy: 'network-only' })

  const resetState = useCallback(() => {
    setSelectedArtistStart(null)
    setSelectedArtistEnd(null)
  }, [])

  const resultSelectedCallbackStart = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistStart(value)
  }, [])

  const resultSelectedCallbackEnd = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistEnd(value)
  }, [])

  const apiCall = useCallback(async (shared: TSharedRequestParams) => {
    const result = await createFromArtistToArtist({ variables: { artistIdStart: selectedArtistStart!.id, artistIdEnd: selectedArtistEnd!.id, ...shared } })
    if ((result.data?.createFromArtistToArtistPlaylist) != null) {
      return result.data?.createFromArtistToArtistPlaylist
    }
  }, [selectedArtistStart, selectedArtistEnd, createFromArtistToArtist])

  return (
    <AlgorithmWrapper
      title={title}
      initialPlaylistDescription={description}
      description={description}
      searchParams={
        <>
          <Search label={'Starting Artist'} resultSelectedCallback={resultSelectedCallbackStart} />
          <Search label={'Ending Artist'} resultSelectedCallback={resultSelectedCallbackEnd} />
        </>
      }
      searchDisabled={selectedArtistStart === null || selectedArtistEnd === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`From ${selectedArtistStart?.name} to ${selectedArtistEnd?.name}`}
    >
    </AlgorithmWrapper >
  )
}

export default FromArtistToArtist

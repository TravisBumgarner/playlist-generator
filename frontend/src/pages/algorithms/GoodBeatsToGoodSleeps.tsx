import { useLazyQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { Search } from 'sharedComponents'
import { type TGoodBeatsToGoodSleeps, type TAutocompleteEntry, type TSharedRequestParams } from 'playlist-generator-utilities'
import AlgorithmWrapper from './AlgorithmWrapper'
import { CREATE_GOOD_BEATS_TO_GOOD_SLEEPS_QUERY } from './queries'

interface GoodBeatsToGoodSleepsProps { title: string, description: string }
const GoodBetsToGoodSleeps = ({ title, description }: GoodBeatsToGoodSleepsProps) => {
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createGoodBeatsToGoodSleepsPlaylist] = useLazyQuery<{ createGoodBeatsToGoodSleepsPlaylist: TGoodBeatsToGoodSleeps['Response'] }, TGoodBeatsToGoodSleeps['Request']>(CREATE_GOOD_BEATS_TO_GOOD_SLEEPS_QUERY, { fetchPolicy: 'network-only' })

  const resetState = useCallback(() => {
    setSelectedArtist(null)
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)
  }, [])

  const apiCall = useCallback(async (shared: TSharedRequestParams) => {
    const result = await createGoodBeatsToGoodSleepsPlaylist({ variables: { artistId: selectedArtist!.id, ...shared } })
    return result.data?.createGoodBeatsToGoodSleepsPlaylist
  }, [selectedArtist, createGoodBeatsToGoodSleepsPlaylist])

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      initialPlaylistDescription={description}
      searchParams={
        <Search label={'Artist'} resultSelectedCallback={resultSelectedCallback} />
      }
      searchDisabled={selectedArtist === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Good Beats to Good Sleeps with ${selectedArtist?.name}`}
    >
    </AlgorithmWrapper >
  )
}

export default GoodBetsToGoodSleeps

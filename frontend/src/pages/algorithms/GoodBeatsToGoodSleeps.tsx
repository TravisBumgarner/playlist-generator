import { useLazyQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { Search } from 'sharedComponents'
import { type TAlgorithmGoodBeatsToGoodSleeps, type TAutocompleteEntry, type TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import AlgorithmWrapper from './AlgorithmWrapper'
import { GOOD_BEATS_TO_GOOD_SLEEPS } from './queries'

interface GoodBeatsToGoodSleepsProps { title: string, description: string }
const GoodBetsToGoodSleeps = ({ title, description }: GoodBeatsToGoodSleepsProps) => {
  const [selectedEntry, setSelectedEntry] = useState<TAutocompleteEntry | null>(null)
  const [createPlaylistGoodBeatsToGoodSleeps] = useLazyQuery<{ createPlaylistGoodBeatsToGoodSleeps: TAlgorithmGoodBeatsToGoodSleeps['Response'] }, TAlgorithmGoodBeatsToGoodSleeps['Request']>(GOOD_BEATS_TO_GOOD_SLEEPS, { fetchPolicy: 'network-only' })

  const resetState = useCallback(() => {
    setSelectedEntry(null)
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedEntry(value)
  }, [])

  const apiCall = useCallback(async (shared: TSharedAlgorithmRequestParams) => {
    const result = await createPlaylistGoodBeatsToGoodSleeps({ variables: { selectedId: selectedEntry!.id, selectedType: selectedEntry!.type, ...shared } })
    return result.data?.createPlaylistGoodBeatsToGoodSleeps
  }, [selectedEntry, createPlaylistGoodBeatsToGoodSleeps])

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      initialPlaylistDescription={description}
      searchParams={
        <Search resultSelectedCallback={resultSelectedCallback} />
      }
      searchDisabled={selectedEntry === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Good Beats to Good Sleeps with ${selectedEntry?.name}`}
    >
    </AlgorithmWrapper >
  )
}

export default GoodBetsToGoodSleeps

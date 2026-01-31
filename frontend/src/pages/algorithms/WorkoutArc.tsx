import { Search } from 'sharedComponents'

import type { TAutocompleteEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { useCallback, useState } from 'react'
import { playlistWorkoutArc } from '../../api'
import AlgorithmWrapper from './AlgorithmWrapper'

interface WorkoutArcProps {
  title: string
  description: string
}
const WorkoutArc = ({ title, description }: WorkoutArcProps) => {
  const [selectedEntry, setSelectedEntry] = useState<TAutocompleteEntry | null>(null)

  const resetState = useCallback(() => {
    setSelectedEntry(null)
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedEntry(value)
  }, [])

  const apiCall = useCallback(
    async (shared: TSharedAlgorithmRequestParams) => {
      const result = await playlistWorkoutArc({
        selectedId: selectedEntry!.id,
        selectedType: selectedEntry!.type,
        ...shared,
      })
      return result.success ? result.data : undefined
    },
    [selectedEntry],
  )

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      initialPlaylistDescription={description}
      searchParams={<Search resultSelectedCallback={resultSelectedCallback} />}
      searchDisabled={selectedEntry === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Workout Arc with ${selectedEntry?.name}`}
    />
  )
}

export default WorkoutArc

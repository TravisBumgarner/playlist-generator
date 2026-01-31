import { Search } from 'sharedComponents'
import { InputLabel, Slider } from '@mui/material'

import type { TAutocompleteEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { useCallback, useState } from 'react'
import { playlistDiscoveryDial } from '../../api'
import AlgorithmWrapper from './AlgorithmWrapper'

interface DiscoveryDialProps {
  title: string
  description: string
}
const DiscoveryDial = ({ title, description }: DiscoveryDialProps) => {
  const [selectedEntry, setSelectedEntry] = useState<TAutocompleteEntry | null>(null)
  const [adventurousness, setAdventurousness] = useState(0.5)

  const resetState = useCallback(() => {
    setSelectedEntry(null)
    setAdventurousness(0.5)
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedEntry(value)
  }, [])

  const apiCall = useCallback(
    async (shared: TSharedAlgorithmRequestParams) => {
      const result = await playlistDiscoveryDial({
        selectedId: selectedEntry!.id,
        selectedType: selectedEntry!.type,
        adventurousness,
        ...shared,
      })
      return result.success ? result.data : undefined
    },
    [selectedEntry, adventurousness],
  )

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      initialPlaylistDescription={description}
      searchParams={
        <>
          <Search resultSelectedCallback={resultSelectedCallback} />
          <div>
            <InputLabel>Adventurousness</InputLabel>
            <Slider
              value={adventurousness}
              onChange={(_e, value) => setAdventurousness(value as number)}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </div>
        </>
      }
      searchDisabled={selectedEntry === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Discovery Dial with ${selectedEntry?.name}`}
    />
  )
}

export default DiscoveryDial

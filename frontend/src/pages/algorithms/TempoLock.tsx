import { Search } from 'sharedComponents'
import { InputLabel, TextField } from '@mui/material'

import type { TAutocompleteEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { useCallback, useState } from 'react'
import { playlistTempoLock } from '../../api'
import AlgorithmWrapper from './AlgorithmWrapper'

interface TempoLockProps {
  title: string
  description: string
}
const TempoLock = ({ title, description }: TempoLockProps) => {
  const [selectedEntry, setSelectedEntry] = useState<TAutocompleteEntry | null>(null)
  const [bpm, setBpm] = useState(120)

  const resetState = useCallback(() => {
    setSelectedEntry(null)
    setBpm(120)
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedEntry(value)
  }, [])

  const apiCall = useCallback(
    async (shared: TSharedAlgorithmRequestParams) => {
      const result = await playlistTempoLock({
        selectedId: selectedEntry!.id,
        selectedType: selectedEntry!.type,
        bpm,
        ...shared,
      })
      return result.success ? result.data : undefined
    },
    [selectedEntry, bpm],
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
            <InputLabel>BPM</InputLabel>
            <TextField
              type="number"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value, 10) || 120)}
              size="small"
              inputProps={{ min: 40, max: 220 }}
            />
          </div>
        </>
      }
      searchDisabled={selectedEntry === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Tempo Lock ${bpm} BPM with ${selectedEntry?.name}`}
    />
  )
}

export default TempoLock

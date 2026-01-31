import { Search } from 'sharedComponents'
import { InputLabel, MenuItem, Select } from '@mui/material'

import type { TAutocompleteEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { useCallback, useState } from 'react'
import { playlistTimeMachine } from '../../api'
import AlgorithmWrapper from './AlgorithmWrapper'

const ERAS = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']

interface TimeMachineProps {
  title: string
  description: string
}
const TimeMachine = ({ title, description }: TimeMachineProps) => {
  const [selectedEntry, setSelectedEntry] = useState<TAutocompleteEntry | null>(null)
  const [era, setEra] = useState('2000s')

  const resetState = useCallback(() => {
    setSelectedEntry(null)
    setEra('2000s')
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedEntry(value)
  }, [])

  const apiCall = useCallback(
    async (shared: TSharedAlgorithmRequestParams) => {
      const result = await playlistTimeMachine({
        selectedId: selectedEntry!.id,
        selectedType: selectedEntry!.type,
        era,
        ...shared,
      })
      return result.success ? result.data : undefined
    },
    [selectedEntry, era],
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
            <InputLabel>Era</InputLabel>
            <Select value={era} onChange={(e) => setEra(e.target.value)} size="small">
              {ERAS.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </div>
        </>
      }
      searchDisabled={selectedEntry === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Time Machine: ${era} with ${selectedEntry?.name}`}
    />
  )
}

export default TimeMachine

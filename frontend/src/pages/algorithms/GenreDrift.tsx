import { Search } from 'sharedComponents'

import type { TAutocompleteEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { useCallback, useState } from 'react'
import { playlistGenreDrift } from '../../api'
import AlgorithmWrapper from './AlgorithmWrapper'

interface GenreDriftProps {
  title: string
  description: string
}
const GenreDrift = ({ title, description }: GenreDriftProps) => {
  const [startWith, setStartWith] = useState<TAutocompleteEntry | null>(null)
  const [endWith, setEndWith] = useState<TAutocompleteEntry | null>(null)

  const resetState = useCallback(() => {
    setStartWith(null)
    setEndWith(null)
  }, [])

  const resultSelectedCallbackStart = useCallback(async (value: TAutocompleteEntry) => {
    setStartWith(value)
  }, [])

  const resultSelectedCallbackEnd = useCallback(async (value: TAutocompleteEntry) => {
    setEndWith(value)
  }, [])

  const apiCall = useCallback(
    async (shared: TSharedAlgorithmRequestParams) => {
      const result = await playlistGenreDrift({
        startWithId: startWith!.id,
        startWithType: startWith!.type,
        endWithId: endWith!.id,
        endWithType: endWith!.type,
        ...shared,
      })
      return result.success ? result.data : undefined
    },
    [startWith, endWith],
  )

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      initialPlaylistDescription={description}
      searchParams={
        <>
          <Search resultSelectedCallback={resultSelectedCallbackStart} />
          <Search resultSelectedCallback={resultSelectedCallbackEnd} />
        </>
      }
      searchDisabled={startWith === null || endWith === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Genre Drift from ${startWith?.name} to ${endWith?.name}`}
    />
  )
}

export default GenreDrift

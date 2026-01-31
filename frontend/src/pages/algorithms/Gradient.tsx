import { Search } from 'sharedComponents'

import type { TAutocompleteEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { useCallback, useState } from 'react'
import { playlistGradient } from '../../api'
import AlgorithmWrapper from './AlgorithmWrapper'

interface GradientParams {
  title: string
  description: string
}
const Gradient = ({ title, description }: GradientParams) => {
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
      const result = await playlistGradient({
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
      initialPlaylistDescription={description}
      description={description}
      searchParams={
        <>
          <Search resultSelectedCallback={resultSelectedCallbackStart} />
          <Search resultSelectedCallback={resultSelectedCallbackEnd} />
        </>
      }
      searchDisabled={startWith === null || endWith === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`From ${startWith?.name} to ${endWith?.name}`}
    ></AlgorithmWrapper>
  )
}

export default Gradient

import { Search } from 'sharedComponents'

import type { TAutocompleteEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { useCallback, useState } from 'react'
import { playlistContrastPairs } from '../../api'
import AlgorithmWrapper from './AlgorithmWrapper'

interface ContrastPairsProps {
  title: string
  description: string
}
const ContrastPairs = ({ title, description }: ContrastPairsProps) => {
  const [first, setFirst] = useState<TAutocompleteEntry | null>(null)
  const [second, setSecond] = useState<TAutocompleteEntry | null>(null)

  const resetState = useCallback(() => {
    setFirst(null)
    setSecond(null)
  }, [])

  const resultSelectedCallbackFirst = useCallback(async (value: TAutocompleteEntry) => {
    setFirst(value)
  }, [])

  const resultSelectedCallbackSecond = useCallback(async (value: TAutocompleteEntry) => {
    setSecond(value)
  }, [])

  const apiCall = useCallback(
    async (shared: TSharedAlgorithmRequestParams) => {
      const result = await playlistContrastPairs({
        firstId: first!.id,
        firstType: first!.type,
        secondId: second!.id,
        secondType: second!.type,
        ...shared,
      })
      return result.success ? result.data : undefined
    },
    [first, second],
  )

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      initialPlaylistDescription={description}
      searchParams={
        <>
          <Search resultSelectedCallback={resultSelectedCallbackFirst} />
          <Search resultSelectedCallback={resultSelectedCallbackSecond} />
        </>
      }
      searchDisabled={first === null || second === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Contrast Pairs: ${first?.name} vs ${second?.name}`}
    />
  )
}

export default ContrastPairs

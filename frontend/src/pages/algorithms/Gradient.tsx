import { useLazyQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { Search } from 'sharedComponents'
import { type TAlgorithmGradient, type TAutocompleteEntry, type TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import AlgorithmWrapper from './AlgorithmWrapper'
import { GRADIENT } from './queries'
import { Typography } from '@mui/material'

interface GradientParams { title: string, description: string }
const Gradient = ({ title, description }: GradientParams) => {
  const [startWith, setStartWith] = useState<TAutocompleteEntry | null>(null)
  const [endWith, setEndWith] = useState<TAutocompleteEntry | null>(null)
  const [createPlaylistGradient] = useLazyQuery<{ playlistGradient: TAlgorithmGradient['Response'] }, TAlgorithmGradient['Request']>(GRADIENT, { fetchPolicy: 'network-only' })

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

  const apiCall = useCallback(async (shared: TSharedAlgorithmRequestParams) => {
    const result = await createPlaylistGradient({
      variables: {
        startWithId: startWith!.id,
        startWithType: startWith!.type,
        endWithId: endWith!.id,
        endWithType: endWith!.type,
        ...shared
      }
    })
    if ((result.data?.playlistGradient) != null) {
      return result.data?.playlistGradient
    }
  }, [startWith, endWith, createPlaylistGradient])

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
    >
    </AlgorithmWrapper >
  )
}

export default Gradient

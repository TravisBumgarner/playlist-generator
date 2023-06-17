import { gql, useLazyQuery } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { Search } from 'sharedComponents'
import { type TGoodBeatsToGoodSleeps, type TAutocompleteEntry } from 'playlist-generator-utilities'
import { context } from 'context'
import AlgorithmWrapper from './AlgorithmWrapper'

const CREATE_GOOD_BEATS_TO_GOOD_SLEEPS_QUERY = gql`
query createGoodBeatsToGoodSleepsPlaylist($artistId: String!, $market: String!) {
  createGoodBeatsToGoodSleepsPlaylist(market: $market, artistId: $artistId) {
        name
        id
        album {
          href
          name
        }
        artists {
          href
          name
        }
        uri
        image
        href
    }
  }
`

interface GoodBeatsToGoodSleepsProps { title: string, description: string }
const GoodBetsToGoodSleeps = ({ title, description }: GoodBeatsToGoodSleepsProps) => {
  const { state } = useContext(context)
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createGoodBeatsToGoodSleepsPlaylist] = useLazyQuery<{ createGoodBeatsToGoodSleepsPlaylist: TGoodBeatsToGoodSleeps['Response'] }, TGoodBeatsToGoodSleeps['Request']>(CREATE_GOOD_BEATS_TO_GOOD_SLEEPS_QUERY, { fetchPolicy: 'network-only' })

  const resetState = useCallback(() => {
    setSelectedArtist(null)
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)
  }, [])

  const apiCall = useCallback(async () => {
    const result = await createGoodBeatsToGoodSleepsPlaylist({ variables: { artistId: selectedArtist!.id, market: state.user!.market } })
    return result.data?.createGoodBeatsToGoodSleepsPlaylist
  }, [selectedArtist, createGoodBeatsToGoodSleepsPlaylist, state.user])

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
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

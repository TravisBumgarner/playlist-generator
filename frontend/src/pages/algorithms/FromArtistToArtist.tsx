import { gql, useLazyQuery } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { Search } from 'sharedComponents'
import { type TFromArtistToArtist, type TAutocompleteEntry } from 'playlist-generator-utilities'
import { context } from 'context'
import AlgorithmWrapper from './AlgorithmWrapper'

const CREATE_FROM_ARTIST_TO_ARTIST_PLAYLIST = gql`
query createFromArtistToArtistPlaylist($artistIdStart: String!, $artistIdEnd: String!, $market: String!) {
  createFromArtistToArtistPlaylist(artistIdStart: $artistIdStart, artistIdEnd: $artistIdEnd, market: $market) {
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

interface FromArtistToArtistParams { title: string, description: string }
const FromArtistToArtist = ({ title, description }: FromArtistToArtistParams) => {
  const { state } = useContext(context)
  const [selectedArtistStart, setSelectedArtistStart] = useState<{ id: string, name: string } | null>(null)
  const [selectedArtistEnd, setSelectedArtistEnd] = useState<{ id: string, name: string } | null>(null)
  const [createFromArtistToArtist] = useLazyQuery<{ createFromArtistToArtistPlaylist: TFromArtistToArtist['Response'] }, TFromArtistToArtist['Request']>(CREATE_FROM_ARTIST_TO_ARTIST_PLAYLIST, { fetchPolicy: 'network-only' })

  const resetState = useCallback(() => {
    setSelectedArtistStart(null)
    setSelectedArtistEnd(null)
  }, [])

  const resultSelectedCallbackStart = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistStart(value)
  }, [])

  const resultSelectedCallbackEnd = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistEnd(value)
  }, [])

  const apiCall = useCallback(async () => {
    const result = await createFromArtistToArtist({ variables: { artistIdStart: selectedArtistStart!.id, artistIdEnd: selectedArtistEnd!.id, market: state.user!.market } })
    if ((result.data?.createFromArtistToArtistPlaylist) != null) {
      return result.data?.createFromArtistToArtistPlaylist
    }
  }, [selectedArtistStart, selectedArtistEnd, createFromArtistToArtist, state.user])

  return (
    <AlgorithmWrapper
      title={title}
      description={description}
      searchParams={
        <>
          <Search label={'Starting Artist'} resultSelectedCallback={resultSelectedCallbackStart} />
          <Search label={'Ending Artist'} resultSelectedCallback={resultSelectedCallbackEnd} />
        </>
      }
      searchDisabled={selectedArtistStart === null || selectedArtistEnd === null}
      apiCall={apiCall}
      resetStateCallback={resetState}
    >
    </AlgorithmWrapper >
  )
}

export default FromArtistToArtist

import { Button, Container, Typography } from '@mui/material'
import { Loading, Playlist } from 'sharedComponents'
import { useCallback, useContext, useMemo, useState } from 'react'

import { pageWrapperCSS } from 'theme'
import { type TPlaylistEntry } from 'playlist-generator-utilities'
import { context } from 'context'

interface AlgorithmWrapperProps {
  title: string
  description: string
  children: any
  searchParams?: JSX.Element
  searchDisabled?: boolean
  isSearching?: boolean
  apiCall: () => Promise<TPlaylistEntry[] | undefined>
  resetStateCallback: () => void
}

enum EStep {
  Inputting = 'Inputting',
  Searching = 'Searching',
  NoResults = 'NoResults',
  PreviewingPlaylist = 'PreviewingPlaylist',
}

const AlgorithmWrapper = ({ title, description, children, searchParams, searchDisabled, apiCall, resetStateCallback }: AlgorithmWrapperProps) => {
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])
  const [step, setStep] = useState<EStep>(EStep.Inputting)
  const { state, dispatch } = useContext(context)

  const resetState = useCallback(() => {
    setPlaylistEntries([])
    resetStateCallback()
  }, [resetStateCallback])

  const handleSearch = useCallback(async () => {
    setStep(EStep.Searching)

    if (!state.user) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'User is not logged in', severity: 'error' } })
      return
    }

    const results = await apiCall()

    setStep(results ? EStep.PreviewingPlaylist : EStep.NoResults)
  }, [dispatch, state.user, apiCall])

  const Content = useMemo(() => {
    switch (step) {
      case EStep.Inputting:
        return searchParams
      case EStep.NoResults:
        return <Typography>No results found</Typography>
      case EStep.PreviewingPlaylist:
        return <Playlist resetStateCallback={resetState} initialTitle={'BRB'} playlistEntries={playlistEntries} />
      case EStep.Searching:
        return <Loading />
    }
  }, [step, searchParams, playlistEntries, resetState])

  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>{title}</Typography>
      <Typography variant="body1" gutterBottom>{description}</Typography>
      <Container>
        {searchParams}
        <Button fullWidth variant='contained' disabled={searchDisabled} onClick={handleSearch}>Search</Button>
        {Content}
      </Container>
    </Container >
  )
}

export default AlgorithmWrapper

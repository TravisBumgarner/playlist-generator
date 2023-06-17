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
  searchParams: JSX.Element
  searchDisabled: boolean
  apiCall: () => Promise<TPlaylistEntry[] | undefined>
  resetStateCallback: () => void
}

enum EStep {
  Inputting = 'Inputting',
  Searching = 'Searching',
  PreviewingPlaylist = 'PreviewingPlaylist',
}

const AlgorithmWrapper = ({ title, description, children, searchParams, searchDisabled, apiCall, resetStateCallback }: AlgorithmWrapperProps) => {
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])
  const [step, setStep] = useState<EStep>(EStep.Inputting)
  const { state, dispatch } = useContext(context)

  const resetState = useCallback(() => {
    setStep(EStep.Inputting)
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
    setPlaylistEntries(results ?? [])
    setStep(EStep.PreviewingPlaylist)
  }, [dispatch, state.user, apiCall])

  const Content = useMemo(() => {
    switch (step) {
      case EStep.Inputting:
        return (
          <>
            {searchParams}
            <Button fullWidth variant='contained' disabled={searchDisabled} onClick={handleSearch}>Search</Button>
          </>

        )
      case EStep.PreviewingPlaylist:
        if (playlistEntries.length === 0) {
          return <Typography variant="body1" gutterBottom>No results found</Typography>
        }

        return <Playlist resetStateCallback={resetState} initialTitle={'BRB'} playlistEntries={playlistEntries} />
      case EStep.Searching:
        return <Loading />
    }
  }, [step, searchParams, playlistEntries, resetState, handleSearch, searchDisabled])

  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>{title}</Typography>
      <Typography variant="body1" gutterBottom>{description}</Typography>
      <Container>
        {Content}
      </Container>
    </Container >
  )
}

export default AlgorithmWrapper

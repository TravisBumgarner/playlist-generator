import { Loading, Playlist, TrackCount } from 'sharedComponents'
import { Box, Button, Typography } from '@mui/material'
import { context } from 'context'
import type { TPlaylistEntry, TSharedAlgorithmRequestParams } from 'playlist-generator-utilities'
import { type JSX, useCallback, useContext, useMemo, useState } from 'react'
import { MIN_TRACK_COUNT } from '../../sharedComponents/TrackCount'
import PageWrapper from '../../styles/shared/PageWrapper'

interface AlgorithmWrapperProps {
  title: string
  description: string
  children?: any
  searchParams: JSX.Element
  searchDisabled: boolean
  apiCall: (args: TSharedAlgorithmRequestParams) => Promise<TPlaylistEntry[] | undefined>
  resetStateCallback: () => void
  initialPlaylistTitle: string
  initialPlaylistDescription: string
}

enum EStep {
  Inputting = 'Inputting',
  Searching = 'Searching',
  PreviewingPlaylist = 'PreviewingPlaylist',
}

const AlgorithmWrapper = ({
  title,
  description,
  searchParams,
  searchDisabled,
  apiCall,
  resetStateCallback,
  initialPlaylistTitle,
  initialPlaylistDescription,
}: AlgorithmWrapperProps) => {
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])
  const [step, setStep] = useState<EStep>(EStep.Inputting)
  const [trackCount, setTrackCount] = useState<number>(MIN_TRACK_COUNT)
  const { state, dispatch } = useContext(context)

  const trackCountCallback = useCallback((trackCount: number) => {
    setTrackCount(trackCount)
  }, [])

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
    const results = await apiCall({ trackCount, market: state.user.market })
    setPlaylistEntries(results ?? [])
    setStep(EStep.PreviewingPlaylist)
  }, [dispatch, state.user, apiCall, trackCount])
  const Content = useMemo(() => {
    switch (step) {
      case EStep.Inputting:
        return (
          <>
            {searchParams}
            {/* Search Params shared by all algorithms go below */}
            <TrackCount trackCountCallback={trackCountCallback} />
            <Button fullWidth variant="contained" disabled={searchDisabled} onClick={handleSearch}>
              Search
            </Button>
          </>
        )
      case EStep.PreviewingPlaylist:
        if (playlistEntries.length === 0) {
          return (
            <>
              <Typography variant="body1" gutterBottom>
                No results found
              </Typography>
              <Button fullWidth variant="text" onClick={resetState}>
                Start Over
              </Button>
            </>
          )
        }

        return (
          <Playlist
            initialDescription={initialPlaylistDescription}
            resetStateCallback={resetState}
            initialTitle={initialPlaylistTitle}
            playlistEntries={playlistEntries}
          />
        )
      case EStep.Searching:
        return <Loading />
    }
  }, [
    step,
    searchParams,
    playlistEntries,
    resetState,
    handleSearch,
    searchDisabled,
    initialPlaylistTitle,
    initialPlaylistDescription,
    trackCountCallback,
  ])

  return (
    <PageWrapper>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      <Typography textAlign="center" variant="body1" gutterBottom>
        {description}
      </Typography>
      <Box sx={{ width: '100%' }}>{Content}</Box>
    </PageWrapper>
  )
}

export default AlgorithmWrapper

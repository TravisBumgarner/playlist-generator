import { Box, Typography } from '@mui/material'
import PageWrapper from '../styles/shared/PageWrapper'
import { SPACING } from '../styles/styleConsts'

const changelogData: Array<{ version: string; date: string; notes: string[] }> = [
  {
    version: '1.1.0',
    date: 'July 4, 2023',
    notes: [
      'Added descriptions for playlists.',
      'Added track search in addition to artist search.',
      'Renamed "From Artist to Artist" to "Gradient" and "Gradient" to "Mashup".',
    ],
  },
  {
    version: '1.0.0',
    date: 'June 22, 2023',
    notes: ['Artist Mashup, From Artist to Artist, Full Control, and Good Beats to Good Sleeps algorithms.'],
  },
]

const Changelog = () => {
  return (
    <PageWrapper width="small">
      <Typography variant="h2" gutterBottom>
        Changelog
      </Typography>
      {changelogData.map((entry) => (
        <Box key={entry.version} sx={{ width: '100%', marginBottom: SPACING.MEDIUM.PX }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            {entry.version} &middot; {entry.date}
          </Typography>
          {entry.notes.map((note, i) => (
            <Typography key={i} variant="body1">
              {note}
            </Typography>
          ))}
        </Box>
      ))}
    </PageWrapper>
  )
}

export default Changelog

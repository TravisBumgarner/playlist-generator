import { Description } from '@mui/icons-material'
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import { pageWrapperCSS } from 'theme'

const changelogData: Array<{ version: string; date: string; title: string; notes: string[] }> = [
  {
    version: '1.1.0',
    date: 'July 4, 2023',
    notes: [
      'Added descriptions for playlists.',
      'Added the ability to search for tracks in addition to artists.',
      'To accommodate the above change, the "From Artist to Artist" algorithm has been renamed to "Gradient", and the "Gradient" algorithm has been renamed to "Mashup".',
    ],
    title: 'Playlist Descriptions, Track Search, and Algorithm Renaming',
  },
  {
    version: '1.0.0',
    date: 'June 22, 2023',
    notes: [
      'Added Artist Mashup Algorithm.',
      'Added From Artist to Artist Algorithm.',
      'Added Full Control Algorithm.',
      'Added Good Beats to Good Sleeps Algorithm.',
    ],
    title: 'Initial Release',
  },
]

const Changelog = () => {
  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>
        Changelog
      </Typography>
      <Typography textAlign="center" variant="body1" gutterBottom>
        As I tweak playlist generators and make other changes, I will to track them here.
      </Typography>
      <Container>
        <List>
          {changelogData.map((entry, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                primary={`${entry.version} - ${entry.title}`}
                secondary={entry.date}
                primaryTypographyProps={{ variant: 'h6' }}
                secondaryTypographyProps={{ variant: 'subtitle1' }}
              />
              <Typography variant="body1" sx={{ marginLeft: '2rem', width: '70%' }}>
                <List>
                  {entry.notes.map((note, index) => (
                    <ListItem key={index}>
                      <Description sx={{ marginRight: '0.5rem' }} />
                      <ListItemText primary={note} />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </ListItem>
          ))}
        </List>
      </Container>
    </Container>
  )
}

export default Changelog

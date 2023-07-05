import React from 'react'
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material'
import { Description } from '@mui/icons-material'
import { pageWrapperCSS } from 'theme'

const changelogData: Array<{ version: string, date: string, title: string, notes: string[] }> = [
  {
    version: '1.1.0',
    date: 'July 4, 2023',
    notes: [
      'Added descriptions for playlists'
    ],
    title: 'Initial Release'
  },
  {
    version: '1.0.0',
    date: 'June 22, 2023',
    notes: [
      'Added Artist Mashup Algorithm',
      'Added From Artist to Artist Algorithm',
      'Added Full Control Algorithm',
      'Added Good Beats to Good Sleeps Algorithm'
    ],
    title: 'Initial Release'
  }
]

const Changelog = () => {
  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>Changelog</Typography>
      <Typography textAlign="center" variant="body1" gutterBottom>As I tweak playlist generators and make other changes, I will to track them here.</Typography>
      <Container>
        <List>
          {changelogData.map((entry, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText
                primary={`${entry.version} - ${entry.title}`}
                secondary={entry.date}
                primaryTypographyProps={{ variant: 'h6' }}
                secondaryTypographyProps={{ variant: 'subtitle1' }}
              />
              <Typography variant="body1" sx={{ marginLeft: '2rem' }}>
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
    </Container >
  )
}

export default Changelog

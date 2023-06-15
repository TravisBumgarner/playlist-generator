import React, { useState } from 'react'
import { Container, Typography, Button, MenuItem, Select, Box, InputLabel } from '@mui/material'

enum AvailableValue {
  Acousticness = 'Acousticness',
  Danceability = 'Danceability',
  Energy = 'Energy',
  Instrumentalness = 'Instrumentalness',
  Key = 'Key',
  Liveness = 'Liveness',
  Loudness = 'Loudness',
  Mode = 'Mode',
  Popularity = 'Popularity',
  Speechiness = 'Speechiness',
  TempoSignature = 'Temposignature',
  Valence = 'Valence',
}

interface Item {
  value: AvailableValue
  start: string
  end: string
}

const Sandbox = () => {
  const [selectedValues, setSelectedValues] = useState<AvailableValue[]>([])
  const [items, setItems] = useState<Item[]>([])

  const handleClick = (value: AvailableValue) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
      setItems([...items, { value, start: 'medium', end: 'medium' }])
    }
  }

  const handleStartChange = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index].start = value
    setItems(updatedItems)
  }

  const handleEndChange = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index].end = value
    setItems(updatedItems)
  }

  return (
    <Container>
      <Typography variant="h1">Sandbox</Typography>
      <Typography variant="body1">What would you like to control?</Typography>
      {Object.values(AvailableValue).map((value) => (
        <Box key={value} sx={{ marginBottom: '1rem', display: 'flex', height: '60px' }}>
          <Button
            variant={selectedValues.includes(value) ? 'contained' : 'outlined'}
            onClick={() => { handleClick(value) }}
            sx={{ marginRight: '0.5rem', width: '250px' }}
          >
            {selectedValues.includes(value) ? 'Disable' : 'Enable'} {value}
          </Button>
          {selectedValues.includes(value) && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InputLabel>Start playlist on</InputLabel>
              <Select
                value={items.find((item) => item.value === value)?.start ?? 'low'}
                onChange={(event) => { handleStartChange(items.findIndex((item) => item.value === value), event.target.value) }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              <InputLabel>and end on</InputLabel>
              <Select
                value={items.find((item) => item.value === value)?.end ?? 'low'}
                onChange={(event) => { handleEndChange(items.findIndex((item) => item.value === value), event.target.value) }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </Box>
          )}
        </Box>
      ))}
    </Container>
  )
}

export default Sandbox

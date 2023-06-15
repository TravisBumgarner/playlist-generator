import React, { useState } from 'react'
import { Container, Typography, Button, MenuItem, Select, Box, InputLabel } from '@mui/material'

enum AvailableValue {
  Acousticness = 'Acousticness',
  Danceability = 'Danceability',
  Energy = 'Energy',
  Instrumentalness = 'Instrumentalness',
  Popularity = 'Popularity',
  Tempo = 'Tempo',
  Mood = 'Mood', // Valence
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

  const handleSubmit = () => {
    console.log(items.filter(({ value }) => selectedValues.includes(value)))
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
        <Box key={value} sx={{ marginBottom: '1rem', display: 'flex', height: '70px', boxSizing: 'border-box' }}>
          <Button
            variant={selectedValues.includes(value) ? 'contained' : 'outlined'}
            onClick={() => {
              handleClick(value)
            }}
            sx={{ marginRight: '0.5rem', width: '250px' }}
          >
            {value}
          </Button>
          {selectedValues.includes(value) && (
            <>
              <Box sx={{ flexGrow: 0.5 }}>
                <InputLabel id="start">Start playlist</InputLabel>
                <Select
                  fullWidth
                  labelId="start"
                  value={items.find((item) => item.value === value)?.start}
                  onChange={(event) => {
                    handleStartChange(
                      items.findIndex((item) => item.value === value),
                      event.target.value
                    )
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </Box>
              <Box sx={{ flexGrow: 0.5 }}>
                <InputLabel id="end">End Playlist</InputLabel>
                <Select
                  fullWidth
                  labelId="end"
                  value={items.find((item) => item.value === value)?.end}
                  onChange={(event) => {
                    handleEndChange(
                      items.findIndex((item) => item.value === value),
                      event.target.value
                    )
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </Box>
            </>
          )}
        </Box >
      ))}
      <Button disabled={selectedValues.length === 0} fullWidth variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Container >
  )
}

export default Sandbox

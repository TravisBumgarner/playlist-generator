import React, { useState } from 'react'
import { Container, Typography, Button, MenuItem, Select } from '@mui/material'

enum AvailableValue {
  Acousticness = 'acousticness',
  Danceability = 'danceability',
  Energy = 'energy',
  Instrumentalness = 'instrumentalness',
  Key = 'key',
  Liveness = 'liveness',
  Loudness = 'loudness',
  Mode = 'mode',
  Popularity = 'popularity',
  Speechiness = 'speechiness',
  TempoSignature = 'temposignature',
  Valence = 'valence',
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
      setItems([...items, { value, start: 'low', end: 'low' }])
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
        <div key={value} style={{ marginBottom: '1rem' }}>
          <Button
            variant={selectedValues.includes(value) ? 'contained' : 'outlined'}
            onClick={() => { handleClick(value) }}
            style={{ marginRight: '0.5rem' }}
          >
            {value}
          </Button>
          {selectedValues.includes(value) && (
            <div>
              <Select
                value={items.find((item) => item.value === value)?.start || 'low'}
                onChange={(event) => { handleStartChange(items.findIndex((item) => item.value === value), event.target.value) }}
                style={{ marginRight: '0.5rem' }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              <Select
                value={items.find((item) => item.value === value)?.end || 'low'}
                onChange={(event) => { handleEndChange(items.findIndex((item) => item.value === value), event.target.value) }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </div>
          )}
        </div>
      ))}
    </Container>
  )
}

export default Sandbox

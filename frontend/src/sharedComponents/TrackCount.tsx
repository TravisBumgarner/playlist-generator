import React, { useState, useEffect } from 'react'
import { Container, Slider, Typography } from '@mui/material'

export const MIN_TRACK_COUNT = 20

const formatDuration = (hours: number, minutes: number) => {
  const hourLabel = hours === 1 ? 'hour' : 'hours'
  const minuteLabel = minutes === 1 ? 'minute' : 'minutes'

  let formattedDuration = ''
  if (hours > 0) {
    formattedDuration += `${hours} ${hourLabel}`
    if (minutes > 0) {
      formattedDuration += ` ${minutes} ${minuteLabel}`
    }
  } else {
    formattedDuration = `${minutes} ${minuteLabel}`
  }

  return formattedDuration
}
interface TrackCountProps {
  trackCountCallback: (trackCount: number) => void
}

const TrackCount = ({ trackCountCallback }: TrackCountProps) => {
  const [value, setValue] = useState(MIN_TRACK_COUNT)
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 })

  useEffect(() => {
    const calculateDuration = () => {
      const totalMinutes = value * 3
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      setDuration({ hours, minutes })
    }

    calculateDuration()
  }, [value])

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
    trackCountCallback(newValue as number)
  }

  return (
    <Container sx={{ marginBottom: '1rem' }}>
      <Typography textAlign="center" variant='h6'>Desired Number of Tracks</Typography>
      <Typography textAlign="center" variant='body1'>
        Note - The more obscure the request, the harder it will be to meet the desired number of tracks.
      </Typography>

      <Slider
        value={value}
        onChange={handleChange}
        min={20}
        max={500}
        step={5}
        marks={[{ value: 20, label: '20' }, { value: 500, label: '500' }]}
      />
      <Typography textAlign="center" variant='body1'>
        Selected: {value} track{value !== 1 && 's'} | Estimated Duration: {formatDuration(duration.hours, duration.minutes)}
      </Typography>
    </Container>
  )
}

export default TrackCount

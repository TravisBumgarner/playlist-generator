import { Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const FULL_MESSAGE = 'Loading...'

const Loading = () => {
  const [displayLength, setDisplayLength] = useState<number>(FULL_MESSAGE.length)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayLength((prev) => (prev === FULL_MESSAGE.length ? 0 : prev + 2))
    }, 125)

    return () => { clearInterval(intervalId) }
  }, [displayLength])

  return (
        <Container>
            <Typography variant="body1">{FULL_MESSAGE.slice(0, displayLength)}</Typography>
        </Container>
  )
}

export default Loading

import { Container, Typography } from '@mui/material'

import { pageWrapperCSS } from 'theme'

const AlgorithmWrapper = ({ title, description, children }: { title: string, description: string, children: any }) => {
  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>{title}</Typography>
      <Typography variant="body1" gutterBottom>{description}</Typography>
      <Container>
        {children}
      </Container>
    </Container >
  )
}

export default AlgorithmWrapper

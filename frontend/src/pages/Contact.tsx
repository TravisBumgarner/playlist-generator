import { Box, Button, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageWrapper from '../styles/shared/PageWrapper'
import { SPACING } from '../styles/styleConsts'

const MAX_CHARS = 800

const Contact = () => {
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: 'manifest-playlists-contact',
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'message' && e.target.value.length > MAX_CHARS) {
      return
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        const response = await fetch('https://contact-form.nfshost.com/contact', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
          setSuccess(true)
          setFormData((prev) => ({ ...prev, name: '', email: '', message: '' }))
        } else {
          setFailure(true)
        }
      } catch {
        setFailure(true)
      }
      setIsSubmitting(false)
    },
    [formData],
  )

  const buttonMessage = useMemo(() => {
    if (isSubmitting) return 'Sending...'
    if (success) return 'Sent!'
    if (failure) return 'Failed to send'
    return 'Send'
  }, [isSubmitting, success, failure])

  useEffect(() => {
    if (!success && !failure) return
    const timeout = setTimeout(() => {
      setSuccess(false)
      setFailure(false)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [success, failure])

  return (
    <PageWrapper width="small">
      <Typography variant="h2" gutterBottom>
        Request a Playlist Generator
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: SPACING.MEDIUM.PX }}>
        Have an idea for a playlist generator? Let me know and I'll build it.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.SMALL.PX, width: '100%' }}
      >
        <TextField placeholder="Name (optional)" name="name" value={formData.name} onChange={handleChange} />
        <TextField
          placeholder="Email (optional)"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Typography variant="body2" sx={{ alignSelf: 'flex-end', opacity: 0.6 }}>
          {formData.message.length}/{MAX_CHARS}
        </Typography>
        <TextField
          placeholder="Describe the playlist generator you'd like..."
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          multiline
        />
        <Button variant="contained" type="submit" disabled={isSubmitting || formData.message.length === 0}>
          {buttonMessage}
        </Button>
      </Box>
      {success && (
        <Typography sx={{ marginTop: SPACING.SMALL.PX }} variant="body1" color="success.main">
          Thanks for the suggestion!
        </Typography>
      )}
      {failure && (
        <Typography sx={{ marginTop: SPACING.SMALL.PX }} variant="body1" color="error.main">
          Something went wrong. Please try again.
        </Typography>
      )}
    </PageWrapper>
  )
}

export default Contact

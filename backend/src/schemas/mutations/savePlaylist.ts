import axios from 'axios'
import type { TCreatePlaylist } from 'playlist-generator-utilities'

export default async function savePlaylist(args: TCreatePlaylist['Request']): Promise<string> {
  const { uris, accessToken, playlistTitle, playlistDescription } = args

  // Get user profile to get user ID
  const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const userId = profileResponse.data.id

  // Spotify does not allow returns in a description.
  const trimmedDescription = playlistDescription.replace(/(\r\n|\n|\r)/gm, '')

  // Create playlist
  const playlistResponse = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name: playlistTitle || 'No title supplied',
      description: trimmedDescription || 'No description supplied',
      public: false,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )

  // Add tracks to playlist
  await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistResponse.data.id}/tracks`,
    {
      uris,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )

  return playlistResponse.data.external_urls.spotify
}

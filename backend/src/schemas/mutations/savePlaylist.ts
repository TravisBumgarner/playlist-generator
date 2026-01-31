import axios from 'axios'
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import type { TCreatePlaylist } from 'playlist-generator-utilities'

const savePlaylist = {
  type: GraphQLString,
  description: 'Save a collection of tracks to spotify',
  args: {
    playlistTitle: { type: new GraphQLNonNull(GraphQLString) },
    playlistDescription: { type: new GraphQLNonNull(GraphQLString) },
    accessToken: { type: new GraphQLNonNull(GraphQLString) },
    uris: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
  },
  resolve: async (_: any, { uris, accessToken, playlistTitle, playlistDescription }: TCreatePlaylist['Request']) => {
    try {
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
    } catch (error: any) {
      console.log(error)
      console.log(error.name)
      console.log(error.message)
      return null
    }
  },
}

export default savePlaylist

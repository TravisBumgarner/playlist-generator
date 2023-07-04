import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import getSpotifyClient from '../../spotify'
import { TCreatePlaylist } from 'playlist-generator-utilities'

export const savePlaylist = {
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
      const client = await getSpotifyClient()
      client.setAccessToken(accessToken)

      // Spotify does not allow returns in a description.
      const trimmedDescription = playlistDescription.replace(/(\r\n|\n|\r)/gm, "")
      console.log(trimmedDescription)
      const playlist = await client.createPlaylist(playlistTitle || "No title supplied", { description: trimmedDescription || "No description supplied" })

      await client.addTracksToPlaylist(playlist.body.id, uris)
      return playlist.body.external_urls.spotify
    } catch (error: any) {
      console.log(error)
      console.log(error.name)
      console.log(error.message)
      return null
    }
  }
}
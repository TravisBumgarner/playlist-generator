import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import getSpotifyClient from '../../spotify'
import { TCreatePlaylist } from 'playlist-generator-utilities'

export const savePlaylist = {
  type: GraphQLString,
  description: 'Save a collection of tracks to spotify',
  args: {
    playlistTitle: { type: new GraphQLNonNull(GraphQLString) },
    accessToken: { type: new GraphQLNonNull(GraphQLString) },
    uris: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
  },
  resolve: async (_: any, { uris, accessToken, playlistTitle }: TCreatePlaylist['Request']) => {
    try {
      const client = await getSpotifyClient()
      client.setAccessToken(accessToken)
      const playlist = await client.createPlaylist(playlistTitle || "No title supplied")

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
import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import getSpotifyClient from '../../spotify'
import { PlaylistType, EMarkets } from '../types'

type GetRecommendationsOptions = {
  seed_artists: string[] | string
  market: string,
  limit: number,
  min_energy: number,
  max_energy: number
}

type CreateEnergizingPlaylistArgs = {
  artistId: string,
}

const getRecommendations = async (options: GetRecommendationsOptions) => {
  const client = await getSpotifyClient()
  try {
    const results = await client.getRecommendations(options)
    return results.body?.tracks?.map(({ id, name, artists, album, uri, external_urls: { spotify } }) => {
      return {
        id,
        artists: artists.map(artist => ({ name: artist.name, href: artist.external_urls.spotify })),
        album: {
          name: album.name,
          href: album.external_urls.spotify
        },
        image: album.images.length > 0 ? album.images[0].url : '',
        name,
        uri,
        href: spotify
      }
    })
  } catch (error: any) {
    console.log(error)
    console.log(error.name)
    console.log(error.message)
    return []
  }
}

export const createEnergizingPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'Start with an artist, and create a playlist of increasingly energetic songs',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId }: CreateEnergizingPlaylistArgs) => {
    const promises = await Promise.all([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(async (minEnergy) => {
      const options = { seed_artists: artistId, market: EMarkets.US, limit: 10, min_energy: minEnergy, max_energy: minEnergy + 0.1 }
      return getRecommendations(options)
    }))
    return promises.flat()
  }
}
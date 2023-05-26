import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { getRecommendations } from '../../spotify'
import { PlaylistType, EMarkets } from '../types'

type CreateProgressivelyEnergeticPlaylistArgs = {
  artistId: string,
}


export const createProgressivelyEnergeticPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'Start with an artist, and create a playlist of increasingly energetic songs',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId }: CreateProgressivelyEnergeticPlaylistArgs) => {
    const promises = await Promise.all([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(async (minEnergy) => {
      const options = { seed_artists: artistId, market: EMarkets.US, limit: 10, min_energy: minEnergy, max_energy: minEnergy + 0.1 }
      return getRecommendations(options)
    }))
    return promises.flat()
  }
}
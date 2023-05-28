import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'

type CreateProgressivelyEnergeticPlaylistArgs = {
  artistId: string,
  market: string
}


export const createProgressivelyEnergeticPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId, market }: CreateProgressivelyEnergeticPlaylistArgs) => {
    const promises = await Promise.all([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(async (minEnergy) => {
      const options = { seed_artists: artistId, market, limit: 10, min_energy: minEnergy, max_energy: minEnergy + 0.1 }
      return getRecommendationsForPlaylist(options)
    }))
    return promises.flat()
  }
}
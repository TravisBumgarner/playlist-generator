import {  GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist, getRelatedArtistFromArtists } from '../../spotify'
import { PlaylistType } from '../types'
import { TFullControl } from 'utilities'

export const createFullControlPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId, market }: TFullControl['Request']): Promise<TFullControl['Response']>  => {
    const promise = await getRecommendationsForPlaylist({ seed_artists: artistId, market, limit: 20 })
    console.log(promise)
    return Object.values(promise)
  }
}
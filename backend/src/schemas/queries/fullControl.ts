import {  GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist, getRelatedArtistFromArtists } from '../../spotify'
import { PlaylistType } from '../types'
import { TPlaylistEntry } from '../../types'

type FullControlParams = {
  artistId: string,
  market: string
}

export const createFullControlPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId, market }: FullControlParams): Promise<TPlaylistEntry[]>  => {
    const promise = await getRecommendationsForPlaylist({ seed_artists: artistId, market, limit: 20 })
    console.log(promise)
    return Object.values(promise)
  }
}
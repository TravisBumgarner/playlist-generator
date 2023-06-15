import {  GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist, getRelatedArtistFromArtists } from '../../spotify'
import { PlaylistType } from '../types'
import { shuffle } from '../../utilities'
import { TPlaylistEntry } from '../../types'

type FromArtistToArtistParams = {
  artistIds: string[],
  market: string
}

export const createArtistMashupPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistIds: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistIds, market }: FromArtistToArtistParams): Promise<TPlaylistEntry[]>  => {
    const promises = await Promise.all(artistIds.map(artistId => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit: 20 })))
    const dedupped = promises.reduce((accum, curr) => ({...accum, ...curr}), {} as { [key: string]: TPlaylistEntry })
    return shuffle(Object.values(dedupped))
  }
}
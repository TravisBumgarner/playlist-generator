import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'
import { shuffle } from '../../utilities'
import { TAlgorithmMashup, TPlaylistEntry } from 'playlist-generator-utilities'

const playlistMashup = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistIds: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    trackIds: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    trackCount: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: any, req: TAlgorithmMashup['Request']): Promise<TAlgorithmMashup['Response']> => {
    const { artistIds, trackIds, market, trackCount } = req
    const limit = Math.ceil(trackCount / (artistIds.length + trackIds.length))
    const artistPromises = await Promise.all(artistIds.map(artistId => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit })))
    const trackPromises = await Promise.all(trackIds.map(trackId => getRecommendationsForPlaylist({ seed_tracks: trackId, market, limit })))
    const deduped = [...artistPromises, ...trackPromises].reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
    return shuffle(Object.values(deduped))
  }
}

export default playlistMashup
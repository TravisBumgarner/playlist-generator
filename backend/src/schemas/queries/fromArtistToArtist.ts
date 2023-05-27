import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'

type FromArtistToArtistParams = {
  artistIdStart: string,
  artistIdEnd: string,
  market: string
}

export const createFromArtistToArtistPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'Start with a start artist and an end artist, and create a playlist of songs between the two.',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistIdStart, artistIdEnd, market }: FromArtistToArtistParams) => {
    const baseOptions: { seed_artists: string[], market: string, limit: number } = { seed_artists: [], market, limit: 1 }
    // Ooh look at this possibility for a recursive solution.
    const artists = [
      artistIdStart,
      null,
      null,
      null,
      artistIdEnd
    ]

    const options2 = { ...baseOptions }
    options2.seed_artists.push(artistIdStart, artistIdEnd)
    const result2 = await getRecommendationsForPlaylist(options2)
    artists[2] = result2[0].artists[0].name

    const options1 = { ...baseOptions }
    options1.seed_artists.push(artistIdStart, artists[2])
    const result1 = await getRecommendationsForPlaylist(options1)
    artists[1] = result1[0].artists[0].name

    const options4 = { ...baseOptions }
    options4.seed_artists.push(artistIdStart, artistIdEnd)
    const result4 = await getRecommendationsForPlaylist(options4)
    artists[4] = result1[0].artists[0].name




    return promises.flat()
  }
}
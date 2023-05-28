import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'

type GoodBeatsToGoodSleepsArgs = {
  artistId: string,
  market: string
}

export const createGoodBeatsToGoodSleepsPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId, market }: GoodBeatsToGoodSleepsArgs) => {
    const promises = await Promise.all([{ max: 0.7, min: 0.5 }, { max: 0.5, min: 0.3 }, { max: 0.3, min: 0 }].map(async ({ min, max }) => {
      // 3 different energies, 4 songs each, at 3 min each -> ~30 minutes of music before white noise
      const options = { seed_artists: artistId, market, limit: 10, min_energy: min, max_energy: max }
      const recs = await getRecommendationsForPlaylist(options)
      return recs
    }))
    const songs = promises.flat()
    const whiteNoise = {
      "id": "2RrTfwz7prB7ImgbxdWOcE",
      "name": "Brown Noise 3 Hours Long",
      "artists": [{
        "href": "https://open.spotify.com/artist/1gcRoyXGH7Q9edsGVBRWpA",
        "name": "quietly3",
      }],
      "uri": "spotify:track:71oyfN3IbiMC6wbjljHXeT",
      "href": "https://open.spotify.com/album/2RrTfwz7prB7ImgbxdWOcE",
      "album": {
        "name": "quietly3",
        "href": "https://open.spotify.com/artist/1gcRoyXGH7Q9edsGVBRWpA"
      },
      "image": "https://i.scdn.co/image/ab67616d0000b273b9c473a56b01feb40c7b982c"
    }

    return [...songs, whiteNoise, whiteNoise, whiteNoise]
  }
}




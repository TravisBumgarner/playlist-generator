import { GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql'

import { GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'
import { SearchType, TAlgorithmGoodBeatsToGoodSleeps, TPlaylistEntry } from 'playlist-generator-utilities'

const playlistGoodBeatsToGoodSleeps = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    selectedId: { type: new GraphQLNonNull(GraphQLString) },
    selectedType: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    trackCount: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: any, { selectedId, selectedType, market, trackCount }: TAlgorithmGoodBeatsToGoodSleeps['Request']): Promise<TAlgorithmGoodBeatsToGoodSleeps['Response']> => {
    const intervals = [{ max: 0.7, min: 0.5 }, { max: 0.5, min: 0.3 }, { max: 0.3, min: 0 }]
    const limit = Math.ceil(trackCount / intervals.length)
    const promises = await Promise.all(intervals.map(async ({ min, max }) => {

      const options: GetRecommendationsForPlaylistOptions = { market, limit, min_energy: min, max_energy: max }
      if (selectedType === SearchType.Artist) {
        options.seed_artists = selectedId
      } else if (selectedType === SearchType.Track) {
        options.seed_tracks = selectedId
      }
      console.log(options)
      const recs = await getRecommendationsForPlaylist(options)
      return recs
    }))
    console.log(promises)
    const deduped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
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

    return [...Object.values(deduped), whiteNoise, whiteNoise, whiteNoise]
  }
}

export default playlistGoodBeatsToGoodSleeps
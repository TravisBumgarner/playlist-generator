import { SearchType, type TAlgorithmGenreDrift, type TPlaylistEntry } from 'playlist-generator-utilities'
import { getRecommendationsForPlaylist, getRecommendedArtist } from '../../spotify'

export default async function playlistGenreDrift(
  args: TAlgorithmGenreDrift['Request'],
): Promise<TAlgorithmGenreDrift['Response']> {
  const { startWithId, startWithType, endWithId, endWithType, market, trackCount } = args

  const start = { id: startWithId, type: startWithType }
  const end = { id: endWithId, type: endWithType }

  const middle = { id: await getRecommendedArtist(market, [start, end]), type: SearchType.Artist }
  const beforeMiddle = { id: await getRecommendedArtist(market, [start, middle]), type: SearchType.Artist }
  const afterMiddle = { id: await getRecommendedArtist(market, [middle, end]), type: SearchType.Artist }

  const waypoints = [start, beforeMiddle, middle, afterMiddle, end]
  const limit = Math.ceil(trackCount / waypoints.length)

  const promises = waypoints.map(({ id, type }) => {
    if (type === SearchType.Artist) {
      return getRecommendationsForPlaylist({ seed_artists: id, market, limit })
    }
    return getRecommendationsForPlaylist({ seed_tracks: id, market, limit })
  })

  const results = await Promise.all(promises)
  const deduped = results.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
  return Object.values(deduped)
}

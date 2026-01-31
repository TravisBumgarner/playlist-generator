import { SearchType, type TAlgorithmGradient, type TPlaylistEntry } from 'playlist-generator-utilities'
import { getRecommendationsForPlaylist, getRecommendedArtist } from '../../spotify'

export default async function playlistGradient(
  args: TAlgorithmGradient['Request'],
): Promise<TAlgorithmGradient['Response']> {
  const { startWithId, startWithType, endWithType, endWithId, market, trackCount } = args

  // Ooh look at this possibility for a recursive solution.
  const start = { id: startWithId, type: startWithType }
  const end = { id: endWithId, type: endWithType }

  const middle = { id: await getRecommendedArtist(market, [start, end]), type: SearchType.Artist }
  const beforeMiddle = { id: await getRecommendedArtist(market, [start, middle]), type: SearchType.Artist }
  const afterMiddle = { id: await getRecommendedArtist(market, [middle, end]), type: SearchType.Artist }

  const ids = [start, beforeMiddle, middle, afterMiddle, end]

  const limit = Math.ceil(trackCount / ids.length)
  const promises: Promise<{ [key: string]: TPlaylistEntry }>[] = []

  ids.forEach(async ({ id, type }) => {
    if (type === SearchType.Artist) {
      promises.push(getRecommendationsForPlaylist({ seed_artists: id, market, limit }))
    } else if (type === SearchType.Track) {
      promises.push(getRecommendationsForPlaylist({ seed_tracks: id, market, limit }))
    }
  })
  const promised = await Promise.all(promises)
  const deduped = promised.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
  return Object.values(deduped)
}

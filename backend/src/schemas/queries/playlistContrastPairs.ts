import { SearchType, type TAlgorithmContrastPairs, type TPlaylistEntry } from 'playlist-generator-utilities'
import { getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistContrastPairs(
  args: TAlgorithmContrastPairs['Request'],
): Promise<TAlgorithmContrastPairs['Response']> {
  const { firstId, firstType, secondId, secondType, market, trackCount } = args
  const halfCount = Math.ceil(trackCount / 2)

  const [firstResults, secondResults] = await Promise.all([
    getRecommendationsForPlaylist({
      market,
      limit: halfCount,
      ...(firstType === SearchType.Artist ? { seed_artists: firstId } : { seed_tracks: firstId }),
    }),
    getRecommendationsForPlaylist({
      market,
      limit: halfCount,
      ...(secondType === SearchType.Artist ? { seed_artists: secondId } : { seed_tracks: secondId }),
    }),
  ])

  const firstTracks = Object.values(firstResults)
  const secondTracks = Object.values(secondResults)
  const interleaved: TPlaylistEntry[] = []

  const maxLen = Math.max(firstTracks.length, secondTracks.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < firstTracks.length) interleaved.push(firstTracks[i])
    if (i < secondTracks.length) interleaved.push(secondTracks[i])
  }

  return interleaved
}

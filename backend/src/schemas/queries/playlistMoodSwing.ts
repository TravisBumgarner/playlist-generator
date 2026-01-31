import { SearchType, type TAlgorithmMoodSwing, type TPlaylistEntry } from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistMoodSwing(
  args: TAlgorithmMoodSwing['Request'],
): Promise<TAlgorithmMoodSwing['Response']> {
  const { selectedId, selectedType, market, trackCount } = args
  const halfCount = Math.ceil(trackCount / 2)

  const baseOptions: Partial<GetRecommendationsForPlaylistOptions> = { market, limit: halfCount }
  if (selectedType === SearchType.Artist) {
    baseOptions.seed_artists = selectedId
  } else if (selectedType === SearchType.Track) {
    baseOptions.seed_tracks = selectedId
  }

  const [highValence, lowValence] = await Promise.all([
    getRecommendationsForPlaylist({
      ...baseOptions,
      min_valence: 0.7,
      target_valence: 0.9,
    } as GetRecommendationsForPlaylistOptions),
    getRecommendationsForPlaylist({
      ...baseOptions,
      max_valence: 0.3,
      target_valence: 0.1,
    } as GetRecommendationsForPlaylistOptions),
  ])

  const highTracks = Object.values(highValence)
  const lowTracks = Object.values(lowValence)
  const interleaved: TPlaylistEntry[] = []

  const maxLen = Math.max(highTracks.length, lowTracks.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < highTracks.length) interleaved.push(highTracks[i])
    if (i < lowTracks.length) interleaved.push(lowTracks[i])
  }

  return interleaved
}

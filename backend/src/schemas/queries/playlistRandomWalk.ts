import { SearchType, type TAlgorithmRandomWalk, type TPlaylistEntry } from 'playlist-generator-utilities'
import { getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistRandomWalk(
  args: TAlgorithmRandomWalk['Request'],
): Promise<TAlgorithmRandomWalk['Response']> {
  const { selectedId, selectedType, market, trackCount } = args

  const playlist: TPlaylistEntry[] = []
  let currentId = selectedId
  let currentType = selectedType

  for (let i = 0; i < trackCount; i++) {
    const results = await getRecommendationsForPlaylist({
      market,
      limit: 1,
      ...(currentType === SearchType.Artist ? { seed_artists: currentId } : { seed_tracks: currentId }),
    })

    const tracks = Object.values(results)
    if (tracks.length === 0) break

    const track = tracks[0]
    playlist.push(track)
    currentId = track.id
    currentType = SearchType.Track
  }

  return playlist
}

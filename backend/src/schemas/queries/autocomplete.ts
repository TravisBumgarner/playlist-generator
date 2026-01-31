import axios from 'axios'
import { SearchType, type TAutocomplete, type TAutocompleteEntry } from 'playlist-generator-utilities'
import getSpotifyAccessToken from '../../spotify'

export default async function autocomplete({
  query,
  market,
}: {
  query: string
  market: string
}): Promise<TAutocomplete['Response']> {
  const accessToken = await getSpotifyAccessToken()

  // hard coding for now, I suspect I'll want to expand.
  const TYPES = ['artist', 'track'] as const

  const params = new URLSearchParams({
    q: query,
    type: TYPES.join(','),
    market,
    offset: '0',
    limit: '10',
  })

  const spotifyResults = await axios.get(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const autocompleteResults: TAutocompleteEntry[] = []

  if (TYPES.includes('artist') && spotifyResults?.data?.artists?.items) {
    spotifyResults.data.artists.items.forEach(({ id, name, images }) => {
      autocompleteResults.push({
        id,
        name,
        image: images.length > 0 ? images[0].url : '',
        type: SearchType.Artist,
      })
    })
  }

  if (TYPES.includes('track') && spotifyResults?.data?.tracks?.items) {
    spotifyResults.data.tracks.items.forEach(({ id, name, album }) => {
      autocompleteResults.push({
        id,
        name,
        image: album.images.length > 0 ? album.images[0].url : '',
        type: SearchType.Track,
      })
    })
  }

  return autocompleteResults
}

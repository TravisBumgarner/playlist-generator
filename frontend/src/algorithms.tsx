import {
  FromArtistToArtist,
  GoodBeatsToGoodSleeps,
  ArtistMashup,
  FullControl
} from './pages/algorithms'

interface TAlgorithm {
  title: string
  href: string
  description: string
  component: (title: string, description: string) => JSX.Element
}

export const ALGORITHM_ROUTES: TAlgorithm[] = [
  {
    title: 'Artist Mashup',
    href: '/a/artist_mashup',
    description:
      'Pick several artists. Generate a playlist that jumps between recommended tracks from each artist.',
    component: (title, description) => (
      <ArtistMashup title={title} description={description} />
    )
  },
  {
    title: 'From Artist to Artist',
    href: '/a/from_artist_to_artist',
    description:
      'Pick two artists. Generate a playlist of tracks that starts with one artist, moves through related artists, and ends with the other.',
    component: (title, description) => (
      <FromArtistToArtist title={title} description={description} />
    )
  },
  {
    title: 'Full Control',
    href: '/a/full_control',
    description:
      'Pick an artist. Generate a playlist where you can tweak everything about the tracks of the playlist.',
    component: (title, description) => (
      <FullControl title={title} description={description} />
    )
  },
  {
    title: 'Good Beats to Good Sleeps',
    href: '/a/good_beats_to_good_sleeps',
    description:
      'Pick an artist. Generate a playlist that starts with tracks related to the artist and ends with enough white noise to last you through the night.',
    component: (title, description) => (
      <GoodBeatsToGoodSleeps title={title} description={description} />
    )
  }
]
